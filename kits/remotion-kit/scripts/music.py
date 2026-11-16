"""Original music bed synthesized in numpy (no samples, no third-party audio -> no Content ID claims).
Electronic ~BPM groove in F minor: hook hit + riser, plucked 16th arp, rolling bass, drums,
sidechain pump, optional hard stop (silence window) and drop, mastered to -14 LUFS / about -1.8 dBFS peak.

usage: python3 scripts/music.py --bpm 120 --dur 20 [--stop 17.0 17.8] [--out public/audio/music.wav]
Put a big SFX "slam" in the stop window in the video; the drop lands on the end card at the stop's end.
Synthesized in code, so no third-party music file is needed for drafts. Swap in a licensed track for delivery."""
import argparse, wave, os
import numpy as np, pyloudnorm as pyln
from scipy import signal
from scipy.ndimage import minimum_filter1d
ap = argparse.ArgumentParser()
ap.add_argument('--bpm', type=float, default=120); ap.add_argument('--dur', type=float, default=20)
ap.add_argument('--stop', type=float, nargs=2, default=None); ap.add_argument('--out', default='public/audio/music.wav')
ap.add_argument('--lufs', type=float, default=-14.0); ap.add_argument('--seed', type=int, default=1017)
A = ap.parse_args()
SR = 48000; N = int(SR * A.dur); BEAT = 60 / A.bpm; S16 = BEAT / 4
rng = np.random.default_rng(A.seed)
T = lambda n: np.arange(n) / SR
s = lambda t: int(round(t * SR))
def add(buf, x, at, g=1.0):
    at = int(at)
    if at >= len(buf) or at < 0: return
    x = x[: len(buf) - at]
    if x.ndim == 1: x = np.stack([x, x], 1)
    buf[at: at + len(x)] += x * g
def lp(x, fc): return signal.sosfilt(signal.butter(2, min(fc, SR / 2 - 100) / (SR / 2), 'low', output='sos'), x, axis=0)
def hp(x, fc): return signal.sosfilt(signal.butter(2, fc / (SR / 2), 'high', output='sos'), x, axis=0)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x, axis=0)
def saw(f, n, ph=0.0): return 2 * ((np.cumsum(np.broadcast_to(f, (n,))) / SR + ph) % 1.0) - 1
def kick(big=False):
    n = s(0.5 if big else 0.32); t = T(n); f = 46 + 130 * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (5 if big else 9)) + 0.35 * hp(rng.standard_normal(n), 2500) * np.exp(-t * 300)
    return np.tanh(x * (1.8 if big else 1.4))
def hat(o=False): n = s(0.22 if o else 0.05); return hp(rng.standard_normal(n), 7000) * np.exp(-T(n) * (18 if o else 90))
def clap():
    n = s(0.25); t = T(n); x = np.zeros(n)
    for d in (0, 0.008, 0.017):
        st = s(d); x[st:] += bp(rng.standard_normal(n - st), 900, 3200) * np.exp(-T(n - st) * (40 if d < 0.017 else 14))
    return x + 0.3 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
def pluck(f, dur=0.2):
    n = s(dur); t = T(n)
    return lp(0.5 * saw(f * 1.004, n) + 0.5 * saw(f * 0.996, n, 0.3), 3200) * np.exp(-t * 14)
def bassnote(f, dur):
    n = s(dur); t = T(n)
    x = lp(0.6 * saw(f, n) + 0.8 * np.sin(2 * np.pi * f * t), 380) * np.minimum(1, t / 0.004) * np.exp(-t * 3)
    return np.tanh(1.6 * x * np.minimum(1, (dur - t) / 0.01))
def pad(fs, dur, fc=1400):
    n = s(dur); x = np.zeros((n, 2))
    for f in fs:
        for k, d in enumerate((-0.006, 0, 0.006)):
            v = saw(f * (1 + d), n, rng.random()); x[:, k % 2] += v; x[:, (k + 1) % 2] += 0.5 * v
    return lp(x, fc) * np.minimum(1, T(n) / 0.05)[:, None] / (len(fs) * 3)
def riser(dur):
    n = s(dur); p = T(n) / dur; return lp(hp(rng.standard_normal(n), 300), 6000) * p ** 2
def crash(dur=1.6): n = s(dur); return hp(rng.standard_normal(n), 4000) * np.exp(-T(n) * 2.8) * 0.6
CH = [(43.65, [349.23, 415.30, 523.25]), (69.30, [277.18, 349.23, 415.30]), (51.91, [415.30, 523.25, 622.25]), (77.78, [311.13, 392.00, 466.16])]
ARP = [0, 1, 2, 1, 2, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 1]
drums = np.zeros((N, 2)); syn = np.zeros((N, 2)); fx = np.zeros((N, 2))
K, Kb = kick(), kick(True)
hook = 3 * BEAT  # hook section: big hit + dark pad + riser
add(drums, Kb, 0); add(fx, crash(1.4), 0, 0.5); add(syn, pad([174.61, 207.65, 261.63], hook, 900), 0, 0.9); add(fx, riser(hook * 0.66), s(hook * 0.33), 0.35)
stop0, stop1 = (A.stop if A.stop else (A.dur + 1, A.dur + 1))
t = hook; bi = 0; pump = np.ones(N)
def duck(t0, depth=0.55, rel=0.18):
    i = s(t0); n = s(rel); seg = 1 - depth * np.exp(-T(n) / (rel / 4)); j = min(N, i + n)
    if i < N: pump[i:j] = np.minimum(pump[i:j], seg[: j - i])
def bar(t0, ch):
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= A.dur: return
        add(drums, K, s(tb), 0.95); duck(tb)
        if b in (1, 3): add(drums, clap(), s(tb), 0.5)
        add(drums, hat(True), s(tb + BEAT / 2), 0.16)
        for q in range(4): add(drums, hat(), s(tb + q * S16), 0.10 if q % 2 == 0 else 0.06)
        for q in (1, 2, 3): add(syn, bassnote(ch[0] * (2 if q == 3 else 1), S16 * 0.95), s(tb + q * S16), 0.55)
    for i in range(16): add(syn, pluck(ch[1][ARP[i]] * (2 if i in (6, 14) else 1)), s(t0 + i * S16), 0.18)
while t < A.dur - 1e-6:
    if stop0 - 4 * BEAT <= t < stop0:  # build into the stop: riser + snare roll, no groove
        add(fx, riser(stop0 - t), s(t), 0.45)
        tt = t
        while tt < stop0: add(drums, bp(rng.standard_normal(s(0.2)), 1200, 6000) * np.exp(-T(s(0.2)) * 22), s(tt), 0.3); tt += S16 * 2
        t = stop0; continue
    if stop0 <= t < stop1: t = stop1; add(drums, Kb, s(t)); add(fx, crash(2.0), s(t), 0.6); continue
    if t + 4 * BEAT > stop0 - 4 * BEAT and t < stop0 - 4 * BEAT: t2 = stop0 - 4 * BEAT; bar(t, CH[bi % 4]); t = t2; bi += 1; continue
    bar(t, CH[bi % 4]); t += 4 * BEAT; bi += 1
mus = syn * pump[:, None] + drums + fx
if A.stop:
    g = np.ones(N); r = s(0.005); i0 = s(stop0); g[i0:s(stop1)] = 0; g[i0 - r:i0] = np.linspace(1, 0, r); mus *= g[:, None]
fo = s(0.4); mus[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
meter = pyln.Meter(SR)
def limit(x, ceil_db=-1.8):
    gr = np.minimum(1, 10 ** (ceil_db / 20) / (np.max(np.abs(x), 1) + 1e-9)); w = s(0.003) * 2 + 1
    gr = minimum_filter1d(gr, w); a = np.exp(-1 / (0.06 * SR)); g = np.minimum(gr, signal.lfilter([1 - a], [1, -a], gr))
    return x * np.convolve(g, np.ones(w) / w, mode='same')[:, None]
for _ in range(4): mus = limit(mus * 10 ** ((A.lufs - meter.integrated_loudness(mus)) / 20))
os.makedirs(os.path.dirname(A.out) or '.', exist_ok=True)
with wave.open(A.out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mus, -1, 1) * 32767).astype(np.int16).tobytes())
print(A.out, 'LUFS', round(meter.integrated_loudness(mus), 2), 'peak dBFS', round(20 * np.log10(np.max(np.abs(mus))), 2))
