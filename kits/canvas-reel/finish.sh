#!/usr/bin/env bash
# finish.sh <projdir> <DUR> [music.wav]
# Mixes <proj>/build/vo.mp3 with an optional licensed music bed (-19 dB), masters to -14 LUFS
# with a true-peak ceiling, encodes frames to <proj>/final.mp4, then prints the QA numbers.
set -euo pipefail
P=$(cd "$1" && pwd); D=$2; MUSIC=${3:-}; B=$P/build; KIT=$(cd "$(dirname "$0")" && pwd)
cd "$B"
if [[ -n "$MUSIC" ]]; then
  ffmpeg -y -v error -i vo.mp3 -i "$MUSIC" -filter_complex "[0]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=$D[v];[1]atrim=0:$D,afade=t=out:st=$(python3 -c "print($D-1.6)"):d=1.6,volume=-19dB[d];[v][d]amix=inputs=2:normalize=0:duration=first" -c:a pcm_s16le mix_raw.wav
else
  ffmpeg -y -v error -i vo.mp3 -af "aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=$D" -t "$D" -c:a pcm_s16le mix_raw.wav
fi
meas() { ffmpeg -hide_banner -i "$1" -af ebur128 -f null - 2>&1 | grep -A3 Summary | grep "I:" | awk '{print $2}'; }
G=$(python3 -c "print(round(-14.0-($(meas mix_raw.wav)),2))")
for it in 1 2 3 4; do
  ffmpeg -y -v error -i mix_raw.wav -af "volume=${G}dB,alimiter=limit=0.79:attack=3:release=60:level=disabled" -c:a pcm_s16le mix.wav
  G=$(python3 -c "print(round($G-14.0-($(meas mix.wav)),2))")
done
ffmpeg -y -v error -framerate 30 -i frames/f%05d.jpg -i mix.wav -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k -ar 48000 -shortest ../final.mp4
python3 "$KIT/../../pipeline/motion_audit.py" ../final.mp4 | grep -E "duration|MOVING" || true
ffmpeg -hide_banner -i ../final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:"
mkdir -p ../review
N=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of default=nw=1:nk=1 ../final.mp4); S=$((N/20))
ffmpeg -v error -y -i ../final.mp4 -vf "select='not(mod(n\,$S))',scale=270:-1,tile=10x2" -frames:v 1 ../review/contact_sheet.png
rm -rf frames
