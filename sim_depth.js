// sim_depth.js — Reparodynamics Multi-Depth Context Model (1K–8K)
import math from "mathjs";

function std_pipeline(n = 1000, err = 0.2, cost = 5) {
  let total = 0;
  for (let i = 0; i < n; i++) if (Math.random() < err) total += cost;
  return total;
}

function tgrm_pipeline(n = 1000, err = 0.2, cost = 5, micro = 1, tau = 0.9) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < err) {
      total += Math.random() < tau ? micro : cost;
    }
  }
  return total;
}

// sweep across context depths (1K–8K)
export function runDepthSim() {
  const windows = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];
  const results = [];
  for (const w of windows) {
    const err = 0.1 + 0.05 * Math.log10(w / 1000);
    const std = std_pipeline(w, err);
    const tgrm = tgrm_pipeline(w, err, 5, 1, 0.9);
    const gain = ((std - tgrm) / std) * 100;
    results.push({ window: w, gain: gain.toFixed(1) });
  }
  console.table(results);
  return results;
}
