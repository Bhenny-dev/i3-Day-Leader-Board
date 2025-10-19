document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return console.error('Canvas element not found!');
  const ctx = canvas.getContext('2d');

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const mouse = { x: w/2, y: h/2 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  let gradOffset = 0;

  // Adjust particle count dynamically based on screen size
  const particleCount = Math.min(150, Math.floor(w*h/20000));
  const particles = [];
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 1 + Math.random()*1.5,
      dx: (Math.random()-0.5)*0.3,
      dy: (Math.random()-0.5)*0.3,
      hue: 200 + Math.random()*40,
      pulse: Math.random()*Math.PI*2
    });
  }

  // Waves
  const waveCount = 3;
  const waves = [];
  for(let i=0;i<waveCount;i++){
    waves.push({
      offset: Math.random()*Math.PI*2,
      speed: 0.0015 + Math.random()*0.002,
      amplitude: 25 + Math.random()*20,
      wavelength: 250 + Math.random()*250,
      hue: 210 + Math.random()*40
    });
  }

  function animate(){
    gradOffset += 0.0015;

    // Gradient background
    const grad = ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0, `hsl(${200 + 40*Math.sin(gradOffset)}, 35%, 12%)`);
    grad.addColorStop(1, `hsl(${240 + 40*Math.cos(gradOffset)}, 45%, 22%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    // Draw smooth waves
    waves.forEach(wave=>{
      ctx.beginPath();
      for(let x=0;x<w;x+=3){
        const y = h/2 + Math.sin((x/wave.wavelength)*2*Math.PI + wave.offset)*wave.amplitude;
        ctx.lineTo(x,y);
      }
      ctx.strokeStyle = `hsla(${wave.hue},50%,70%,0.12)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      wave.offset += wave.speed;
    });

    // Draw particles
    particles.forEach(p=>{
      p.x += p.dx + (mouse.x-w/2)*0.0004;
      p.y += p.dy + (mouse.y-h/2)*0.0004;
      if(p.x<0||p.x>w) p.dx*=-1;
      if(p.y<0||p.y>h) p.dy*=-1;

      const r = p.r + Math.sin(p.pulse)*0.3;
      p.pulse += 0.02;

      ctx.beginPath();
      ctx.arc(p.x,p.y,r,0,Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.55)`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = `hsla(${p.hue}, 80%, 70%, 0.7)`;
      ctx.fill();
    });

    // Connect nearby particles with soft lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy=a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<90){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `hsla(${a.hue},60%,70%,${1-dist/90})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
