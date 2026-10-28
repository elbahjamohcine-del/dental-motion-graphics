#!/usr/bin/env bash
# Synthesizes the sound effects in public/sfx/ with ffmpeg (no samples, no
# licensing). Re-run after tweaking a formula: bash scripts/make-sfx.sh
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"

sfx() { # name duration expression [extra audio filters]
  ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='$3':s=44100:d=$2" \
    -af "${4:-anull},alimiter=limit=0.89,aformat=channel_layouts=mono" \
    -c:a libmp3lame -q:a 3 "$1.mp3"
}

# Transition: filtered noise swelling then fading (airy "whoosh").
ffmpeg -loglevel error -y -f lavfi -i "anoisesrc=d=0.55:c=pink:a=0.9:s=44100" \
  -af "highpass=f=350,lowpass=f=5200,afade=t=in:st=0:d=0.3:curve=exp,afade=t=out:st=0.3:d=0.25:curve=exp,volume=1.6,alimiter=limit=0.8" \
  -c:a libmp3lame -q:a 3 whoosh.mp3

# Title / element appears: quick downward pitch "pop".
sfx pop 0.14 "0.9*sin(2*PI*(950*t-2600*t*t))*exp(-34*t)"

# Subtitle line appears: tiny soft tick.
sfx tick 0.06 "0.5*sin(2*PI*2300*t)*exp(-110*t)"

# Checklist item: short wooden "click".
sfx click 0.09 "0.8*sin(2*PI*1500*t)*exp(-70*t)+0.3*sin(2*PI*3100*t)*exp(-90*t)"

# Mistake stamp: two descending tones ("uh-oh"), softened square-ish timbre.
sfx error 0.42 "(lt(t,0.15)*(sin(2*PI*494*t)+0.3*sin(2*PI*988*t))*exp(-6*t)+gte(t,0.17)*(sin(2*PI*370*(t-0.17))+0.3*sin(2*PI*740*(t-0.17)))*exp(-7*(t-0.17)))*0.7"

# Good practice: bell "ding" (fundamental + inharmonic partials).
sfx ding 1.1 "0.6*sin(2*PI*1318*t)*exp(-4*t)+0.25*sin(2*PI*2637*t)*exp(-7*t)+0.18*sin(2*PI*3520*t)*exp(-9*t)"

# Big number / key moment: deep soft impact.
sfx impact 0.6 "0.9*sin(2*PI*(95*t-45*t*t))*exp(-7*t)+0.25*sin(2*PI*190*t)*exp(-14*t)"

# Call to action: rising three-note chime (C6 E6 G6).
sfx success 0.9 "0.5*sin(2*PI*1047*t)*exp(-6*t)+gte(t,0.09)*0.5*sin(2*PI*1319*(t-0.09))*exp(-6*(t-0.09))+gte(t,0.18)*0.55*sin(2*PI*1568*(t-0.18))*exp(-5*(t-0.18))"

for f in *.mp3; do
  printf "%-12s %s s\n" "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
