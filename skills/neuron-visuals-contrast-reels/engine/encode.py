#!/usr/bin/env python3
"""Encode NV frame dumps into a 1080x1920 30fps reel.

Mixes a CC BY / royalty-free music bed with physical foley (no whooshes,
no ticks, no transition noise). Two-pass loudnorm to -14 LUFS / -1 dBTP.
Writes a contact sheet (1 frame / 0.5s) and a cover frame.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import wave
from array import array
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd, **kw):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    return subprocess.run(cmd, check=True, **kw)


def mix_coin_foley(wavs, times, duration, sr=44100, gain=0.52):
    n = int(round(duration * sr))
    mix = [0.0] * n
    samples = []
    for path in wavs:
        with wave.open(str(path), "rb") as w:
            assert w.getsampwidth() == 2
            raw = array("h", w.readframes(w.getnframes()))
            if w.getnchannels() == 2:
                raw = raw[0::2]
            rate = w.getframerate()
            seq = [s / 32768.0 for s in raw]
            if rate != sr:
                # nearest-neighbor resample is fine for short hits
                seq = [seq[min(len(seq) - 1, int(i * rate / sr))] for i in range(int(len(seq) * sr / rate))]
            samples.append(seq)
    peak = 1e-9
    for i, t in enumerate(times):
        src = samples[i % len(samples)]
        off = int(round(t * sr))
        g = gain * (0.90 + 0.10 * ((i * 3) % 5) / 4.0)
        for j, s in enumerate(src):
            k = off + j
            if 0 <= k < n:
                mix[k] += s * g
                if abs(mix[k]) > peak:
                    peak = abs(mix[k])
    # gentle limiter so stacked tails cannot clip
    scale = 0.95 / peak if peak > 0.95 else 1.0
    out = array("h", (max(-32767, min(32767, int(v * scale * 32767))) for v in mix))
    return sr, out


def write_wav_stereo(path, sr, mono):
    stereo = array("h")
    for s in mono:
        stereo.append(s)
        stereo.append(s)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(stereo.tobytes())


def loudnorm_measure(src):
    proc = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-i", str(src),
            "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
            "-f", "null", "-",
        ],
        check=True, capture_output=True, text=True,
    )
    text = proc.stderr
    start = text.rfind("{")
    end = text.rfind("}")
    if start < 0 or end < 0:
        raise RuntimeError("loudnorm did not print JSON\n" + text[-2000:])
    return json.loads(text[start : end + 1])


def ebur128(path):
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    )
    return proc.stderr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", default=str(ROOT / "output" / "frames_raw"))
    ap.add_argument("--out", default=str(ROOT / "output" / "reel.mp4"))
    ap.add_argument("--music", default="", help="Optional licensed music bed (not bundled)")
    ap.add_argument("--foley-dir", default="", help="Optional directory of coin_*.wav hits (not bundled)")
    ap.add_argument("--hits", default="", help="Comma-separated foley times in seconds; default matches examples/pumps_vs_dca.js")
    ap.add_argument("--duration", type=float, default=12.0)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--cover-frame", type=int, default=300)
    args = ap.parse_args()

    frames = Path(args.frames)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    work = out.parent / "_encode_work"
    work.mkdir(exist_ok=True)

    silent = work / "silent.mp4"
    run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-framerate", str(args.fps), "-start_number", "0",
        "-i", str(frames / "f%04d.png"),
        "-frames:v", str(int(round(args.duration * args.fps))),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "15", "-preset", "medium",
        "-r", str(args.fps), str(silent),
    ])

    music = Path(args.music) if args.music else None
    foley_dir = Path(args.foley_dir) if args.foley_dir else None
    if args.hits:
        times = [float(x) for x in args.hits.split(",") if x.strip()]
    else:
        # Default landings match examples/pumps_vs_dca.js: 0.79 + i*0.30, i=0..30
        times = [0.79 + i * 0.30 for i in range(31) if 0.79 + i * 0.30 < args.duration - 0.15]

    coins_wav = None
    if foley_dir:
        wavs = sorted(foley_dir.glob("coin_*.wav"))
        if not wavs:
            raise SystemExit("no coin_*.wav in " + str(foley_dir))
        sr, mono = mix_coin_foley(wavs, times, args.duration)
        coins_wav = work / "coins.wav"
        write_wav_stereo(coins_wav, sr, mono)

    if not music and not coins_wav:
        # Picture only — still write a cover and contact sheet.
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(silent),
            "-c:v", "copy",
            "-movflags", "+faststart",
            "-an", str(out),
        ])
        meas = {}
        ebu = "(no audio)"
        # Jump to contact-sheet + cover below by skipping audio mux.
        audio_done = True
    else:
        audio_done = False
        pre = work / "pre_loudnorm.wav"
        if music and coins_wav:
            run([
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(music), "-i", str(coins_wav),
                "-filter_complex",
                f"[0:a]atrim=0:{args.duration:.3f},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume=0.42[bed];"
                f"[1:a]aformat=channel_layouts=stereo,volume=1.0[fx];"
                f"[bed][fx]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.97[a]",
                "-map", "[a]", "-ar", "44100", str(pre),
            ])
        elif music:
            run([
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(music),
                "-filter_complex",
                f"[0:a]atrim=0:{args.duration:.3f},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume=0.42,alimiter=limit=0.97[a]",
                "-map", "[a]", "-ar", "44100", str(pre),
            ])
        else:
            run([
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(coins_wav),
                "-filter_complex",
                "[0:a]aformat=channel_layouts=stereo,alimiter=limit=0.97[a]",
                "-map", "[a]", "-ar", "44100", str(pre),
            ])

    if not audio_done:
        meas = loudnorm_measure(pre)
        print("loudnorm measured", json.dumps(meas, indent=2))
        measured = work / "measured.json"
        measured.write_text(json.dumps(meas, indent=2))

        audio = work / "loudnorm.wav"
        ln = (
            "loudnorm=I=-14:TP=-1.5:LRA=11:"
            f"measured_I={meas['input_i']}:"
            f"measured_LRA={meas['input_lra']}:"
            f"measured_TP={meas['input_tp']}:"
            f"measured_thresh={meas['input_thresh']}:"
            f"offset={meas['target_offset']}:"
            "linear=true:print_format=summary"
        )
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(pre), "-af", ln, str(audio),
        ])

        # AAC true-peak overshoot: limit to about -1.2 dBTP before the encoder
        limited = work / "limited.wav"
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(audio),
            "-af", "alimiter=limit=0.87:level=false:attack=5:release=50",
            str(limited),
        ])
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(silent), "-i", str(limited),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            "-shortest", str(out),
        ])

        ebu = ebur128(out)
        print(ebu[ebu.find("Summary:") if "Summary:" in ebu else -2500 :])
    else:
        print(ebu)

    contact = out.parent / "contact_sheet.jpg"
    run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(out),
        "-vf", "select='not(mod(n\\,15))',scale=180:320:flags=lanczos,tile=6x4",
        "-frames:v", "1", "-q:v", "3", str(contact),
    ])

    cover_src = frames / f"f{args.cover_frame:04d}.png"
    cover = out.parent / "cover.png"
    if cover_src.exists():
        cover.write_bytes(cover_src.read_bytes())
    else:
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(out), "-vf", f"select=eq(n\\,{args.cover_frame})",
            "-frames:v", "1", str(cover),
        ])

    stats = {
        "out": str(out),
        "contact": str(contact),
        "cover": str(cover),
        "loudnorm_input": meas,
        "coin_hits": times,
    }
    (out.parent / "encode_stats.json").write_text(json.dumps(stats, indent=2))
    print("wrote", out)
    print("contact", contact)
    print("cover", cover)


if __name__ == "__main__":
    sys.exit(main())
