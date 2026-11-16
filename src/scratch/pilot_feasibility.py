"""Feasibility trial, NOT a result. Uses dump1 (fit) and dump2 (check) only; dump6 normal is not scored."""
import numpy as np, pandas as pd
D = "E:/University/12th_trimester/cs/car-security-can-pinn/data/signal/"
W = ["386_WHL_SPD_FL", "386_WHL_SPD_FR", "386_WHL_SPD_RL", "386_WHL_SPD_RR"]
def load(f): return pd.read_parquet(D + f, columns=W + ["316_VS", "4F1_CF_Clu_Vanz"])

# R1 variant: each wheel predicted from the mean of the other three (no constants needed).
def resid(df, w="386_WHL_SPD_FL"):
    others = df[[c for c in W if c != w]].mean(axis=1)
    r = (df[w] - others).rolling(200).mean()          # 1 s average
    return r[others > 5]

a, b = load("dump1.parquet"), load("dump2.parquet")
ra = resid(a); med = ra.median(); mad = (ra - med).abs().median() * 1.4826
thr = (ra - med).abs().quantile(0.999)
print(f"fit on dump1: residual median {med:.3f} km/h, robust spread {mad:.3f}, 99.9th pct |dev| {thr:.3f} km/h")
rb = resid(b); fa = ((rb - med).abs() > thr).mean()
print(f"dump2 normal: fraction of moving rows above threshold {fa:.4%}")

rng = np.random.default_rng(0)
for kind in ("offset", "drift", "freeze"):
  for size in (0.5, 1.0, 2.0, 5.0):           # km/h
    hits = 0; n = 30
    for _ in range(n):
        x = b.copy()
        while True:
            s = int(rng.integers(0, len(x) - 2000))
            if (x[W].mean(axis=1).iloc[s:s+2000] > 5).all(): break
        idx = x.index[s:s+2000]                    # 10 s attack
        if kind == "offset": x.loc[idx, W[0]] += size
        elif kind == "drift": x.loc[idx, W[0]] += np.linspace(0, size, 2000)
        else:
            if size != 0.5: continue               # freeze has no size; run once per placement
            x.loc[idx, W[0]] = x.loc[idx[0], W[0]]
        r = resid(x).reindex(idx).dropna()
        hits += bool(((r - med).abs() > thr).any())
    if kind == "freeze" and size != 0.5: continue
    print(f"{kind:6s} size {size if kind!='freeze' else '-':>4} km/h: detected {hits}/{n}")
