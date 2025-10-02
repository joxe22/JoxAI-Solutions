
// ==========================================
// ANIMATIONS.JS - Funcionalidades de animación
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initHoverEffects();
    initLoadingAnimations();
});

// Animaciones al hacer scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .portfolio-item, .project-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Efectos hover mejorados
function initHoverEffects() {
    // Efecto de tilt en tarjetas
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) { // Solo en desktop
                const cardRect = card.getBoundingClientRect();
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Animaciones de carga
function initLoadingAnimations() {
    // Simular carga de elementos
    const loadingElements = document.querySelectorAll('.loading');
    
    loadingElements.forEach(element => {
        setTimeout(() => {
            element.classList.remove('loading');
        }, 1000);
    });
}

// Función para animación de contadores
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Función para animación de tipo máquina de escribir
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Efecto de partículas (si se necesita en otras páginas)
function initParticles(containerId, count = 30) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        createParticle(container);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.background = 'var(--accent-blue)';
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        const duration = Math.random() * 10 + 10;
        particle.style.animation = `particleFloat ${duration}s infinite linear`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle(container);
            }
        }, duration * 1000);
    }
}

// Exportar funciones para uso global
window.animateCounter = animateCounter;
window.typeWriter = typeWriter;
window.initParticles = initParticles;
