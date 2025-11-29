var typed = new Typed(".textt", {
    strings:["Canva Designer", "CDR and Adobe Designer", "Web Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

(function(){
    const canvas = document.getElementById('bg-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

    let dpr = window.devicePixelRatio || 1;
    function resize(){
        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    function createParticles(){
        particles.length = 0;
        const area = window.innerWidth * window.innerHeight;
        const count = Math.max(30, Math.min(220, Math.floor(area / 40000)));
        for(let i=0;i<count;i++){
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 2 + 0.6,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                alpha: Math.random() * 0.6 + 0.15
            });
        }
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(const p of particles){
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if(p.x < -10) p.x = window.innerWidth + 10;
            if(p.x > window.innerWidth + 10) p.x = -10;
            if(p.y < -10) p.y = window.innerHeight + 10;
            if(p.y > window.innerHeight + 10) p.y = -10;
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
})();

(function(){
    const imgs = Array.from(document.querySelectorAll('.project img, .project2 img'));
    if(!imgs.length) return;

    imgs.forEach((img, i) => {
        const state = {
            targetX: 0, targetY: 0, targetR: 0, targetShadow: 6,
            curX: 0, curY: 0, curR: 0, curShadow: 6,
            raf: null
        };
        const depthBase = 8 + (i % 3) * 4;

        function tick(){
            const ease = 0.14; 
            state.curX += (state.targetX - state.curX) * ease;
            state.curY += (state.targetY - state.curY) * ease;
            state.curR += (state.targetR - state.curR) * ease;
            state.curShadow += (state.targetShadow - state.curShadow) * ease;

            img.style.transform = `translate3d(${state.curX}px, ${state.curY}px, 0) rotate(${state.curR}deg)`;
            img.style.boxShadow = `0 ${state.curShadow}px ${Math.abs(state.curShadow)*0.6}px rgba(0,0,0,0.25)`;

            const dx = Math.abs(state.curX - state.targetX);
            const dy = Math.abs(state.curY - state.targetY);
            const dr = Math.abs(state.curR - state.targetR);
            if ((dx + dy + dr) > 0.1) {
                state.raf = requestAnimationFrame(tick);
            } else {
                state.raf = null;
            }
        }

        function onPointerMove(e){
            const rect = img.getBoundingClientRect();
            const width = rect.width || 1;
            const height = rect.height || 1;
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
            const x = (clientX - rect.left) / width - 0.5; 
            const y = (clientY - rect.top) / height - 0.5;
            const depth = depthBase;
            state.targetX = x * depth * 1.2;
            state.targetY = y * depth * 0.9;
            state.targetR = x * (depth / 6) * 6;
            state.targetShadow = Math.abs(state.targetY) * 0.6 + 6;
            if(!state.raf) state.raf = requestAnimationFrame(tick);
        }

        function onLeave(){
            state.targetX = 0; state.targetY = 0; state.targetR = 0; state.targetShadow = 6;
            if(!state.raf) state.raf = requestAnimationFrame(tick);
        }

        img.style.willChange = 'transform';
        img.addEventListener('pointermove', onPointerMove);
        img.addEventListener('pointerleave', onLeave);
        img.addEventListener('touchmove', onPointerMove, {passive: true});
    });
})();