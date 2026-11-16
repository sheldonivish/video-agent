import sys,glob
from PIL import Image,ImageDraw
fs=sorted(glob.glob(sys.argv[1]+'/build/preview/t*.jpg'));W,H=216,384;cols=8;rows=(len(fs)+cols-1)//cols
sh=Image.new('RGB',(W*cols,(H+20)*rows),'#333')
for i,f in enumerate(fs):
    x=(i%cols)*W;y=(i//cols)*(H+20);sh.paste(Image.open(f).resize((W,H)),(x,y+20));ImageDraw.Draw(sh).text((x+4,y+4),f.split('/')[-1],fill='white')
sh.save(sys.argv[1]+'/build/sheet.png')
