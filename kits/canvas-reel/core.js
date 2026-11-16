// Canvas reel kit: shared core for glowing-figure "world camera" explainers.
// Brand values come from window.BRAND (set in your project's pre.js). Nothing brand-specific lives here.
const Q=new URLSearchParams(location.search);
const MODE=Q.get('cover')||'';
const W=1080, H=MODE==='1x1'?1080:(MODE==='4x5'?1350:1920);
const cv=document.getElementById('c');cv.width=W;cv.height=H;
const ctx=cv.getContext('2d');
const B=Object.assign({primary:'#6C63FF',light:'#8A84FF',accent:'#FF3B7F',up:'#19B37E',
  logo:'brand/logo_white.png',icon:'brand/icon.png',iconw:'brand/icon_white.png',
  tagline:'YOUR TAGLINE.',url:'yourbrand.com',bg:'#050506'},window.BRAND||{});
const P=B.primary,PL=B.light,PK=B.accent,GN=B.up;
const GROUND=1400;
const imgs={};
function load(n,src){return new Promise(r=>{const i=new Image();i.onload=()=>{imgs[n]=i;r()};i.onerror=()=>r();i.src=src})}
const EXTRA_IMGS=window.EXTRA_IMGS||{};
window.ready=Promise.all([load('logo',B.logo),load('icon',B.icon),load('iconw',B.iconw),...Object.entries(EXTRA_IMGS).map(([k,v])=>load(k,v)),document.fonts.load('800 50px IT')]);
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,u)=>a+(b-a)*u;
const eio=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const eo=u=>1-Math.pow(1-u,3);
const lin=u=>u;
const ei=u=>u*u*u;
const back=u=>{const c1=1.5,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)};
const pr=(t,a,b,f=eio)=>f(cl((t-a)/(b-a)));
const win=(t,a,b,fi=0.3,fo=0.3)=>pr(t,a,a+fi)*(1-pr(t,b,b+fo));
function rng(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
function mixc(a,b,u){const pa=[1,3,5].map(i=>parseInt(a.substr(i,2),16)),pb=[1,3,5].map(i=>parseInt(b.substr(i,2),16));return 'rgb('+pa.map((v,i)=>Math.round(lerp(v,pb[i],u))).join(',')+')'}
function mono(ts,ys){const n=ts.length,d=[],m=[];for(let i=0;i<n-1;i++)d.push((ys[i+1]-ys[i])/(ts[i+1]-ts[i]));m[0]=d[0];m[n-1]=d[n-2];
 for(let i=1;i<n-1;i++){if(d[i-1]*d[i]<=0)m[i]=0;else{const w1=2*(ts[i+1]-ts[i])+(ts[i]-ts[i-1]),w2=(ts[i+1]-ts[i])+2*(ts[i]-ts[i-1]);m[i]=(w1+w2)/(w1/d[i-1]+w2/d[i])}}
 return t=>{if(t<=ts[0])return ys[0]+m[0]*(t-ts[0]);if(t>=ts[n-1])return ys[n-1]+m[n-1]*(t-ts[n-1]);let i=0;while(t>ts[i+1])i++;const h=ts[i+1]-ts[i],s=(t-ts[i])/h,s2=s*s,s3=s2*s;
 return (2*s3-3*s2+1)*ys[i]+(s3-2*s2+s)*h*m[i]+(-2*s3+3*s2)*ys[i+1]+(s3-s2)*h*m[i+1]}}
let CAMF=null;
function setCam(K){const ts=K.map(k=>k[0]);const cx=mono(ts,K.map(k=>k[1])),cy=mono(ts,K.map(k=>k[2])),cz=mono(ts,K.map(k=>Math.log(k[3])));CAMF=t=>({x:cx(t),y:cy(t),z:Math.exp(cz(t))})}
let Z=1;
function glow(b,c='rgba(255,255,255,0.85)'){ctx.shadowBlur=b*Z;ctx.shadowColor=c}
function noglow(){ctx.shadowBlur=0;ctx.shadowColor='transparent'}
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function figure(x,gy,s,col,a,gl=1){ if(a<=0)return; ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=col;
 if(gl>0)glow(36*gl,'rgba(255,255,255,'+(0.75*gl)+')');
 const bw=150*s,bh=170*s; ctx.beginPath();ctx.roundRect(x-bw/2,gy-bh,bw,bh,[70*s,70*s,6*s,6*s]);ctx.fill();
 ctx.beginPath();ctx.arc(x,gy-bh-16*s-48*s,48*s,0,7);ctx.fill();ctx.restore()}
function seatedFigure(x,gy,s,col,a){ // figure seated: shorter body
 if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=col;glow(30);const bw=150*s,bh=130*s;ctx.beginPath();ctx.roundRect(x-bw/2,gy-bh,bw,bh,[70*s,70*s,6*s,6*s]);ctx.fill();ctx.beginPath();ctx.arc(x,gy-bh-14*s-46*s,46*s,0,7);ctx.fill();ctx.restore()}
function figPts(x,gy,s,n,seed){const r=rng(seed),o=[];while(o.length<n){const px=x+(r()-.5)*150*s,py=gy-r()*(170+16+96)*s;
 const bh=170*s;let ok=false; if(py>gy-bh)ok=true; else {const hy=gy-bh-16*s-48*s;ok=Math.hypot(px-x,py-hy)<48*s}
 if(ok)o.push([px,py,r(),r(),r()])}return o}
function arrow(x0,y0,x1,y1,col,w,a,p=1){if(a<=0||p<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';glow(26,col);
 const xe=lerp(x0,x1,p),ye=lerp(y0,y1,p);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();
 const an=Math.atan2(ye-y0,xe-x0),hl=w*3.4;ctx.beginPath();ctx.moveTo(xe+Math.cos(an)*w*1.2,ye+Math.sin(an)*w*1.2);
 ctx.lineTo(xe-Math.cos(an-0.6)*hl,ye-Math.sin(an-0.6)*hl);ctx.lineTo(xe-Math.cos(an+0.6)*hl,ye-Math.sin(an+0.6)*hl);ctx.closePath();ctx.fill();ctx.restore()}
function polyline(pts,p,col,w,a,gl=18){
 if(a<=0||p<=0)return;const x0=pts[0][0],x1=pts[pts.length-1][0],xm=lerp(x0,x1,p);
 ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';glow(gl);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
 let last=pts[0];for(let i=1;i<pts.length;i++){const q=pts[i];if(q[0]<=xm){ctx.lineTo(q[0],q[1]);last=q}else{const u=(xm-pts[i-1][0])/(q[0]-pts[i-1][0]);last=[xm,lerp(pts[i-1][1],q[1],u)];ctx.lineTo(last[0],last[1]);break}}
 ctx.stroke();ctx.restore();return last}
function dashed(x0,x1,y,col,w,a,dash=[22,14],gl=0){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.setLineDash(dash);if(gl)glow(gl,col);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore()}
function line(x0,y0,x1,y1,col,w,a,gl=0,dash=null){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';if(dash)ctx.setLineDash(dash);if(gl)glow(gl,col);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function text(s,x,y,px,col,a,align='center',ls=0.08,gl=0,wt=800){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.font=`${wt} ${px}px IT`;ctx.letterSpacing=(px*ls)+'px';ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=col;if(gl)glow(gl,col);ctx.fillText(s,x,y);ctx.restore()}
function box(x,y,w,h,r,stroke,fill,a,lw=3,gl=0){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;rr(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;if(gl)glow(gl,stroke);ctx.stroke()}ctx.restore()}
function disc(x,y,r,col,a,gl=0){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=col;if(gl)glow(gl,col);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore()}
function ring(x,y,r,col,w,a,gl=0,dash=null,a0=0,a1=6.2832){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=w;if(dash)ctx.setLineDash(dash);if(gl)glow(gl,col);ctx.beginPath();ctx.arc(x,y,r,a0,a1);ctx.stroke();ctx.restore()}
function burst(x,y,u,col){if(u<=0||u>=1)return;ctx.save();ctx.globalAlpha=1-u;ctx.strokeStyle=col;ctx.lineWidth=6*(1-u)+1;glow(30,col);ctx.beginPath();ctx.arc(x,y,10+u*110,0,7);ctx.stroke();
 for(let k=0;k<8;k++){const an=k*Math.PI/4+0.3,r0=20+u*60,r1=r0+30*(1-u);ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r0,y+Math.sin(an)*r0);ctx.lineTo(x+Math.cos(an)*r1,y+Math.sin(an)*r1);ctx.stroke()}ctx.restore()}
function spot(x,a){if(a<=0)return;ctx.save();const g=ctx.createLinearGradient(0,-300,0,GROUND+40);g.addColorStop(0,'rgba(255,255,255,'+(0.13*a)+')');g.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-60,-300);ctx.lineTo(x+60,-300);ctx.lineTo(x+300,GROUND+40);ctx.lineTo(x-300,GROUND+40);ctx.closePath();ctx.fill();
 const e=ctx.createRadialGradient(x,GROUND,10,x,GROUND,320);e.addColorStop(0,'rgba(255,255,255,'+(0.10*a)+')');e.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=e;ctx.beginPath();ctx.ellipse(x,GROUND,320,60,0,0,7);ctx.fill();ctx.restore()}
function coin(x,y,r,a,col='#fff'){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=Math.max(3,r*0.26);glow(20,col);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();ctx.lineWidth=Math.max(2,r*0.16);ctx.beginPath();ctx.arc(x,y,r*0.62,0,7);ctx.stroke();ctx.restore()}
function img(name,x,y,w,a,h=null){const im=imgs[name];if(!im||a<=0)return;h=h||w*im.height/im.width;ctx.save();ctx.globalAlpha*=a;ctx.drawImage(im,x-w/2,y-h/2,w,h);ctx.restore()}
function dial(x,y,r,v,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';ctx.lineWidth=12;ctx.strokeStyle='#393939';ctx.beginPath();ctx.arc(x,y,r,Math.PI,2*Math.PI);ctx.stroke();
 const an=Math.PI+v*Math.PI;ctx.strokeStyle='#fff';glow(16);ctx.beginPath();ctx.arc(x,y,r,Math.PI,an);ctx.stroke();
 ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an)*(r-22),y+Math.sin(an)*(r-22));ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.fill();ctx.restore()}
function chip(s,x,y,px,a,col='#fff',bord=PL){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.font=`800 ${px}px IT`;ctx.letterSpacing=(px*0.08)+'px';const w=ctx.measureText(s).width+px*1.3,h=px*1.75;
 rr(x-w/2,y-h/2,w,h,h/2);ctx.fillStyle='rgba(8,8,14,0.92)';ctx.fill();ctx.strokeStyle=bord;ctx.lineWidth=Math.max(2,px*0.09);glow(12,bord);ctx.stroke();noglow();ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y+px*0.04);ctx.restore()}
// particles + grid
const PR=rng(11),parts=[];
for(let i=0;i<300;i++)parts.push({x:PR()*1400,y:PR()*2300,r:1.6+PR()*2.6,a:0.25+PR()*0.4,p:0.2+PR()*0.7,vx:(PR()-.5)*30,vy:-50-PR()*110,pu:PR()<0.2,ph:PR()*6.28,soft:false});
for(let i=0;i<22;i++)parts.push({x:PR()*1400,y:PR()*2300,r:14+PR()*26,a:0.05+PR()*0.08,p:0.1+PR()*0.3,vx:(PR()-.5)*20,vy:-15-PR()*30,pu:PR()<0.4,ph:PR()*6.28,soft:true});
function particles(t,C){parts.forEach(q=>{let x=q.x-C.x*q.p*0.5+q.vx*t+18*Math.sin(t*0.9+q.ph),y=q.y-C.y*q.p*0.3+q.vy*t;x=((x%1300)+1300)%1300-110;y=((y%2200)+2200)%2200-140;
 ctx.globalAlpha=q.a;ctx.fillStyle=q.pu?PL:'#fff';const rr_=q.r*(0.8+0.2*C.z);if(q.soft){ctx.shadowBlur=rr_*0.8;ctx.shadowColor=q.pu?PL:'#fff'}else ctx.shadowBlur=0;ctx.beginPath();ctx.arc(x,y,rr_,0,7);ctx.fill()});ctx.globalAlpha=1;ctx.shadowBlur=0}
let GA=0.19,GS=6,GV=80;
function grid(t,C){const sp=60*Math.sqrt(C.z);const ox=((-(C.x*C.z*0.55+GV*t))%sp+sp)%sp,oy=((-(C.y*C.z*0.4))%sp+sp)%sp;ctx.fillStyle='rgba(255,255,255,'+GA+')';
 for(let x=ox-sp;x<W+sp;x+=sp)for(let y=oy-sp;y<H+sp;y+=sp)ctx.fillRect(x-GS/2,y-GS/2,GS,GS)}
function vignette(){const g=ctx.createRadialGradient(W/2,H*0.5,H*0.2,W/2,H*0.5,H*0.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.8)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
// pills: PILLS=[[t,'TEXT',y],...]
let PILLS=[];
function pill(s,y,a,sc){if(!s||a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.font='800 52px IT';ctx.letterSpacing='3px';const w=ctx.measureText(s).width+76,h=92;
 ctx.translate(540,y);ctx.scale(sc,sc);ctx.shadowBlur=40;ctx.shadowColor='rgba(255,255,255,0.45)';ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,h/2);ctx.fill();
 ctx.shadowBlur=0;ctx.fillStyle='#0a0a0a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,3);ctx.restore()}
function pills(t){let cur=-1;for(let i=0;i<PILLS.length;i++)if(t>=PILLS[i][0])cur=i;
 if(cur>=0){const [t0,s,y]=PILLS[cur];const u=cl((t-t0)/0.22);pill(s,y+(1-eo(u))*26,eo(u),0.88+0.12*back(u))}
 if(cur>=1){const [t0]=PILLS[cur];const [,s,y]=PILLS[cur-1];const u=cl((t-t0)/0.16);if(u<1)pill(s,y-u*30,1-u,1-0.06*u)}}
// end card at world x, starting t0
function endCard(t,x,t0){const ea=pr(t,t0,t0+0.75,eo);if(ea<=0)return;const lw=600,lh=imgs.logo?lw*imgs.logo.height/imgs.logo.width:0;ctx.save();ctx.globalAlpha=ea;glow(16,'rgba(255,255,255,0.35)');if(imgs.logo)ctx.drawImage(imgs.logo,x-lw/2,400-lh/2+(1-ea)*30,lw,lh);ctx.restore();
 text(B.tagline,x,545+(1-ea)*30,54,'#fff',pr(t,t0+0.25,t0+0.95,eo),'center',0.12);
 text(B.url,x,1490,52,'#9a9a9a',pr(t,t0+0.45,t0+1.15,eo),'center',0.04)}
// frame
let WORLD=()=>{};
window.setTime=function(t){ctx.setTransform(1,0,0,1,0,0);noglow();ctx.fillStyle=B.bg;ctx.fillRect(0,0,W,H);
 const C=CAMF(t);grid(t,C);particles(t,C);Z=C.z;ctx.setTransform(Z,0,0,Z,W/2-C.x*Z,H/2-C.y*Z);
 const V={x0:C.x-W/2/Z,x1:C.x+W/2/Z,y0:C.y-H/2/Z,y1:C.y+H/2/Z};
 dashed(V.x0-50,V.x1+50,GROUND,'rgba(255,255,255,0.38)',3,1,[20,16]);
 WORLD(t,V);ctx.setTransform(1,0,0,1,0,0);noglow();vignette();pills(t)}
// cover helper: draws world at time tc with camera (x,y,z), then headline + logo
window.drawCover=function(){const c=window.COVER;ctx.fillStyle='#050506';ctx.fillRect(0,0,W,H);
 const sq=W===H;const z=sq?c.z1:c.z4;Z=z;const cyShift=sq?c.dy1:c.dy4;
 ctx.fillStyle='rgba(255,255,255,0.11)';for(let gx=0;gx<W;gx+=60)for(let gy=0;gy<H;gy+=60)ctx.fillRect(gx-2,gy-2,4,4);
 ctx.setTransform(z,0,0,z,W/2-c.x*z,H/2-c.y*z+cyShift);
 dashed(c.x-1200,c.x+1200,GROUND,'rgba(255,255,255,0.38)',3,1,[20,16]);
 WORLD(c.t,{x0:c.x-1200,x1:c.x+1200,y0:-500,y1:2500},true);
 ctx.setTransform(1,0,0,1,0,0);noglow();
 const g=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.8);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.75)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const top=sq?120:150;
 c.lines.forEach((s,i)=>text(s,W/2,top+i*104,c.px||92,'#fff',1,'center',0.04,24));
 const lw=260,lh=imgs.logo?lw*imgs.logo.height/imgs.logo.width:0;if(imgs.logo)ctx.drawImage(imgs.logo,W/2-lw/2,H-(sq?70:90)-lh/2,lw,lh)}
