// ==========================================
// MAIN.JS - Funcionalidad principal del sitio
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initAnimations();
    initParticles();
    initContactForm();
    initStatsCounter();
    initSmoothScroll();
});

// ==========================================
// NAVEGACIÓN
// ==========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Efecto de scroll en navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 29, 41, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 29, 41, 0.95)';
        }
    });
    
    // Resaltar link activo
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ==========================================
// ANIMACIONES DE ENTRADA
// ==========================================
function initAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll(
        '.service-card, .stat-item, .contact-form, .section-title'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// SISTEMA DE PARTÍCULAS
// ==========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Estilo de partícula
        particle.style.background = '#4a90e2';
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        // Animación
        particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s infinite linear`;
        
        particlesContainer.appendChild(particle);
        
        // Remover y recrear partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle();
            }
        }, (Math.random() * 10 + 10) * 1000);
    }
}

// ==========================================
// CONTADOR DE ESTADÍSTICAS
// ==========================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target === 95 ? '%' : target === 24 ? '/7' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target === 95 ? '%' : target === 24 ? '/7' : '+');
        }
    }, 16);
}

// Función para mostrar notificaciones (necesitarás el CSS para que se vean bien)
function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error('Contenedor de notificaciones no encontrado.');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`; // Clases CSS para estilo (ej: .notification, .success, .error)
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Ocultar la notificación después de unos segundos
    setTimeout(() => {
        notification.remove();
    }, 5000); // 5 segundos
}


// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault(); // ¡Importante! Prevenir el envío estándar del navegador

    const form = e.target;
    const formData = new FormData(form);

    // Codificar los datos del formulario para el envío
    // Netlify espera los datos en formato URL-encoded si se envía con AJAX
    const encoded = new URLSearchParams(formData).toString();

    try {
        // La URL de envío para Netlify Forms con AJAX es siempre la misma URL de la página
        // desde donde se envía el formulario. Netlify intercepta el POST.
        const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encoded,
        });

        if (response.ok) {
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset(); // Limpiar el formulario
        } else {
            // Manejar posibles errores del servidor de Netlify (ej. configuración incorrecta del form)
            showNotification('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.', 'error');
            // Opcional: obtener más detalles del error si Netlify los proporciona
            // const errorText = await response.text();
            // console.error("Error de Netlify:", errorText);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showNotification('Ocurrió un error de red. Por favor, verifica tu conexión e inténtalo de nuevo.', 'error');
    }
}

// Asegúrate de llamar a initContactForm cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initContactForm);

// ==========================================
// SCROLL SUAVE
// ==========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// SERVICIOS INTERACTIVOS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            showServiceModal(serviceType);
        });
    });
});

function showServiceModal(serviceType) {
    // Información detallada de cada servicio
    const serviceInfo = {
        ai: {
            title: 'Soluciones de Inteligencia Artificial',
            description: 'Implementamos IA personalizada para automatizar procesos y mejorar la toma de decisiones.',
            features: [
                'Chatbots conversacionales avanzados',
                'Análisis predictivo de datos empresariales',
                'Sistemas de recomendación personalizados',
                'Procesamiento de lenguaje natural',
                'Visión por computadora',
                'Machine Learning personalizado'
            ],
            price: 'Desde $2,500'
        },
        automation: {
            title: 'Automatización Empresarial',
            description: 'Optimizamos tus procesos con automatización inteligente para aumentar la eficiencia.',
            features: [
                'Automatización de workflows',
                'Marketing automation',
                'Integración de sistemas',
                'Automatización de ventas',
                'Gestión automatizada de inventarios',
                'Reportes automáticos'
            ],
            price: 'Desde $1,800'
        },
        web: {
            title: 'Desarrollo Web Premium',
            description: 'Sitios web modernos, rápidos y optimizados para conversión y posicionamiento SEO.',
            features: [
                'Diseño UX/UI profesional',
                'Desarrollo responsive',
                'Optimización SEO avanzada',
                'Animaciones interactivas',
                'Integración con herramientas IA',
                'Mantenimiento continuo'
            ],
            price: 'Desde $1,200'
        }
    };
    
    const info = serviceInfo[serviceType];
    if (!info) return;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${info.title}</h3>
            <p>${info.description}</p>
            <h4>Características incluidas:</h4>
            <ul>
                ${info.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <div class="modal-price">${info.price}</div>
            <div class="modal-actions">
                <button class="btn-primary modal-cta">Solicitar Cotización</button>
                <button class="btn-secondary modal-demo">Ver Demo</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners del modal
    modal.querySelector('.modal-close').onclick = () => closeModal(modal);
    modal.querySelector('.modal-overlay').onclick = () => closeModal(modal);
    modal.querySelector('.modal-cta').onclick = () => {
        closeModal(modal);
        document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}