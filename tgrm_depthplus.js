<script>
function std_pipeline_depthplus(n = 1000, err = 0.2, cost = 5) {
  let total = 0;
  for (let i = 0; i < n; i++) if (Math.random() < err) total += cost;
  return total;
}

function tgrm_pipeline_depthplus(n = 1000, err = 0.2, cost = 5, micro = 1, tau = 0.9) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < err) {
      total += Math.random() < tau ? micro : cost;
    }
  }
  return total;
}

// 1K–8K scaling
function runDepthPlusSim() {
  const results = [];
  const windows = [1000,2000,3000,4000,5000,6000,7000,8000];
  for (const w of windows) {
    const err = 0.1 + 0.05 * Math.log10(w/1000);
    const std = std_pipeline_depthplus(w, err);
    const tgrm = tgrm_pipeline_depthplus(w, err, 5, 1, 0.9);
    const gain = ((std - tgrm) / std) * 100;
    results.push({window:w, gain:gain.toFixed(1)});
  }

  const box = document.createElement('div');
  box.style.marginTop='25px';
  box.style.padding='12px';
  box.style.background='rgba(0,255,200,0.08)';
  box.style.borderRadius='8px';
  box.style.color='#00ffaa';
  box.innerHTML=`<h3>🧩 DepthPlus Results (1K–8K Windows)</h3>
  <pre>${JSON.stringify(results,null,2)}</pre>`;
  document.body.appendChild(box);
}

document.addEventListener('DOMContentLoaded', runDepthPlusSim);
</script>
