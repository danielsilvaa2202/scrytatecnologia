document.addEventListener('DOMContentLoaded', () => {
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav-container');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { 
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Lógica do Menu Mobile (estava correta, mantida como original)
    if (mobileMenuToggle && mobileNavContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('is-open');
            mobileNavContainer.classList.toggle('is-open');
            document.body.classList.toggle('mobile-nav-open');
        });

        mobileNavContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('is-open');
                mobileNavContainer.classList.remove('is-open');
                document.body.classList.remove('mobile-nav-open');
            });
        });
    }

    // Lógica de Animação ao Rolar
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries, observer) => {
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
        animationObserver.observe(element);
    });

    // Lógica de Tema do Header
    const headerThemeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && header) {
                const theme = entry.target.getAttribute('data-header-theme');
                if (theme === 'dark') {
                    header.classList.add('header-dark-theme');
                } else {
                    header.classList.remove('header-dark-theme');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    const themedSections = document.querySelectorAll('[data-header-theme]');
    themedSections.forEach(section => {
        headerThemeObserver.observe(section);
    });

    // Lógica do Canvas (Partículas)
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

    // Lógica do Modal Pop-up
    const modal = document.getElementById('popup-modal');
    const closeModalButton = document.getElementById('modal-close-button');
    const modalCtaButton = document.getElementById('modal-cta-button');

    const showModal = () => {
        if (modal) {
            modal.classList.add('is-visible');
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('is-visible');
        }
    };

    setTimeout(showModal, 2000); // Mostra o modal inicial após 2 segundos

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (modalCtaButton) {
        modalCtaButton.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // === FIX: Lógica do Formulário Netlify e Modal de Sucesso ===
    
    const contactForm = document.querySelector('form[name="contact"]');
    const successModal = document.getElementById('success-modal');
    const successModalCloseBtn = document.getElementById('success-modal-close-button');
    const successModalOkBtn = document.getElementById('success-modal-ok-button');

    // Função para fechar o modal de sucesso
    const closeSuccessModal = () => {
        if (successModal) {
            successModal.classList.remove('is-visible');
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            const formData = new FormData(contactForm);
            
            // Envia os dados para o Netlify em background
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Sucesso
                contactForm.reset(); // Limpa o formulário
                if (successModal) {
                    successModal.classList.add('is-visible'); // Mostra o modal de sucesso
                }
            })
            .catch((error) => {
                // Erro
                alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
                console.error('Form submission error:', error);
            });
        });
    }

    // Handlers para fechar o modal de sucesso
    if (successModalCloseBtn) {
        successModalCloseBtn.addEventListener('click', closeSuccessModal);
    }
    if (successModalOkBtn) {
        successModalOkBtn.addEventListener('click', closeSuccessModal);
    }
    if (successModal) {
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) {
                closeSuccessModal();
            }
        });
    }
    // === FIM DO FIX DO FORMULÁRIO ===

});