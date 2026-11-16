"""Implementation guide steps 2-3: inventory the X-CANIDS signal files and check the signals we need.

Run from the project root:  python src/inventory.py
Writes results/inventory.csv, results/signal_check.csv, results/signal_check.md and plots in results/plots/.
Reads only the columns it needs, so memory stays small.
"""
import re
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pyarrow.parquet as pq

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "results"
PLOTS = OUT / "plots"

# Signal -> expected message ID (hex), from hyundai_2015_ccan.dbc. ReadMe: columns are named AID_SignalName.
NEEDED = {
    "WHL_SPD_FL": "386", "WHL_SPD_FR": "386", "WHL_SPD_RL": "386", "WHL_SPD_RR": "386",
    "CF_Clu_Vanz": "4F1", "VS": "316", "VS_TCU": "112", "VS_TCU_DECIMAL": "112", "N": "316",
    # 112_CUR_GR is decoded as text P/R/D (lever position), not a gear number. The 1-7 target gear is in TCU13.
    "CF_Tcu_TarGr": "113", "SLOPE_TCU": "113",
    "LONG_ACCEL": "220", "LAT_ACCEL": "220", "YAW_RATE": "220", "SAS_Angle": "2B0",
    "TEMP_ENG": "329",
}
MIN_SPEED = 5.0  # km/h, implementation guide step 5 (our choice)


def find_columns(names):
    """Map each needed signal to its column. Report every candidate so nothing is guessed."""
    found, notes = {}, []
    for sig, aid in NEEDED.items():
        cands = [c for c in names if re.fullmatch(r"[0-9A-Fa-f]{3}_" + re.escape(sig), c)]
        exact = [c for c in cands if c.split("_", 1)[0].upper() == aid]
        if exact:
            found[sig] = exact[0]
        if len(cands) != 1 or not exact:
            notes.append(f"{sig}: expected {aid}_{sig}; candidates {cands or 'NONE'}")
    return found, notes


def main():
    files = sorted(DATA.rglob("*.parquet"))
    if not files:
        sys.exit(f"No parquet files under {DATA}. Unzip signal.zip there first.")
    OUT.mkdir(exist_ok=True)
    PLOTS.mkdir(exist_ok=True)

    names = pq.ParquetFile(files[0]).schema_arrow.names
    cols, notes = find_columns(names)
    print(f"{len(names)} columns in {files[0].name}; matched {len(cols)}/{len(NEEDED)} needed signals")
    for n in notes:
        print("  NOTE", n)

    inv, checks = [], []
    for f in files:
        pf = pq.ParquetFile(f)
        avail = set(pf.schema_arrow.names)
        use = [c for c in cols.values() if c in avail] + (["label"] if "label" in avail else [])
        df = pd.read_parquet(f, columns=use)
        t = df.index.to_series()
        t = (t - t.iloc[0]).dt.total_seconds() if np.issubdtype(t.dtype, np.timedelta64) else t - t.iloc[0]
        dt = np.diff(t.to_numpy())
        lab = df["label"].value_counts().to_dict() if "label" in df else {}
        wheel = df[[cols[s] for s in ("WHL_SPD_FL", "WHL_SPD_FR", "WHL_SPD_RL", "WHL_SPD_RR") if s in cols]].mean(axis=1)
        moving = float((wheel > MIN_SPEED).mean())
        inv.append({
            "file": str(f.relative_to(DATA)), "rows": len(df), "columns_total": len(avail),
            "duration_min": round(float(t.iloc[-1]) / 60, 2),
            "step_ms_median": round(float(np.median(dt)) * 1000, 3), "step_ms_min": round(float(dt.min()) * 1000, 3),
            "step_ms_max": round(float(dt.max()) * 1000, 3),
            "label0": lab.get(0, 0), "label1": lab.get(1, 0),
            "frac_above_5kmh": round(moving, 3), "max_wheel_kmh": round(float(wheel.max()), 1),
        })
        # Per-signal checks only on normal recordings (no attack files).
        if "-" in f.stem:
            continue
        for sig, c in cols.items():
            if c not in df:
                continue
            x = pd.to_numeric(df[c], errors="coerce")
            checks.append({
                "file": f.stem, "signal": sig, "column": c,
                "nan_frac": round(float(x.isna().mean()), 4),
                "first_valid_s": round(float(t[x.first_valid_index()]) if x.notna().any() else np.nan, 3),
                "min": x.min(), "max": x.max(), "mean": round(float(x.mean()), 3),
                "n_unique": int(x.nunique()),
            })
    inv = pd.DataFrame(inv)
    chk = pd.DataFrame(checks)
    inv.to_csv(OUT / "inventory.csv", index=False)
    chk.to_csv(OUT / "signal_check.csv", index=False)
    print(inv.to_string(index=False))
    print(chk.to_string(index=False))
    behaviour_checks(files, cols)


def behaviour_checks(files, cols):
    """Step 3: do the signals behave like their names? Numbers + one plot per normal recording."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    lines = ["# Signal behaviour checks (step 3)", "",
             f"Rows with mean wheel speed above {MIN_SPEED} km/h only. Correlation = Pearson r.", ""]
    for f in files:
        if "-" in f.stem:
            continue
        df = pd.read_parquet(f, columns=list(cols.values())).rename(columns={v: k for k, v in cols.items()})
        df = df.dropna()
        w = df[["WHL_SPD_FL", "WHL_SPD_FR", "WHL_SPD_RL", "WHL_SPD_RR"]]
        df["wheel"] = w.mean(axis=1)
        dt = 0.005  # ReadMe: 5 ms grid
        # d(speed)/dt on the full recording (contiguous), then masked; 0.5 s smoothing, km/h -> m/s
        df["dv"] = (df["wheel"].rolling(100, center=True).mean() / 3.6).diff() / dt
        m = df[df["wheel"] > MIN_SPEED]
        lines.append(f"## {f.stem}  ({len(m)} moving rows of {len(df)})")
        if len(m) < 1000:
            lines += ["Too little moving data; probably the idling recording.", ""]
            continue
        r = lambda a, b: round(float(np.corrcoef(a, b)[0, 1]), 4)
        dv = m["dv"]
        ok = dv.notna()
        lines += [
            f"- wheel FL vs FR vs RL vs RR: max spread {round(float((w.loc[m.index].max(axis=1) - w.loc[m.index].min(axis=1)).median()), 3)} km/h (median of per-row max-min)",
            f"- R1 wheel vs CF_Clu_Vanz r={r(m.wheel, m.CF_Clu_Vanz)}, vs VS r={r(m.wheel, m.VS)}, vs VS_TCU r={r(m.wheel, m.VS_TCU)}",
            f"- R2 d(wheel speed)/dt vs LONG_ACCEL r={r(dv[ok], m.LONG_ACCEL[ok])}",
            f"- R3 YAW_RATE vs (RR-RL) r={r(m.YAW_RATE, m.WHL_SPD_RR - m.WHL_SPD_RL)}",
            f"- R4 LAT_ACCEL vs speed*YAW_RATE r={r(m.LAT_ACCEL, m.wheel * m.YAW_RATE)}",
            f"- YAW_RATE vs SAS_Angle r={r(m.YAW_RATE, m.SAS_Angle)}",
            f"- R5 N/speed by gear (median, IQR): "
            + ", ".join(f"g{int(g)}: {np.median(q):.1f} ({np.percentile(q, 25):.1f}-{np.percentile(q, 75):.1f}, n={len(q)})"
                        for g, q in ((g, (grp.N / grp.wheel).to_numpy()) for g, grp in m.groupby("CF_Tcu_TarGr")) if len(q) > 200),
            "",
        ]
        fig, ax = plt.subplots(6, 1, figsize=(12, 13), sharex=True)
        tt = (df.index - df.index[0]) / pd.Timedelta(seconds=1)  # ReadMe: timedelta index
        for s in ("WHL_SPD_FL", "WHL_SPD_FR", "WHL_SPD_RL", "WHL_SPD_RR", "CF_Clu_Vanz", "VS", "VS_TCU"):
            ax[0].plot(tt, df[s], lw=0.6, label=s)
        ax[0].legend(fontsize=6, ncol=4); ax[0].set_ylabel("km/h")
        ax[1].plot(tt, df.LONG_ACCEL, lw=0.5); ax[1].set_ylabel("LONG_ACCEL")
        ax[2].plot(tt, df.YAW_RATE, lw=0.5, label="YAW_RATE"); ax[2].plot(tt, df.SAS_Angle / 10, lw=0.5, label="SAS_Angle/10"); ax[2].legend(fontsize=6)
        ax[3].plot(tt, df.LAT_ACCEL, lw=0.5); ax[3].set_ylabel("LAT_ACCEL")
        ax[4].plot(tt, df.N, lw=0.5); ax[4].set_ylabel("N rpm")
        ax[5].plot(tt, df.CF_Tcu_TarGr * 10, lw=0.5, label="gear x10"); ax[5].plot(tt, df.TEMP_ENG, lw=0.5, label="TEMP_ENG")
        ax[5].plot(tt, df.SLOPE_TCU * 10, lw=0.5, label="SLOPE_TCU x10"); ax[5].legend(fontsize=6)
        ax[5].set_xlabel("seconds")
        fig.suptitle(f.stem); fig.tight_layout(); fig.savefig(PLOTS / f"signals_{f.stem}.png", dpi=110); plt.close(fig)
    (OUT / "signal_check.md").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
