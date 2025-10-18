/* ============================================================
   TGRM AutoViz Simulator — for adaptive coding-speed dynamics
   Author: Cody R. Jenkins — Open Science Reparodynamics Initiative
   ============================================================ */

function RNG(seed){let s=seed>>>0;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s>>>=0;s^=s<<5;s>>>=0;return(s>>>0)/4294967296}}

function stdPipeline(n,err,fixCost,rng){
  let t=0; for(let i=0;i<n;i++) if(rng()<err) t+=fixCost; return t;
}

function tgrmPipeline(n,err,fixCost,mCost,tau,rng){
  let t=0,e=0,E=1000;
  for(let i=0;i<n;i++) if(rng()<err){
    let s=rng();
    if(s<tau && e<E){ t+=mCost; e+=mCost; }
    else{ t+=fixCost; e+=1; }
  }
  return t;
}

function runOnce(p,seed=42){
  let r1=RNG(seed), r2=RNG(seed);
  let std = stdPipeline(p.n,p.err,p.fix,r1);
  let tgrm = tgrmPipeline(p.n,p.err,p.fix,p.mc,p.tau,r2);
  let gain = std ? ((std - tgrm)/std*100) : 0;
  let baseX = std>0 ? (p.n/std) : 1;
  let tgrmX = tgrm>0 ? (p.n/tgrm) : 1;
  return {std,tgrm,gain,baseX,tgrmX};
}

/* ---- UI Wiring ---- */
const els = {
  n:document.getElementById('n'),
  err:document.getElementById('err'),
  tau:document.getElementById('tau'),
  fix:document.getElementById('fix'),
  mc:document.getElementById('mc'),
  nOut:document.getElementById('nOut'),
  errOut:document.getElementById('errOut'),
  tauOut:document.getElementById('tauOut'),
  fixOut:document.getElementById('fixOut'),
  mcOut:document.getElementById('mcOut'),
  runBtn:document.getElementById('runBtn'),
  result:document.getElementById('result'),
  chart:document.getElementById('chart'),
  baseBar:document.getElementById('baseBar'),
  tgrmBar:document.getElementById('tgrmBar'),
  baseX:document.getElementById('baseX'),
  tgrmX:document.getElementById('tgrmX')
};

function sync(){
  els.nOut.textContent   = els.n.value;
  els.errOut.textContent = +els.err.value;
  els.tauOut.textContent = +els.tau.value;
  els.fixOut.textContent = +els.fix.value;
  els.mcOut.textContent  = +els.mc.value;
}

['n','err','tau','fix','mc'].forEach(k=>{
  if(els[k]) els[k].addEventListener('input', ()=>{ sync(); run(); });
});
sync();

function params(){
  return {
    n:+els.n.value,
    err:+els.err.value,
    tau:+els.tau.value,
    fix:+els.fix.value,
    mc:+els.mc.value
  };
}

function animateBars(b,t){
  let M=Math.max(b,t) || 1;
  let nb=b/M, nt=t/M;
  els.baseBar.style.width = Math.round(nb*100)+'%';
  els.tgrmBar.style.width = Math.round(nt*100)+'%';
  els.baseX.textContent = b.toFixed(2)+'×';
  els.tgrmX.textContent = t.toFixed(2)+'×';
}

function drawChart(ctx,taus,gains){
  const W=ctx.canvas.width, H=ctx.canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='#999';
  ctx.beginPath(); ctx.moveTo(40,H-30); ctx.lineTo(W-10,H-30); ctx.lineTo(W-10,20); ctx.stroke();
  ctx.strokeStyle='#0a7';
  ctx.beginPath();
  for(let i=0;i<taus.length;i++){
    let X=40+(W-60)*(taus[i]-0.1)/0.8;
    let Y=(H-30)-(H-60)*gains[i]/60;
    i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);
  }
  ctx.stroke();
}

function run(){
  const p = params();
  const o = runOnce(p,42);

  els.result.textContent = `Std: ${Math.round(o.std)}, TGRM: ${Math.round(o.tgrm)}, Gain: ${o.gain.toFixed(1)}%`;
  animateBars(o.baseX,o.tgrmX);

  const taus=[], gains=[];
  for(let t=0.1;t<=0.9;t+=0.05){
    taus.push(+t.toFixed(2));
    gains.push(runOnce({...p, tau:t},42).gain);
  }
  drawChart(els.chart.getContext('2d'), taus, gains);

  // Broadcast to visualizers and iframes
  window.dispatchEvent(new CustomEvent('tgrm:afterRun', {detail:{gain:o.gain, baseX:o.baseX, tgrmX:o.tgrmX}}));
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({type:'tgrm-afterRun', gain:o.gain, baseX:o.baseX, tgrmX:o.tgrmX}, '*');
  }
}

if(els.runBtn) els.runBtn.addEventListener('click', run);
run();

console.log("✅ TGRM AutoViz Simulator loaded — ready to compute adaptive repair efficiency.");
