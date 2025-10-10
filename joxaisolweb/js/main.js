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
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle del menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            
            if (isOpen) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('open');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Cerrar menú al hacer click en un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
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
    if (!particlesContainer) return; // Salir si no existe el contenedor
    
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

//FUNCION PARA SISTEMA DE PARTICULAS

        // Función para crear el sistema de partículas
        function createParticleSystem() {
            const container = document.getElementById('particles');
            if (!container) return;

            // Limpiar partículas existentes
            container.innerHTML = '';

            const particleTypes = [
                { class: 'particle-small', count: 50, sizeRange: [2, 6] },
                { class: 'particle-medium', count: 20, sizeRange: [20, 50] },
                { class: 'particle-large', count: 8, sizeRange: [200, 400] }
            ];

            // Crear partículas de diferentes tamaños
            particleTypes.forEach(type => {
                for (let i = 0; i < type.count; i++) {
                    const particle = document.createElement('div');
                    particle.className = type.class;
                    
                    const size = Math.random() * (type.sizeRange[1] - type.sizeRange[0]) + type.sizeRange[0];
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    
                    const duration = Math.random() * 20 + 15;
                    particle.style.animationDuration = `${duration}s`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    
                    container.appendChild(particle);
                }
            });

            // Crear formas geométricas
            const shapes = ['circle', 'triangle', 'square'];
            shapes.forEach((shape, index) => {
                const geomShape = document.createElement('div');
                geomShape.className = `geometric-shape shape-${shape}`;
                
                const positions = [
                    { top: '15%', left: '10%' },
                    { top: '70%', left: '85%' },
                    { top: '40%', left: '75%' }
                ];
                
                geomShape.style.top = positions[index].top;
                geomShape.style.left = positions[index].left;
                geomShape.style.animationDelay = `${index * 2}s`;
                
                container.appendChild(geomShape);
            });

            // Crear líneas de conexión
            for (let i = 0; i < 5; i++) {
                const line = document.createElement('div');
                line.className = 'connection-line';
                
                line.style.width = `${Math.random() * 200 + 100}px`;
                line.style.left = `${Math.random() * 80}%`;
                line.style.top = `${Math.random() * 80 + 10}%`;
                line.style.transform = `rotate(${Math.random() * 180}deg)`;
                line.style.animationDelay = `${Math.random() * 2}s`;
                
                container.appendChild(line);
            }
        }

        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createParticleSystem);
        } else {
            createParticleSystem();
        }

        // Recrear partículas al cambiar el tamaño de la ventana
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(createParticleSystem, 250);
        });

        // ==========================================
// ABOUT PAGE SPECIFIC SCRIPTS
// ==========================================

function initAboutPage() {
    // Check if we're on the about page
    if (!document.body.classList.contains('about-page')) return;
    
    initAboutThreeScene();
    initAboutParticles();
}

// Three.js Scene for About Page
function initAboutThreeScene() {
    const sceneElement = document.getElementById('three-scene');
    if (!sceneElement) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sceneElement.offsetWidth / sceneElement.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(sceneElement.offsetWidth, sceneElement.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    sceneElement.appendChild(renderer.domElement);

    // Create geometries for about page
    const geometries = [
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.DodecahedronGeometry(0.7, 0),
        new THREE.IcosahedronGeometry(0.9, 0),
        new THREE.TetrahedronGeometry(0.6, 0)
    ];

    // Create materials with different colors
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x6c63ff, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x00b4d8, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x1a1a2e, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x4a90e2, wireframe: true })
    ];

    // Create objects
    const objects = [];
    for (let i = 0; i < 12; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const object = new THREE.Mesh(geometry, material);
        
        // Random position
        object.position.x = (Math.random() - 0.5) * 8;
        object.position.y = (Math.random() - 0.5) * 8;
        object.position.z = (Math.random() - 0.5) * 8;
        
        // Random rotation
        object.rotation.x = Math.random() * Math.PI;
        object.rotation.y = Math.random() * Math.PI;
        
        // Rotation speed
        object.userData = {
            rotationSpeedX: (Math.random() - 0.5) * 0.01,
            rotationSpeedY: (Math.random() - 0.5) * 0.01,
            rotationSpeedZ: (Math.random() - 0.5) * 0.01
        };
        
        scene.add(object);
        objects.push(object);
    }

    camera.position.z = 5;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        objects.forEach(object => {
            object.rotation.x += object.userData.rotationSpeedX;
            object.rotation.y += object.userData.rotationSpeedY;
            object.rotation.z += object.userData.rotationSpeedZ;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();

    // Handle resize
    function handleResize() {
        const container = sceneElement;
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    window.addEventListener('resize', handleResize);
}

// Particles for About Page
function initAboutParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle-small');
        
        // Random size
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 15;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }

    // Add some geometric shapes
    const shapes = ['circle', 'triangle', 'square'];
    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.classList.add('geometric-shape', `shape-${shapes[i]}`);
        
        // Random position
        shape.style.left = `${Math.random() * 80 + 10}%`;
        shape.style.top = `${Math.random() * 80 + 10}%`;
        
        // Random animation delay
        shape.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(shape);
    }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
    
    // Add scroll animations for about page elements
    if (document.body.classList.contains('about-page')) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe value items and team members for fade-in effect
        document.querySelectorAll('.value-item, .team-member').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
});

// Floating animation for cards
const floatAnimation = `
@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(2deg); }
    50% { transform: translateY(-5px) rotate(-1deg); }
    75% { transform: translateY(-8px) rotate(1deg); }
}

.card-float {
    animation: float 6s ease-in-out infinite;
}
`;

// Add floating animation to style
if (!document.querySelector('#float-animation')) {
    const style = document.createElement('style');
    style.id = 'float-animation';
    style.textContent = floatAnimation;
    document.head.appendChild(style);
}
// ==========================================
// PORTFOLIO FUNCTIONALITY
// ==========================================

function initPortfolioPage() {
    // Check if we're on the portfolio page
    if (!document.body.classList.contains('portfolio-page')) return;
    
    initPortfolioFilters();
    initPortfolioParticles();
    initPortfolioAnimations();
}

// Portfolio Filtering
function initPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-button');
    const items = document.querySelectorAll('.portfolio-item');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active buttons
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items with animation
            items.forEach(item => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    // Show with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, 50);
                } else {
                    // Hide removing animation
                    item.classList.remove('animate-in');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Portfolio Particles System
function initPortfolioParticles() {
    const container = document.getElementById('portfolioParticles');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Particle configuration
    const config = {
        small: { count: 40, sizeRange: [2, 5] },
        medium: { count: 15, sizeRange: [25, 55] },
        large: { count: 6, sizeRange: [220, 450] }
    };

    // Create small particles
    for (let i = 0; i < config.small.count; i++) {
        createParticle('pp-small', config.small.sizeRange, 18, 6, container);
    }

    // Create medium particles
    for (let i = 0; i < config.medium.count; i++) {
        createParticle('pp-medium', config.medium.sizeRange, 22, 5, container);
    }

    // Create large orbs
    for (let i = 0; i < config.large.count; i++) {
        createParticle('pp-large', config.large.sizeRange, 28, 4, container);
    }

    // Create geometric shapes
    const geoShapes = [
        { class: 'circle', pos: { top: '20%', left: '12%' } },
        { class: 'triangle', pos: { top: '65%', left: '82%' } },
        { class: 'square', pos: { top: '45%', left: '8%' } },
        { class: 'hexagon', pos: { top: '30%', left: '88%' } }
    ];

    geoShapes.forEach((shape, index) => {
        const geo = document.createElement('div');
        geo.className = `pp-geo pp-geo-${shape.class}`;
        geo.style.top = shape.pos.top;
        geo.style.left = shape.pos.left;
        geo.style.animationDelay = `${index * 2.5}s`;
        container.appendChild(geo);
    });

    // Create connection lines
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div');
        line.className = 'pp-line';
        
        line.style.width = `${Math.random() * 220 + 120}px`;
        line.style.left = `${Math.random() * 75}%`;
        line.style.top = `${Math.random() * 85 + 8}%`;
        line.style.transform = `rotate(${Math.random() * 180}deg)`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(line);
    }
}

function createParticle(className, sizeRange, baseDuration, maxDelay, container) {
    const particle = document.createElement('div');
    particle.className = className;
    
    const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 8 + baseDuration}s`;
    particle.style.animationDelay = `${Math.random() * maxDelay}s`;
    
    container.appendChild(particle);
}

// Portfolio Animations
function initPortfolioAnimations() {
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

    // Observe portfolio items for animation
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        observer.observe(item);
    });
}

// Recreate particles on resize (with debounce)
let portfolioResizeTimer;
function handlePortfolioResize() {
    clearTimeout(portfolioResizeTimer);
    portfolioResizeTimer = setTimeout(initPortfolioParticles, 300);
}

// Initialize portfolio page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioPage();
    
    // Add resize listener for portfolio page
    if (document.body.classList.contains('portfolio-page')) {
        window.addEventListener('resize', handlePortfolioResize);
    }
});
