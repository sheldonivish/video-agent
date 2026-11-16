"""Lint a chart-first lesson scene against the house rules. Fails loudly, never warns.

  R1  brand: the end card must carry YOUR brand (env BRAND_TEXT, e.g. "yourbrand"), and no
      user-visible text may carry a retired brand name (env OLD_BRANDS, comma-separated)
  R2  the opening is the CHART, not a title card: frame 1 must carry a live drawn chart
      with a mark already landing on it, and no title may be up on frame 1. The title
      lands late as the payoff.
  R3  the voice must be your configured voice (env ELEVENLABS_VOICE_ID) at normal speed;
      a silent scene is legal only when it says so, via meta.silent = true
  R4  every pivot/level annotation must be bound to a real bar in the data (compile step)
  R5  supersampling must be on (SS>=2) so the chart is genuinely HD at delivery
"""
import json, sys, os, re

_old = [b.strip() for b in os.environ.get("OLD_BRANDS", "").split(",") if b.strip()]
OLD_BRAND = re.compile("|".join(re.escape(b) for b in _old), re.I) if _old else None
BRAND_TEXT = os.environ.get("BRAND_TEXT", "").strip().lower()
CLONE = os.environ.get("ELEVENLABS_VOICE_ID", "")
ANNOT_KEYS = ("levels", "pivots", "axisTags", "tags", "highlights",
              "measures", "badges", "polylines", "staircase", "boxes")


def fail(msgs, code, msg):
    msgs.append((code, msg))


def _alpha_at_zero(at, fade_in):
    """Opacity of a line that starts at `at` and fades in over `fade_in`, at t=0."""
    if at <= 0.0:
        return 1.0
    if fade_in <= 0.0:
        return 0.0
    return max(0.0, min(1.0, (0.0 - (at - fade_in)) / fade_in))


def lint(scene_path):
    s = json.load(open(scene_path))
    meta = s.get("meta") or {}
    msgs = []

    # R1 brand
    user_visible = [("meta.eyebrow", meta.get("eyebrow", "")),
                    ("endcard.text", (s.get("endcard") or {}).get("text", ""))]
    for where, val in user_visible:
        if OLD_BRAND and isinstance(val, str) and OLD_BRAND.search(val):
            fail(msgs, "R1", f"{where} still says the old brand: {val!r}")
    if BRAND_TEXT and BRAND_TEXT not in (s.get("endcard") or {}).get("text", "").lower():
        fail(msgs, "R1", f"endcard.text is {(s.get('endcard') or {}).get('text')!r}, expected {BRAND_TEXT}")

    # R2 chart first, no title-card opener
    t = s.get("title") or {}
    title_txt = (t.get("text") or "").strip()
    if not title_txt:
        fail(msgs, "R2", "no title at all: the payoff hook has nowhere to land")

    at = float(t.get("at", 0.0))
    fi = float(t.get("fadeIn", 0.0))
    a0 = _alpha_at_zero(at, fi)
    if a0 > 0.02:
        fail(msgs, "R2",
             f"title {title_txt!r} is {a0:.0%} up on frame 1 (at={at}s). The format "
             "is chart first with no opener, so the title must land later")

    d = s.get("draw") or {}
    t0 = float(d.get("t0", 0.0))
    if t0 >= 0.0:
        fail(msgs, "R2",
             f"draw.t0={t0}s: candles only start at t=0, so frame 1 is a bare "
             "chart. Start the draw before 0 so the chart is already live")

    # Only an explicit `at` can put ink on frame 1. An `anchor` resolves against
    # the spoken-word alignment and speech starts after t=0, so an anchor-only
    # mark is always late. Treating a missing `at` as 0.0 let every anchored
    # scene pass this check without a mark on screen at all.
    marks = []
    for key in ANNOT_KEYS:
        for m in (s.get(key) or []):
            if isinstance(m, dict):
                marks.append((key, float(m["at"]) if "at" in m else None))
    if not marks:
        fail(msgs, "R2", "no annotation anywhere; the chart never gets marked")
    else:
        pinned = [m for m in marks if m[1] is not None]
        soonest = min((m[1] for m in pinned), default=None)
        if soonest is None or soonest > 0.05:
            why = ("every annotation is anchor-only and speech starts after 0"
                   if soonest is None else f"earliest pinned annotation is {soonest}s")
            fail(msgs, "R2",
                 f"nothing lands on the chart at t=0 ({why}); frame 1 must already "
                 "have a mark on it, so pin one with an explicit `at` <= 0.05")

    # R3 voice -- or an explicitly silent scene
    a = s.get("audio") or {}
    silent = bool(meta.get("silent"))
    if not a:
        if not silent:
            fail(msgs, "R3", "no audio block and meta.silent is not true: is this "
                             "meant to be silent, or did the voice get dropped?")
    else:
        if CLONE and (a.get("voice_id") or CLONE) != CLONE:
            fail(msgs, "R3", f"voice_id is {a.get('voice_id')!r}, expected your configured voice")
        sp = (a.get("settings") or {}).get("voice_settings", {}).get("speed", 1.0)
        if abs(float(sp) - 1.0) > 0.01:
            fail(msgs, "R3", f"speed {sp} -- the format uses normal pace, so it must be 1.0")
        lines = a.get("lines") or []
        if lines:
            l0 = (lines[0].get("text") or "").strip()
            words = len(l0.split())
            # the spoken line must not open on a bare label; on the new format the
            # voice starts under a live chart, so it is a statement, not a chapter
            # heading. Catch the label case by length, not by punctuation.
            if words <= 3 and not l0.endswith(("?", ".")) or l0.lower().rstrip(".") in (
                    "market structure", "higher highs", "higher highs higher lows"):
                fail(msgs, "R3", f"first spoken line {l0[:60]!r} is a bare label opener")

    # R5 supersampling
    ss = int(os.environ.get("SS", "2"))
    if ss < 2:
        fail(msgs, "R5", f"SS={ss}; the chart must be rendered supersampled (>=2)")

    return msgs


if __name__ == "__main__":
    p = sys.argv[1]
    msgs = lint(p)
    for code, m in msgs:
        print(f"{code}  {m}")
    print(("FAIL " if msgs else "PASS ") + p)
    sys.exit(1 if msgs else 0)
