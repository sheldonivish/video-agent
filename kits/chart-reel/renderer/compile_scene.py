"""Compile a content-only scene JSON into a fully resolved render scene.

Timing model: any event may be given `at` (seconds) OR `anchor`
{"line": n, "phrase": "..."} resolved against the ElevenLabs character
alignment, so marks land on the exact spoken word. Captions use
`phrase` {from,to} so the English line spans exactly its spoken phrase (the voice can be in another language).
"""
import json, sys, pathlib, numpy as np, datetime as dt

ROOT = pathlib.Path(__file__).resolve().parent.parent
iso = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))

def load_bars(d):
    # .npy is the legacy store; .json is the verified chart the brief names
    # (charts/btc_1h_spot.json), so accept both rather than re-deriving a copy.
    if str(d["path"]).endswith(".json"):
        raw = json.load(open(d["path"]))
        if isinstance(raw, dict):
            raw = raw.get("bars") or raw.get("data") or raw["candles"]
        keys = ("t", "o", "h", "l", "c")
        a = np.array([[r[k] if isinstance(r, dict) else r[i] for i, k in enumerate(keys)]
                      for r in raw], dtype="float64")
    else:
        a = np.load(d["path"])
    b = a[(a[:, 0] >= iso(d["from"]).timestamp() * 1000) &
          (a[:, 0] <= iso(d["to"]).timestamp() * 1000)]
    h = d.get("resample_hours", 0)
    if h and h > 1:
        key = (b[:, 0] // (h * 3600 * 1000)).astype("int64")
        rows = [[k * h * 3600 * 1000, s[0, 1], s[:, 2].max(), s[:, 3].min(), s[-1, 4]]
                for k in sorted(set(key)) for s in [b[key == k]]]
        b = np.array(rows)
    return b

# ---- alignment helpers -------------------------------------------------
def char_at(line, ci):
    return line["at"] + line["c0"][max(0, min(ci, len(line["c0"]) - 1))]

def phrase_span(line, phrase):
    """(start,end) seconds of `phrase` inside a spoken line, from char alignment."""
    try:
        ci = line["text"].index(phrase)
    except ValueError:
        raise SystemExit(f"anchor '{phrase}' not found in line {line['i']}: {line['text'][:60]}")
    ce = ci + len(phrase) - 1
    return char_at(line, ci), char_at(line, ce) + 0.001, ci, ce

def resolve_at(spec, audio, key="at"):
    if key in spec: return float(spec[key])
    a = spec["anchor"]
    s, _, _, _ = phrase_span(audio["lines"][a["line"]], a["phrase"])
    return round(s, 3)

# ---- captions ----------------------------------------------------------
def build_cues(scene, audio):
    """Words light up across the spoken span of their spoken phrase, then the
    finished line HOLDS until the next cue, so there is never a silent gap."""
    DUR = scene["meta"]["duration"]
    cues = []
    for spec in scene["captions"]:
        line = audio["lines"][spec["line"]]
        s0, _, _, _ = phrase_span(line, spec["phrase"]["from"])
        _, s1, _, _ = phrase_span(line, spec["phrase"]["to"])
        if s1 <= s0:
            s1 = s0 + 0.6
        s1 += float(spec.get("extend", 0.0))
        cues.append({"text": spec["text"], "speech": [round(s0, 3), round(s1, 3)],
                     "hold": float(spec.get("hold", 2.4)), "size": spec.get("size", 62)})

    cues.sort(key=lambda c: c["speech"][0])
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["speech"][0] if i + 1 < len(cues) else None
        c["t0"] = c["speech"][0]
        c["t1"] = min(nxt - 0.08, DUR - 0.6) if nxt is not None else min(c["speech"][1] + c["hold"], DUR - 0.6)
        if c["t1"] <= c["t0"]:
            c["t1"] = c["t0"] + 0.5

        words = [w for w in c["text"].split(" ") if w]
        wts = [max(1.0, len(w) + 1.9) for w in words]
        tot, t = sum(wts), c["speech"][0]
        span = max(c["speech"][1] - c["speech"][0], 0.3)
        out = []
        for w, wt in zip(words, wts):
            d = span * wt / tot
            out.append({"w": w, "t0": round(t, 3), "t1": round(t + d, 3)})
            t += d
        c["words"] = out
        c["t1"] = round(c["t1"], 3)
        del c["speech"]
    return cues

def main(scene_path, outdir):
    scene = json.load(open(scene_path))
    outdir = pathlib.Path(outdir)
    audio = json.load(open(outdir / "audio.json"))

    b = load_bars(scene["data"])
    bars = [[int(r[0]), float(r[1]), float(r[2]), float(r[3]), float(r[4])] for r in b]
    lo = min(r[3] for r in bars); hi = max(r[2] for r in bars)
    pad = (hi - lo) * 0.045
    step = scene["price"]["grid_step"]
    grid = [p for p in range(int(np.ceil((lo - pad) / step)) * step,
                             int(hi + pad) + 1, step)]

    piv = []
    for p in scene["pivots"]:
        i = int(np.argmin([abs(r[0] - iso(p["ts"]).timestamp() * 1000) for r in bars]))
        actual = bars[i][3] if p["kind"] == "low" else bars[i][2]
        tol = float(p.get("tol", 0.5))
        drawn = float(p.get("draw_price", p["price"]))
        err = abs(actual - p["price"])
        if err > tol:
            raise SystemExit(f"pivot {p['id']}: bar {i} {p['kind']} = {actual}, scene says {p['price']} (tol {tol})")
        if err > 0.5:
            raise SystemExit(f"pivot {p['id']}: bar {i} {p['kind']} = {actual}, scene says {p['price']}")
        piv.append({**p, "i": i, "at": resolve_at(p, audio), "err": round(err, 2),
                    "price_drawn": drawn})

    ticks = []
    for p in piv:
        if not any(abs(t["i"] - p["i"]) < 4 for t in ticks):
            ticks.append({"i": p["i"],
                          "text": dt.datetime.fromtimestamp(bars[p["i"]][0] / 1000, dt.UTC).strftime("%-d %b").upper(),
                          "ts": bars[p["i"]][0]})
    ticks.sort(key=lambda t: t["ts"])
    for t in ticks: t.pop("ts")

    # timings: an explicit `at` wins; `anchor` resolves against the spoken line.
    # A silent scene has no lines, so everything must carry a literal `at`.
    def resolve_obj(o):
        if o is None: return None
        o = dict(o); o["at"] = resolve_at(o, audio); return o

    st = resolve_obj(scene.get("staircase"))
    bo = resolve_obj(scene.get("bos"))
    en = resolve_obj(scene.get("endcard"))
    ex = resolve_obj(scene.get("extension"))
    for key in ("levels", "tags", "tagsScreen", "measures", "highlights", "axisTags", "polylines"):
        if scene.get(key): scene[key] = [resolve_obj(x) for x in scene[key]]

    resolved = {
        "meta": scene["meta"], "bars": bars,
        "price": {"min": lo, "max": hi, "lo": lo - pad, "hi": hi + pad, "grid": grid},
        "pivots": piv, "dateTicks": ticks, "draw": scene["draw"],
        "title": scene.get("title"), "staircase": st, "bos": bo,
        "endcard": en, "cues": build_cues(scene, audio) if scene.get("captions") else [],
        # v2 pass-throughs: camera, layout, and the annotation primitives
        "camera": scene.get("camera"), "layout": scene.get("layout"),
        "levels": scene.get("levels"), "tags": scene.get("tags"),
        "tagsScreen": scene.get("tagsScreen"), "measures": scene.get("measures"),
        "extension": ex, "highlights": scene.get("highlights"), "axisTags": scene.get("axisTags"),
        "polylines": scene.get("polylines"),
    }
    (outdir / "scene.resolved.json").write_text(json.dumps(resolved, ensure_ascii=False))

    print(f"  bars {len(bars)}  {dt.datetime.fromtimestamp(bars[0][0]/1000, dt.UTC):%d %b %H:%M}"
          f" -> {dt.datetime.fromtimestamp(bars[-1][0]/1000, dt.UTC):%d %b %H:%M} UTC")
    print(f"  price {lo:.0f}..{hi:.0f}   grid {grid[0]}..{grid[-1]} step {step}")
    print(f"  pivots {len(piv)} (max err {max(p['err'] for p in piv):.2f}), cues {len(resolved['cues'])}")
    for p in piv: print(f"    {p['id']:3s} {p['price']:>8.0f} bar {p['i']:>3d}  mark @ {p['at']:6.2f}s")
    def at(o): return f"{o['at']:.2f}s" if o else "-"
    print(f"    staircase @ {at(st)}   bos @ {at(bo)}   endcard @ {at(en)}"
          f"   levels {len(scene.get('levels') or [])}  tags {len(scene.get('tags') or [])}"
          f"  measures {len(scene.get('measures') or [])}")
    cam = scene.get("camera")
    if cam:
        print("    camera: " + "  ".join(f"{k['at']:.2f}s z{k['zoom']:.2f} ({k['cx']:.0f},{k['cy']:.0f})" for k in cam))
    for c in resolved["cues"]:
        print(f"    cue {c['t0']:6.2f}-{c['t1']:6.2f}  {c['text']}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
