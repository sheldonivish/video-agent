#!/usr/bin/env python3
"""Transparent RGBA overlays in your brand colours (real numbers only on money/score overlays). Usage:
 make_overlay.py timer --text '47 min left' --out timer.png
 make_overlay.py money --text '+$18' [--dir up|down] --out m.png
 make_overlay.py score --a THEM --b ME --sa 3 --sb 2 --out score.png
 make_overlay.py caption --text 'short caption.' --out cap.png"""
import argparse
from PIL import Image,ImageDraw
from brand import *
S=2
def pill(w,h,r,fill,outline=None):
    im=Image.new("RGBA",(w*S,h*S),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,w*S-1,h*S-1),r*S,fill=fill,outline=outline,width=3*S if outline else 0); return im,d
def tw(f,t): b=f.getbbox(t); return b[2]-b[0]
def timer(text):
    f=font(46*S,700); w=tw(f,text)//S+140; im,d=pill(w,96,48,GRAPHITE+(240,),(255,255,255,30))
    d.ellipse((40*S,36*S,64*S,60*S),fill=GREEN); d.text((88*S,48*S),text,font=f,fill=WHITE,anchor="lm"); return im
def money(text,dirn):
    col=GREEN if dirn=="up" else CYAN; f=font(80*S,800); w=tw(f,text)//S+100
    im,d=pill(w,140,70,GRAPHITE+(240,),col+(160,)); d.text((w*S//2,72*S),text,font=f,fill=col,anchor="mm"); return im
def score(a,b,sa,sb):
    w,h=760,300; im,d=pill(w,h,40,GRAPHITE+(245,),(255,255,255,30))
    g=gradient(w*S-160*S,4*S); im.paste(g,(80*S,30*S))
    lf=font(40*S,700); sf=font(120*S,800)
    d.text((190*S,95*S),a.upper(),font=lf,fill=GREY,anchor="mm"); d.text((570*S,95*S),b.upper(),font=lf,fill=GREY,anchor="mm")
    d.text((w*S//2,95*S),"vs",font=font(34*S,500),fill=GREY,anchor="mm")
    d.text((190*S,195*S),str(sa),font=sf,fill=GREEN,anchor="mm"); d.text((570*S,195*S),str(sb),font=sf,fill=CYAN,anchor="mm")
    d.text((w*S//2,195*S),"–",font=sf,fill=WHITE,anchor="mm"); return im
def caption(text):
    f=font(52*S,700); w=max(tw(f,text)//S+120,600); im,d=pill(w,130,24,BLACK+(225,))
    im.paste(gradient(8*S,74*S),(36*S,28*S)); d.text((70*S,65*S),text,font=f,fill=WHITE,anchor="lm"); return im
if __name__=="__main__":
    ap=argparse.ArgumentParser();ap.add_argument("kind",choices=["timer","money","score","caption"])
    ap.add_argument("--text",default="");ap.add_argument("--dir");ap.add_argument("--a",default="A");ap.add_argument("--b",default="B")
    ap.add_argument("--sa",default="0");ap.add_argument("--sb",default="0");ap.add_argument("--out",required=True);x=ap.parse_args()
    if x.kind=="timer": im=timer(x.text or "47 min left")
    elif x.kind=="money": t=x.text or "+$18"; im=money(t,x.dir or ("down" if t[0] in "-−" else "up"))
    elif x.kind=="score": im=score(x.a,x.b,x.sa,x.sb)
    else: im=caption(x.text or "short caption.")
    im.resize((im.width//S,im.height//S),Image.LANCZOS).save(x.out)
