document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // --- Header Fixo (Sticky) ---
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

    // --- Menu Mobile ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav-container');

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

    // --- Animação ao Rolar (Scroll Observer) ---
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

    // --- Controle de Tema do Header ---
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

    // =========================================
    // === NOVO: Slider de Automações (Corrigido e com Auto-Play) ===
    // =========================================
    const initAutomationsSlider = () => {
        const sliderTrack = document.querySelector('.slider-track');
        const sliderContainer = document.querySelector('.slider-container'); // Usado para medir largura
        if (!sliderTrack || !sliderContainer) return;

        const slides = Array.from(sliderTrack.children);
        const nextButton = document.getElementById('slider-next');
        const prevButton = document.getElementById('slider-prev');
        const dotsNav = document.getElementById('slider-dots');

        if (slides.length === 0) return;

        let currentSlideIndex = 0;
        let autoPlayInterval;
        const AUTO_PLAY_DELAY = 5000; // 5 segundos por slide

        // 1. Criar Dots
        dotsNav.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
            dot.addEventListener('click', () => {
                resetAutoPlay(); // Pausa o auto-play ao interagir
                goToSlide(index);
            });
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        // 2. Função Principal de Navegação
        const goToSlide = (index) => {
            // Lógica de Loop Infinito
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }

            currentSlideIndex = index;
            
            // Calcula a largura baseada no container visível para maior precisão
            const width = sliderContainer.getBoundingClientRect().width;
            sliderTrack.style.transform = `translateX(-${currentSlideIndex * width}px)`;

            // Atualiza classes ativas
            slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlideIndex));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlideIndex));
        };

        // 3. Funções de Auto-Play
        const startAutoPlay = () => {
            stopAutoPlay(); // Garante que não tem dois intervalos rodando
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlideIndex + 1);
            }, AUTO_PLAY_DELAY);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        // 4. Event Listeners das Setas
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                resetAutoPlay();
                goToSlide(currentSlideIndex + 1);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                resetAutoPlay();
                goToSlide(currentSlideIndex - 1);
            });
        }

        // 5. Responsividade (Recalcula posição ao redimensionar tela)
        window.addEventListener('resize', () => {
            // Remove transição momentaneamente para ajuste instantâneo
            sliderTrack.style.transition = 'none';
            goToSlide(currentSlideIndex);
            // Restaura a transição após um breve delay
            setTimeout(() => {
                sliderTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }, 50);
        });

        // Inicialização
        goToSlide(0);
        startAutoPlay(); // Inicia o slider automático
    };

    // Inicializa o slider
    initAutomationsSlider();

    // =========================================
    // === Canvas Hero (Partículas) ===
    // =========================================
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

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setupCanvas, 200);
        });

        setupCanvas();
        animate();
    }

    // --- Modais ---
    const modal = document.getElementById('popup-modal');
    const closeModalButton = document.getElementById('modal-close-button');
    const modalCtaButton = document.getElementById('modal-cta-button');

    const showModal = () => {
        if (modal && !localStorage.getItem('modalShown')) {
            modal.classList.add('is-visible');
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('is-visible');
        }
    };

    setTimeout(showModal, 3000);

    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (modalCtaButton) modalCtaButton.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    // --- Formulário de Contato ---
    const contactForm = document.querySelector('form[name="contact"]');
    const successModal = document.getElementById('success-modal');
    const successModalCloseBtn = document.getElementById('success-modal-close-button');
    const successModalOkBtn = document.getElementById('success-modal-ok-button');

    const closeSuccessModal = () => {
        if (successModal) successModal.classList.remove('is-visible');
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                contactForm.reset();
                if (successModal) successModal.classList.add('is-visible');
            })
            .catch((error) => {
                alert('Erro ao enviar mensagem. Tente novamente.');
                console.error('Form error:', error);
            });
        });
    }

    if (successModalCloseBtn) successModalCloseBtn.addEventListener('click', closeSuccessModal);
    if (successModalOkBtn) successModalOkBtn.addEventListener('click', closeSuccessModal);
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeSuccessModal();
        });
    }
});