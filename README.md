# TGRM Coding-Speed Simulator — Reparodynamics

Interactive open-science simulator demonstrating **Targeted Gradient Repair Mechanisms (TGRM)** applied to coding pipelines.

## Overview
TGRM implements *adaptive micro-repairs* gated by threshold τ, reducing full repair cycles in computation or code correction.  
The result is both **higher efficiency** and **faster throughput**, consistent with the Reparodynamics compute–repair law.

## Coding-Speed Gain
Each simulated “repair” represents a correction or code fix.  
Instead of performing full rewrites (high cost), TGRM performs localized micro-repairs (low cost),  
leading to an observed **+40–50 % gain in effective coding velocity** for τ ≈ 0.6 under moderate noise.

| Parameter | Symbol | Value | Description |
|------------|---------|--------|-------------|
| Steps | n | 1,000 | Simulation length |
| Error probability | pₑ | 0.20 | Noise level |
| Adaptive threshold | τ | 0.60 | Repair gate |
| Full repair cost | Cₓ | 5 | Baseline penalty |
| Micro-repair cost | Cₘ | 1 | Localized fix cost |

**Observed:** `Std: 1090 | TGRM: 559 | Gain: ≈ 48.7 %`

## Run Locally
```bash
python tgrm_sim.py
python tgrm_sim.py --tau 0.6 --err 0.2 --repeats 50
```

Or view interactively at:  
🌐 [https://bonemantgrm.github.io/tgrm-coding-speed-sim](https://bonemantgrm.github.io/tgrm-coding-speed-sim)

## Citation
Cody R. Jenkins — *Reparodynamics: Compute–Repair Law Validation*  
Zenodo DOI: [10.5281/zenodo.17336075](https://doi.org/10.5281/zenodo.17336075)

---

© 2025 Open Science Reparodynamics Initiative — MIT (Code) · CC BY 4.0 (Docs)
