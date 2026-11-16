#!/usr/bin/env python3
"""Download real OHLCV candles from Binance's public spot klines API into the JSON the
compiler reads ([{t,o,h,l,c,v}], t in ms UTC). Never draw a chart by eye: every pivot in a
scene is checked against these bars at compile time.

usage: fetch_klines.py BTCUSDT 1h 2023-09-08 2023-10-06 -o data/btc_1h_spot.json"""
import argparse, json, time, urllib.request, datetime as dt
ap = argparse.ArgumentParser()
ap.add_argument("symbol"); ap.add_argument("interval"); ap.add_argument("start"); ap.add_argument("end")
ap.add_argument("-o", "--out", required=True)
a = ap.parse_args()
ms = lambda d: int(dt.datetime.fromisoformat(d).replace(tzinfo=dt.timezone.utc).timestamp() * 1000)
t, end, rows = ms(a.start), ms(a.end) + 86400000 - 1, []
while t < end:
    url = (f"https://api.binance.com/api/v3/klines?symbol={a.symbol}&interval={a.interval}"
           f"&startTime={t}&endTime={end}&limit=1000")
    batch = json.load(urllib.request.urlopen(url, timeout=60))
    if not batch: break
    rows += [{"t": k[0], "o": float(k[1]), "h": float(k[2]), "l": float(k[3]), "c": float(k[4]), "v": float(k[5])} for k in batch]
    t = batch[-1][0] + 1; time.sleep(0.2)
json.dump(rows, open(a.out, "w"))
print(f"{len(rows)} bars -> {a.out}  (source: Binance public spot klines, {a.symbol} {a.interval})")
