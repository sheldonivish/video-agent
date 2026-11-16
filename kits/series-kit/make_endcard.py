#!/usr/bin/env python3
"""Animated 9:16 brand end card (logo eases in, line, sub, gradient rule).
Usage: make_endcard.py [--line "..."] [--sub yourbrand.com] --out endcard.mp4 [--png still.png] [--dur 2.5]"""
import argparse,subprocess,math
from PIL import Image,ImageDraw
from brand import *
from PIL import ImageFilter
def ease(t): t=max(0,min(1,t)); return 1-(1-t)**3
def frame(t,line,sub,dur):
    img=Image.new("RGB",(W,H),BLACK)
    # glow
    a=ease(t/0.9)
    glow=Image.new("L",(W,H),0); ImageDraw.Draw(glow).ellipse((190,620,890,1120),fill=int(70*a))
    glow=glow.filter(ImageFilter.GaussianBlur(160))
    img=Image.composite(gradient(W,H),img,glow)
    # logo
    p=ease(t/0.8); s=0.86+0.14*p
    lg=logo(True,int(620*s)); al=lg.split()[3].point(lambda v:int(v*p)); lg.putalpha(al)
    img.paste(lg,((W-lg.width)//2,860-lg.height//2),lg)
    d=ImageDraw.Draw(img,"RGBA")
    for i,(txt,f,col,y,t0) in enumerate([(line,font(64,700),WHITE,1060,0.45),(sub,font(40,500),GREY,1160,0.7)]):
        q=ease((t-t0)/0.5)
        if q>0: ctext(d,int(y+30*(1-q)),txt,f,col+(int(255*q),))
    # gradient accent rule
    q=ease((t-0.9)/0.6)
    if q>0:
        wid=int(240*q); g=gradient(240,6).crop((0,0,max(1,wid),6)); img.paste(g,((W-wid)//2,1250))
    return img
if __name__=="__main__":
    ap=argparse.ArgumentParser();ap.add_argument("--line",default=B.get("endcard_line",""));ap.add_argument("--sub",default=B.get("endcard_sub",""))
    ap.add_argument("--out",default="endcard.mp4");ap.add_argument("--png");ap.add_argument("--dur",type=float,default=2.5);ap.add_argument("--fps",type=int,default=30)
    a=ap.parse_args()
    p=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(a.fps),"-i","-","-c:v","libx264","-pix_fmt","yuv420p","-crf","16","-movflags","+faststart",a.out],stdin=subprocess.PIPE)
    n=int(a.dur*a.fps)
    for i in range(n): p.stdin.write(frame(i/a.fps,a.line,a.sub,a.dur).tobytes())
    p.stdin.close();p.wait()
    if a.png: frame(a.dur,a.line,a.sub,a.dur).save(a.png)
