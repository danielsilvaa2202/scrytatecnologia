document.addEventListener('DOMContentLoaded', () => {
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { 
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        const config = {
            particleColor: 'rgba(133, 230, 192, 0.7)',
            lineColor: 'rgba(107, 179, 155, 0.2)',
            particleAmount: 80,
            defaultRadius: 2,
            variantRadius: 2,
            defaultSpeed: 0.5,
            variantSpeed: 1,
            linkRadius: 150,
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = config.defaultRadius + Math.random() * config.variantRadius;
                this.speedX = (Math.random() - 0.5) * config.defaultSpeed;
                this.speedY = (Math.random() - 0.5) * config.defaultSpeed;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

        const linkParticles = () => {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.linkRadius) {
                        const opacity = 1 - (distance / config.linkRadius);
                        ctx.strokeStyle = `rgba(107, 179, 155, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            linkParticles();
            requestAnimationFrame(animate);
        };

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            let amount = config.particleAmount;
            if (window.innerWidth < 768) {
                amount = 40;
            }

            particlesArray = [];
            for (let i = 0; i < amount; i++) {
                particlesArray.push(new Particle());
            }
        };

        window.addEventListener('resize', setupCanvas);

        setupCanvas();
        animate();
    }
});