#!/usr/bin/env bash
# Chart-first lesson reel render harness.
#   ./render.sh scenes/pilot1.json
#   ./render.sh scenes/pilot1.json --check     # validate scene + timing, render nothing
#   SS=2 ./render.sh scenes/pilot1.json        # supersample factor (default 2)
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCENE="${1:?usage: ./render.sh <scene.json> [--check]}"
MODE="${2:-}"
SS="${SS:-2}"
OUTW=1080; OUTH=1920
ID="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$SCENE")"
# A scene may pin the engine revision it was designed against; ENGINE_FILE in the
# environment overrides it for an experiment.
SCENE_ENGINE="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('engine','engine.js'))" "$SCENE")"
ENGINE_FILE="${ENGINE_FILE:-$SCENE_ENGINE}"
BUILD="$HERE/build/$ID"; OUT="$HERE/out"

echo "== $ID ==  (supersample ${SS}x, engine ${ENGINE_FILE})"
mkdir -p "$BUILD" "$OUT"

# A scene with no `audio` block is a silent, music-ready render (the fast cut).
# It still needs a timeline, so write an empty alignment file rather than calling
# ElevenLabs: the brief forbids the clone for this one.
if [[ -n "$(python3 -c "import json,sys;d=json.load(open(sys.argv[1]));print('yes' if d.get('audio') else '')" "$SCENE")" ]]; then
  echo "-- 1/5 audio (ElevenLabs + alignment)"
  python3 "$HERE/renderer/audio_build.py" "$SCENE" "$BUILD"
else
  echo "-- 1/5 audio: silent (no audio block; no TTS call)"
  mkdir -p "$BUILD"
  printf '{"lines": [], "total": %s, "speech_total": 0}\n' \
    "$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['meta']['duration'])" "$SCENE")" \
    > "$BUILD/audio.json"
  ffmpeg -y -v error -f lavfi -i anullsrc=r=44100:cl=mono -t \
    "$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['meta']['duration'])" "$SCENE")" \
    -c:a pcm_s16le "$BUILD/vo.wav"
fi

echo "-- 2/5 compile (anchors -> resolved scene)"
python3 "$HERE/renderer/compile_scene.py" "$SCENE" "$BUILD"

if [[ "$MODE" == "--check" ]]; then
  echo "-- check only, stopping here"; exit 0
fi

echo "-- 3/5 frames"
# Do NOT wipe the frame directory here: the renderer resumes by skipping frames
# already on disk, which is what makes a lost page (a screenshot timeout under
# memory pressure) a 30-second repair instead of a 4-minute re-render. A genuine
# scene change gets a clean directory by bumping the scene id, or FRESH=1.
if [[ "${FRESH:-0}" == "1" ]]; then
  echo "    FRESH=1: discarding $(ls "$BUILD/frames" 2>/dev/null | wc -l) existing frames"
  rm -rf "$BUILD/frames"
fi
mkdir -p "$BUILD/frames"
ENGINE_FILE="$ENGINE_FILE" SS="$SS" python3 "$HERE/renderer/render_frames.py" "$BUILD" "$BUILD/frames" --workers "${WORKERS:-6}"

echo "-- 4/5 encode"
DUR="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['meta']['duration'])" "$BUILD/scene.resolved.json")"
FPS="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['meta']['fps'])" "$BUILD/scene.resolved.json")"

# Guard: the downscale only means something if the input is genuinely larger than
# the delivery frame. Read the real first-frame size and refuse to continue if the
# frames came out at 1080x1920, which would be a no-op scale that proves nothing.
READ_W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$BUILD/frames/f00000.png")
READ_H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$BUILD/frames/f00000.png")
echo "    source frames ${READ_W}x${READ_H} -> scale ${OUTW}x${OUTH}:flags=lanczos"
if [[ "$READ_W" -le "$OUTW" || "$READ_H" -le "$OUTH" ]]; then
  echo "FATAL: frames are ${READ_W}x${READ_H}; the lanczos downscale would be a no-op." >&2
  exit 1
fi
VF="scale=${OUTW}:${OUTH}:flags=lanczos,setsar=1"

ffmpeg -y -v error -framerate "$FPS" -i "$BUILD/frames/f%05d.png" -i "$BUILD/vo.wav" \
  -vf "$VF" \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 192k -ar 44100 -t "$DUR" -movflags +faststart -shortest \
  "$OUT/$ID.mp4"

# Assert the encoded file is the delivery size, not the supersampled size.
ENC_W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$OUT/$ID.mp4")
ENC_H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$OUT/$ID.mp4")
echo "    encoded ${ENC_W}x${ENC_H} (filter chain: ${VF})"
if [[ "$ENC_W" != "$OUTW" || "$ENC_H" != "$OUTH" ]]; then
  echo "FATAL: encoded ${ENC_W}x${ENC_H}, expected ${OUTW}x${OUTH}" >&2
  exit 1
fi

echo "-- 5/5 still @ 30s (lanczos downscale, same filter as the encode)"
python3 - "$BUILD" "$OUT" "$ID" "$OUTW" "$OUTH" <<'PY'
import json,sys,subprocess,pathlib
build,out,_id,ow,oh=pathlib.Path(sys.argv[1]),pathlib.Path(sys.argv[2]),sys.argv[3],sys.argv[4],sys.argv[5]
sc=json.load(open(build/"scene.resolved.json"))
# a still from the middle of THIS video, not a hardcoded 30s: a 16s reel has no
# frame 900, which used to fail the whole render after a successful encode
f=max(0, int(round(sc["meta"]["duration"]*0.5*sc["meta"]["fps"])))
f=min(f, int(round(sc["meta"]["duration"]*sc["meta"]["fps"])) - 1)
src=build/"frames"/f"f{f:05d}.png"
dst=out/f"{_id}_still.png"
subprocess.run(["ffmpeg","-y","-v","error","-i",str(src),"-vf",
                f"scale={ow}:{oh}:flags=lanczos","-frames:v","1",str(dst)],check=True)
print("   ", src.name, "->", dst)
PY

# Frames are ~455MB of 2160x3840 PNGs per reel and are never needed again once the
# mp4 exists. Keeping them is what turns a 200-reel run into a full disk, so they go
# after a successful encode unless KEEP_FRAMES=1 (useful when iterating on the encode).
if [[ "${KEEP_FRAMES:-0}" != "1" ]]; then
  freed=$(du -sm "$BUILD/frames" 2>/dev/null | cut -f1)
  rm -rf "$BUILD/frames"
  echo "-- cleaned ${freed:-0} MB of source frames (KEEP_FRAMES=1 to retain)"
fi

echo "done: $OUT/$ID.mp4"
