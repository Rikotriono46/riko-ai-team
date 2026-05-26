/* RIKO AI TEAM - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PARTICLES =====
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        class P {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.o = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108,92,231,${this.o})`;
                ctx.fill();
            }
        }

        const cnt = Math.min(70, Math.floor(W / 16));
        for (let i = 0; i < cnt; i++) particles.push(new P());

        function animate() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(108,92,231,${0.06 * (1 - d / 110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== NAVBAR =====
    const nav = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
        });
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const suffix = el.dataset.suffix || '';
                    const dur = 2000;
                    const step = target / (dur / 16);
                    let cur = 0;
                    const timer = setInterval(() => {
                        cur += step;
                        if (cur >= target) {
                            el.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(cur);
                        }
                    }, 16);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => obs.observe(c));
    }

    // ===== CONTACT FORM → WhatsApp =====
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            const waNumber = '6282125955744';
            const msg = `Halo RIKO AI Team! 👋\n\n*Nama:* ${data.name}\n*Email:* ${data.email}\n*Layanan:* ${data.service}\n\n*Pesan:*\n${data.message}`;
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
            showToast('Redirect ke WhatsApp...');
            form.reset();
        });
    }

    // ===== TOAST =====
    function showToast(msg) {
        const t = document.getElementById('toast') || document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        if (!t.parentNode) document.body.appendChild(t);
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => { t.classList.remove('show'); }, 3500);
    }

    // ===== SCROLL REVEAL =====
    const revealEls = document.querySelectorAll('.agent-card, .service-card, .cap-card, .step, .c-card, .contact-form');
    const revObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
        revObs.observe(el);
    });

    console.log('⚡ RIKO AI Team website loaded!');
});
