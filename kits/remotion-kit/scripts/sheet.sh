#!/bin/bash
# usage: sheet.sh in.mp4 out.png cols scale  (frames every 0.5s by default; pass "times")
in=$1; out=$2; cols=${3:-8}; w=${4:-270}; shift 4
times=${@:-"0.4 0.9 1.4 1.8 2.3 2.9 3.4 3.8 4.4 5.2 5.8 6.3 6.8 7.3 7.9 8.4 9.0 9.3 9.7 10.3 10.8 11.3 11.7 12.0 12.4 12.8 13.3 13.7 14.2 14.8 15.3 15.8 16.3 16.8 17.2 17.7 18.0 18.4 19.0 19.9"}
tmp=$(mktemp -d); i=0
for t in $times; do ffmpeg -loglevel error -ss $t -i $in -frames:v 1 -vf "scale=$w:-1,drawtext=text='$t':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6" $tmp/$(printf %03d $i).png; i=$((i+1)); done
rows=$(( (i+cols-1)/cols ))
ffmpeg -loglevel error -y -pattern_type glob -i "$tmp/*.png" -vf "tile=${cols}x${rows}:padding=4:color=0x222222" -frames:v 1 $out
rm -r $tmp
