# Synthesizes original SFX (whoosh, click, pop, ticks, boom) with numpy: no third-party samples, royalty-free by construction.
# usage: python3 scripts/sfx.py [out_dir=public/sfx]
import numpy as np, wave
import os, sys
SR=48000
OUT=sys.argv[1] if len(sys.argv)>1 else 'public/sfx'
os.makedirs(OUT, exist_ok=True)
rng=np.random.default_rng(7)
def save(name,x):
    x=x/ (np.max(np.abs(x))+1e-9)*0.9
    x=np.stack([x,x],1) if x.ndim==1 else x
    d=(x*32767).astype(np.int16)
    with wave.open(f'{OUT}/{name}.wav','wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
def onepole_lp(x,fc):
    # time-varying one-pole lowpass, fc array or scalar
    fc=np.broadcast_to(fc,x.shape); y=np.zeros_like(x); s=0.0
    a=np.exp(-2*np.pi*fc/SR)
    for i in range(len(x)):
        s=(1-a[i])*x[i]+a[i]*s; y[i]=s
    return y
# whoosh: band-swept noise with swell
n=int(0.7*SR); t=np.arange(n)/SR
noise=rng.standard_normal(n)
fc=300+4200*np.sin(np.pi*np.clip(t/0.7,0,1))**2
lp=onepole_lp(noise,fc); hp=lp-onepole_lp(lp,180)
env=np.sin(np.pi*np.clip(t/0.7,0,1))**1.6
L=hp*env; R=np.roll(hp,int(0.004*SR))*env
save('whoosh',np.stack([L*(1-0.3*t/0.7),R*(0.7+0.3*t/0.7)],1))
# click: short filtered transient + tiny tonal body
n=int(0.09*SR); t=np.arange(n)/SR
c=rng.standard_normal(n)*np.exp(-t*900)+0.6*np.sin(2*np.pi*2300*t)*np.exp(-t*160)
save('click',c-onepole_lp(c,600))
# pop: soft sine blip with pitch drop
n=int(0.14*SR); t=np.arange(n)/SR
f=900*np.exp(-t*18)+420
p=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*30)
save('pop',p)
# tick roll: 14 soft ticks over ~1s, decaying
n=int(1.0*SR); x=np.zeros(n)
for i in range(14):
    st=int((i*0.068)*SR); m=int(0.02*SR); tt=np.arange(m)/SR
    x[st:st+m]+=np.sin(2*np.pi*3200*tt)*np.exp(-tt*420)*(1-i/20)
save('ticks',x)
# soft boom/impact for logo
n=int(1.6*SR); t=np.arange(n)/SR
f=110*np.exp(-t*3)+48
b=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.6)
air=onepole_lp(rng.standard_normal(n),1500)*np.exp(-t*5)*0.25
save('boom',b+air)
print('ok')
