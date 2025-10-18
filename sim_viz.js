// sim_viz.js — extras: pulsing speed badge + lane visualizer
(function(){
  const badge = document.getElementById('gainBadge');
  const laneA = document.getElementById('laneA');
  const laneB = document.getElementById('laneB');

  function setBadge(gain){
    if(!badge) return;
    badge.textContent = `Gain: ${gain.toFixed(1)}%`;
    // speed of pulse depends on gain
    const dur = Math.max(0.8, 2.2 - Math.min(1.8, gain/35));
    badge.style.animationDuration = dur + 's';
  }

  // simple lane animator: moves a dot across based on relative throughput
  function animateLanes(baseX, tgrmX){
    if(!(laneA && laneB)) return;
    const a = laneA.querySelector('.dot');
    const b = laneB.querySelector('.dot');
    const maxSteps = 120;
    let i = 0;
    const scale = 100/Math.max(baseX, tgrmX);
    const aStep = baseX*scale, bStep = tgrmX*scale;

    a.style.left = '0%'; b.style.left = '0%';
    clearInterval(window.__laneTimer);
    window.__laneTimer = setInterval(()=>{
      i++;
      const ax = Math.min(100, i*aStep/ maxSteps * 100);
      const bx = Math.min(100, i*bStep/ maxSteps * 100);
      a.style.left = ax + '%';
      b.style.left = bx + '%';
      if(ax>=100 && bx>=100){ clearInterval(window.__laneTimer); }
    }, 16);
  }

  // Hook into global run() result if available
  window.addEventListener('tgrm:afterRun', (ev)=>{
    const {gain, baseX, tgrmX} = ev.detail;
    setBadge(gain);
    animateLanes(baseX, tgrmX);
  });
})();