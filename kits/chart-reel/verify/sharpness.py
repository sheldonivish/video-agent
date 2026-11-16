"""Independent sharpness check: variance of Laplacian + high-frequency energy ratio.

Compares a 1x reference frame against the new supersampled->lanczos frame at the
same timestamp. Higher variance-of-Laplacian = more real edge contrast, which is
what "looks HD" actually means at delivery resolution.
"""
import sys, numpy as np
from PIL import Image

K = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=np.float64)

def lap_var(path, box=None):
    im = Image.open(path).convert("L")
    if box: im = im.crop(box)
    a = np.asarray(im, dtype=np.float64)
    # same-size 3x3 convolution via slicing (no scipy dependency)
    p = np.pad(a, 1, mode="edge")
    conv = (K[0,1]*p[:-2,1:-1] + K[1,0]*p[1:-1,:-2] + K[1,1]*p[1:-1,1:-1]
            + K[1,2]*p[1:-1,2:] + K[2,1]*p[2:,1:-1])
    return float(conv.var()), im.size

def hf_ratio(path, box=None):
    """share of energy above the 1/4-Nyquist band, via a cheap 2x2 block-difference"""
    im = Image.open(path).convert("L")
    if box: im = im.crop(box)
    a = np.asarray(im, dtype=np.float64)
    dx = np.abs(np.diff(a, axis=1)).mean()
    dy = np.abs(np.diff(a, axis=0)).mean()
    return float((dx + dy) / 2)

if __name__ == "__main__":
    ref, new = sys.argv[1], sys.argv[2]
    box = None
    if len(sys.argv) > 3:
        box = tuple(int(v) for v in sys.argv[3].split(","))
    for label, p in (("old 1x", ref), ("new 2x->lanczos", new)):
        v, size = lap_var(p, box)
        h = hf_ratio(p, box)
        print(f"{label:18s} {size[0]}x{size[1]}  varLaplacian {v:8.1f}   mean|grad| {h:6.3f}")
