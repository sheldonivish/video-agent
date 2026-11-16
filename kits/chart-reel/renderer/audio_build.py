"""Generate ElevenLabs VO per line, place onto the timeline, emit absolute alignment.
Usage: python3 audio_build.py <scene.json> <outdir>
Writes <outdir>/vo.wav and <outdir>/audio.json (absolute, word/char times)."""
import json, os, sys, base64, hashlib, subprocess, urllib.request, pathlib

CACHE = pathlib.Path(__file__).resolve().parent.parent / "audio_cache"
DEFAULT_VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "")  # your (cloned) voice; or set audio.voice_id in the scene

def tts(text, settings, voice=DEFAULT_VOICE):
    key = hashlib.sha1((voice + text + json.dumps(settings, sort_keys=True)).encode()).hexdigest()[:16]
    CACHE.mkdir(exist_ok=True)
    mp3 = CACHE / f"{key}.mp3"; js = CACHE / f"{key}.json"
    if not (mp3.exists() and js.exists()):
        body = json.dumps({"text": text, "model_id": settings.get("model_id", "eleven_multilingual_v2"),
                           "voice_settings": settings.get("voice_settings", {})}).encode()
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
            data=body, headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                                "Content-Type": "application/json"})
        d = json.loads(urllib.request.urlopen(req, timeout=180).read())
        mp3.write_bytes(base64.b64decode(d["audio_base64"]))
        js.write_text(json.dumps(d, ensure_ascii=False))
    return mp3, json.loads(js.read_text())

def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]))

def main(scene_path, outdir):
    scene = json.load(open(scene_path))
    outdir = pathlib.Path(outdir); outdir.mkdir(parents=True, exist_ok=True)
    A = scene["audio"]; st = scene["audio"].get("settings", {})
    voice = A.get("voice_id") or DEFAULT_VOICE
    if not voice:
        sys.exit("set ELEVENLABS_VOICE_ID or audio.voice_id in the scene")
    print(f"  voice {voice}  model {st.get('model_id')}")

    sr = 44100
    tmp = outdir / "tmp"; tmp.mkdir(exist_ok=True)
    total = scene["meta"]["duration"]
    segs, lines = [], []
    for i, beat in enumerate(A["lines"]):
        mp3, d = tts(beat["text"], st, voice)
        al = d["alignment"]
        wav = tmp / f"b{i}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-ar", str(sr), "-ac", "1", str(wav)], check=True)
        at = float(beat["at"])
        segs.append((wav, at))
        lines.append({"i": i, "text": beat["text"], "at": at, "dur": dur(wav),
                      "chars": al["characters"],
                      "c0": al["character_start_times_seconds"],
                      "c1": al["character_end_times_seconds"]})
        print(f"  beat {i+1}: at {at:6.2f}s  dur {dur(wav):5.2f}s  '{beat['text'][:38]}...'")

    # Place segments on a silent bed of exact total length.
    #
    # This used to be one ffmpeg `adelay` + `amix` graph and it deadlocked twice on
    # this box (100% CPU, futex_wait, output frozen part-written) — an intermittent
    # ffmpeg thread bug, not a bad graph, since the identical command succeeded when
    # re-run by hand. Mixing in numpy instead makes the step deterministic, takes
    # milliseconds, and removes a whole class of "the render just hangs" failures.
    import wave, numpy as np
    n = int(round(total * sr))
    bed = np.zeros(n, dtype=np.float32)
    for wav, at in segs:
        with wave.open(str(wav), "rb") as w:
            assert w.getframerate() == sr and w.getnchannels() == 1
            pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        start = int(round(at * sr))
        end = min(n, start + len(pcm))
        if end > start:
            bed[start:end] += pcm[:end - start]
    peak = float(np.abs(bed).max())
    if peak > 1.0:
        bed /= peak
    with wave.open(str(outdir / "vo_raw.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(bed, -1, 1) * 32767).astype(np.int16).tobytes())

    # loudness-normalise to a consistent phone-listening level
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(outdir / "vo_raw.wav"),
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(sr), "-ac", "1",
                    str(outdir / "vo.wav")], check=True)

    json.dump({"lines": lines, "total": total, "speech_total": round(sum(l["dur"] for l in lines), 2)},
              open(outdir / "audio.json", "w"), ensure_ascii=False, indent=1)
    print(f"  speech total {sum(l['dur'] for l in lines):.2f}s of {total:.1f}s")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
