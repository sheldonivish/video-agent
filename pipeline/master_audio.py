#!/usr/bin/env python3
"""Master the final mix: voice alone, or voice + a licensed music bed ducked under speech.

usage: master_audio.py --voice vo/voice.wav --dur 60.0 --out mix.wav
       master_audio.py --voice vo/voice.wav --music bed.mp3 --dur 60.0 --out mix.wav [--bed-out bed.wav]
options: --target -14 (integrated LUFS)  --tp -1.5 (true-peak ceiling dBTP)
         --under 20 (music sits this many dB under speech)  --lift 4 (dB the bed rises in pauses)
         --pad 0.0 (voice start offset s)  --fade-in 0.8  --fade-out 0.9

The loop re-measures with ebur128 until integrated loudness is within 0.2 LU of target and
true peak is under the ceiling. --bed-out writes the bed alone at the same level, so the voice
can be swapped later without re-rendering. Music must be licensed; credit it where the licence asks."""
import argparse, subprocess, numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--voice", required=True); ap.add_argument("--music"); ap.add_argument("--dur", type=float, required=True)
ap.add_argument("--out", required=True); ap.add_argument("--bed-out")
ap.add_argument("--target", type=float, default=-14.0); ap.add_argument("--tp", type=float, default=-1.5)
ap.add_argument("--under", type=float, default=20.0); ap.add_argument("--lift", type=float, default=4.0)
ap.add_argument("--pad", type=float, default=0.0); ap.add_argument("--fade-in", type=float, default=0.8); ap.add_argument("--fade-out", type=float, default=0.9)
a = ap.parse_args()
SR = 48000; n = int(round(a.dur * SR))

def load(p, extra=()):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", p, *extra, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).copy()
def save(p, x, codec="pcm_f32le"):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0", "-c:a", codec, p],
                   input=x.astype(np.float32).tobytes(), check=True)
def meas(p):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    t = e[e.rfind("Summary:"):]
    return float(t.split("I:")[1].split("LUFS")[0]), float(t.split("Peak:")[1].split("dBFS")[0])

vo = load(a.voice); v = np.zeros(n, np.float32); s0 = int(a.pad * SR); L = max(0, min(len(vo), n - s0)); v[s0:s0 + L] = vo[:L]
mix = v
if a.music:
    mus = load(a.music, ["-af", "highpass=f=40,lowpass=f=11000,equalizer=f=2400:t=q:w=0.9:g=-3.5"])  # carve room for the voice
    m = np.zeros(n, np.float32); m[:min(len(mus), n)] = mus[:n]
    win, hop = int(0.05 * SR), int(0.01 * SR)
    env = np.array([np.sqrt(np.mean(v[i:i + win] ** 2) + 1e-12) for i in range(0, n - win, hop)])
    speech = env > max(10 ** (-34 / 20), 0.18 * np.percentile(env, 80))
    sp = np.interp(np.arange(n), np.arange(len(speech)) * hop, speech.astype(float)) > 0.5
    base = np.sqrt(np.mean(v[sp] ** 2)) / np.sqrt(np.mean(m ** 2) + 1e-12) * 10 ** (-a.under / 20)
    tgt = np.where(speech, 0.0, a.lift); g = tgt[0]; gl = np.zeros_like(tgt); dt = hop / SR
    ca, cr = 1 - np.exp(-dt / 0.11), 1 - np.exp(-dt / 0.55)          # fast duck, slow release
    for i, t in enumerate(tgt): g += (t - g) * (ca if t < g else cr); gl[i] = g
    duck = 10 ** (np.interp(np.arange(n), np.arange(len(gl)) * hop, gl) / 20)
    fade = np.ones(n); fi = int(a.fade_in * SR); fo = int(a.fade_out * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[n - fo:] = np.linspace(1, 0, fo)
    bed = m * base * duck * fade
    mix = v + bed

pre = a.out + ".pre.wav"; g = 0.0
for it in range(8):
    save(pre, mix * 10 ** (g / 20))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", pre, "-af",
                    "aresample=192000,alimiter=limit=0.78:attack=1:release=60:level=disabled,aresample=48000",
                    "-c:a", "pcm_s24le", a.out], check=True)
    I, TP = meas(a.out); print(f"pass {it}: gain {g:+.2f} dB  I {I} LUFS  TP {TP} dBFS")
    if abs(I - a.target) <= 0.2 and TP <= a.tp: break
    g += a.target - I
if a.music and a.bed_out:
    save(a.bed_out, bed * 10 ** (g / 20), "pcm_s24le"); print("bed ->", a.bed_out)
import os; os.remove(pre)
print("master ->", a.out)
