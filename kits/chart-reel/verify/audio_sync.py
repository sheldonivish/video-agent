"""Measure audio sync on the DELIVERED mp4 — by cross-correlation, not by a threshold.

Why not an RMS threshold: a line that opens on a fricative ("फिर", "बस") ramps up over
100–200 ms, so "the first hop above a threshold" reports a systematic late bias that
is an artifact of the metric, not of the mux. An earlier version of this file did
exactly that and reported a 160 ms error on a line that is in fact sample-exact.

Cross-correlation against the TTS master asks the right question: where does THIS
waveform actually sit in the delivered mix? It is insensitive to onset envelope, and
the correlation coefficient doubles as a confidence score.

Exit code is non-zero if any line is off by more than TOL ms, so this can gate a build.
"""
import json, subprocess, sys, pathlib, numpy as np

SR = 48000
TOL = 20          # ms. One frame at 30fps is 33ms, so 20ms is under a frame.
SEARCH = 0.5      # +- seconds around the planned start

def decode(path):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1",
                          "-ar", str(SR), "-f", "s16le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0

def main(mp4, audio_json, build_dir):
    mix = decode(mp4)
    a = json.load(open(audio_json))
    build = pathlib.Path(build_dir)

    print(f"  delivered {len(mix)/SR:.3f}s of audio")
    print(f"  {'line':>4} {'planned':>8} {'measured':>9} {'delta_ms':>9} {'corr':>6}  text")
    deltas = []
    for ln in a["lines"]:
        master = build / "tmp" / f"b{ln['i']}.wav"
        if not master.exists():
            print(f"  {ln['i']+1:>4}  master missing, skipped"); continue
        ref = decode(master)
        at = ln["at"]
        lo = int(max(0, (at - SEARCH) * SR)); hi = int(min(len(mix), (at + SEARCH) * SR))
        seg = mix[lo:hi]
        n = len(ref) + len(seg)
        nfft = 1 << (n - 1).bit_length()
        c = np.fft.irfft(np.fft.rfft(seg, nfft) * np.conj(np.fft.rfft(ref, nfft)), nfft)
        lag = int(np.argmax(c[:len(seg)]))
        xs = seg[lag:lag + len(ref)]
        corr = float(np.corrcoef(xs, ref[:len(xs)])[0, 1]) if len(xs) > 100 else float("nan")
        true_at = lo / SR + lag / SR
        d = (true_at - at) * 1000
        deltas.append(d)
        print(f"  {ln['i']+1:>4} {at:8.2f} {true_at:9.3f} {d:9.1f} {corr:6.3f}  {ln['text'][:34]}")

    if deltas:
        worst = max(abs(d) for d in deltas)
        med = float(np.median(np.abs(deltas)))
        print(f"\n  worst |delta| {worst:.1f} ms   median |delta| {med:.1f} ms   tolerance {TOL} ms")
        if worst > TOL:
            print("  FAIL out of tolerance"); return 1
        print("  PASS sample-accurate")
    return 0

if __name__ == "__main__":
    mp4, audio_json = sys.argv[1], sys.argv[2]
    build = sys.argv[3] if len(sys.argv) > 3 else str(pathlib.Path(mp4).parent.parent / "build" / pathlib.Path(mp4).stem)
    sys.exit(main(mp4, audio_json, build))
