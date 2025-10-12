/// ================== CONFIGURACIÓN DE PROYECTOS ==================
/**
 * Base de datos de proyectos
 * Cada proyecto debe tener:
 * - title: Título del proyecto
 * - description: Descripción detallada
 * - videoUrl: URL de EMBED de YouTube (formato: https://www.youtube.com/embed/VIDEO_ID)
 * - gallery: Array de rutas de imágenes
 * - previewUrl: (Opcional) URL de la página de preview
 */
const projectsData = {
    'proyecto1': {
        title: 'Z-BankBot + IA',
        description: 'Transformación digital para una startup FinTech usando Machine Learning y Web Dev. Este proyecto se centró en la creación de una aplicación móvil con soluciones de IA para la predicción de mercados financieros. Implementamos un modelo de Machine Learning y una API robusta para la gestión de datos en tiempo real. Los resultados superaron las expectativas del cliente en un 30% en eficiencia.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        gallery: [
            './projects-img/zorg-1.jpg',
            './projects-img/zorg-2.jpg',
            './projects-img/zorg-3.jpg',
            './projects-img/zorg-4.jpg'
        ],
        previewUrl: './previews/bankbot.html'
    },
    'proyecto2': {
        title: 'Plataforma B2B a Escala',
        description: 'Desarrollo de un E-commerce B2B de alto rendimiento con integración de sistemas de inventario (ERP). Se utilizó un stack de tecnología MERN, priorizando la escalabilidad y la experiencia de usuario. El lanzamiento generó un incremento del 45% en pedidos online. Sistema completo con gestión de inventario, procesamiento de pagos y analíticas en tiempo real.',
        videoUrl: 'https://www.youtube.com/embed/H377R629Qv4',
        gallery: [
            './projects-img/b2b-1.jpg',
            './projects-img/b2b-2.jpg',
            './projects-img/b2b-3.jpg'
        ],
        previewUrl: null // No tiene preview disponible
    },
    'proyecto3': {
        title: 'DocClassifier',
        description: 'Sistema de clasificación de documentos potenciado por IA con aprendizaje activo humano en el ciclo. Características principales: Soporte multi-formato (PDF, DOCX, TXT, PNG, JPG con OCR), Clasificación automática usando TF-IDF + LightGBM (actualizable a Transformers), Extracción de campos con Regex (fechas, montos, IDs, entidades), Aprendizaje activo con muestreo de incertidumbre, Explicabilidad con importancia de tokens y valores SHAP, API REST con FastAPI y documentación OpenAPI, UI moderna con React + Vite y analíticas en tiempo real, Listo para producción con Docker, monitoreo y procesamiento por lotes.',
        // Convertir URL de YouTube normal a URL de embed
        videoUrl: 'https://www.youtube.com/embed/XZCiOvggLOY',
        gallery: [
            './thumbs_img/DocClass1.png',
            './thumbs_img/DocClass2.png',
            './thumbs_img/DocClass3.png',
            './thumbs_img/DocClass4.png'
        ],
        previewUrl: null
    }
};

// ================== MANEJO DE EVENTOS Y MODAL ==================

/**
 * Inicializa los event listeners cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventosCards();
    inicializarEventosModal();
});

/**
 * Agrega event listeners a todas las cards de proyectos
 */
function inicializarEventosCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Prevenir que el click se propague si se hace en el botón
            if (event.target.closest('.btn-see-more')) {
                event.stopPropagation();
            }
            
            const projectId = this.getAttribute('data-project-id');
            
            // Validar que el proyecto existe
            if (projectsData[projectId]) {
                abrirModal(projectId);
            } else {
                console.error(`Proyecto no encontrado: ${projectId}`);
                mostrarError('Proyecto no disponible');
            }
        });
    });
}

/**
 * Inicializa los event listeners del modal
 */
function inicializarEventosModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Cerrar con el botón X
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar al hacer click fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });
}

/**
 * Abre el modal y carga el contenido del proyecto
 * @param {string} projectId - ID del proyecto a mostrar
 */
function abrirModal(projectId) {
    const project = projectsData[projectId];
    const modal = document.getElementById('project-modal');
    const detailsContainer = document.getElementById('modal-details');

    if (!project || !modal || !detailsContainer) {
        console.error('Error: elementos del modal no encontrados');
        return;
    }

    // Construir el contenido del modal
    const contenidoHTML = generarContenidoModal(project, projectId);
    
    // Inyectar el contenido
    detailsContainer.innerHTML = contenidoHTML;
    
    // Mostrar el modal con animación
    modal.style.display = 'block';
    
    // Agregar clase para animación (opcional)
    setTimeout(() => {
        modal.classList.add('modal-visible');
    }, 10);
}

/**
 * Genera el HTML del contenido del modal
 * @param {Object} project - Datos del proyecto
 * @param {string} projectId - ID del proyecto
 * @returns {string} HTML del contenido
 */
function generarContenidoModal(project, projectId) {
    // Generar el HTML de la galería
    const galeriaHTML = project.gallery.map((imgSrc, index) => {
        return `
            <img src="${imgSrc}" 
                 alt="${project.title} - Captura ${index + 1}" 
                 onclick="mostrarImagenCompleta('${imgSrc}', '${project.title}')"
                 onerror="this.src='./img/placeholder.jpg'; this.onerror=null;">
        `;
    }).join('');
    
    // Generar el botón de preview si existe
    const previewButton = project.previewUrl 
        ? `<a href="${project.previewUrl}" 
              target="_blank" 
              class="btn-demo" 
              style="margin-top: 15px; display: inline-block; text-decoration: none;">
              <i class="fas fa-external-link-alt"></i> Ver Preview
           </a>`
        : '';
    
    // Construir el HTML completo
    return `
        <h2>${project.title}</h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">${project.description}</p>
        
        <h3>Video Demostrativo</h3>
        <div class="video-container">
            <iframe 
                src="${project.videoUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                loading="lazy">
            </iframe>
        </div>
        
        <h3 style="margin-top: 30px;">Galería de Capturas</h3>
        <p style="color: #999; margin-bottom: 15px;">
            Haz clic en cualquier imagen para verla en tamaño completo.
        </p>
        <div class="modal-gallery-thumbs">
            ${galeriaHTML}
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
            ${previewButton}
            <button class="btn-demo" onclick="mostrarGaleriaCompleta('${projectId}')">
                <i class="fas fa-th-large"></i> Ver Galería Completa
            </button>
        </div>
    `;
}

/**
 * Cierra el modal y detiene el video
 */
function cerrarModal() {
    const modal = document.getElementById('project-modal');
    
    if (!modal) return;
    
    // Detener todos los iframes (videos)
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        // Recargar el src para detener la reproducción
        const src = iframe.src;
        iframe.src = '';
        iframe.src = src;
    });
    
    // Ocultar el modal
    modal.classList.remove('modal-visible');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Muestra una imagen individual en tamaño completo
 * @param {string} imgSrc - Ruta de la imagen
 * @param {string} projectTitle - Título del proyecto
 */
function mostrarImagenCompleta(imgSrc, projectTitle) {
    // Crear un overlay para mostrar la imagen
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
        animation: fadeIn 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = projectTitle;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 50px rgba(89, 182, 239, 0.5);
    `;
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    // Cerrar al hacer click
    overlay.addEventListener('click', function() {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });
    
    // Cerrar con ESC
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            overlay.click();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

/**
 * Muestra todas las imágenes de la galería en una cuadrícula
 * @param {string} projectId - ID del proyecto
 */
function mostrarGaleriaCompleta(projectId) {
    const project = projectsData[projectId];
    
    if (!project) return;
    
    // Crear overlay para la galería
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        overflow-y: auto;
        padding: 40px 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
    `;
    
    // Título
    const title = document.createElement('h2');
    title.textContent = `Galería: ${project.title}`;
    title.style.cssText = `
        color: #59b6ef;
        text-align: center;
        margin-bottom: 30px;
        font-size: 2em;
    `;
    
    // Botón cerrar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 30px;
        background: transparent;
        border: none;
        color: white;
        font-size: 50px;
        cursor: pointer;
        z-index: 10001;
        transition: transform 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.transform = 'rotate(90deg)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'rotate(0deg)';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    // Grid de imágenes
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    `;
    
    project.gallery.forEach((imgSrc, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = `
            position: relative;
            cursor: pointer;
            overflow: hidden;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease;
        `;
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${project.title} - Imagen ${index + 1}`;
        img.style.cssText = `
            width: 100%;
            height: 250px;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
        `;
        
        imgWrapper.onmouseover = () => {
            imgWrapper.style.transform = 'translateY(-5px)';
            img.style.transform = 'scale(1.1)';
        };
        imgWrapper.onmouseout = () => {
            imgWrapper.style.transform = 'translateY(0)';
            img.style.transform = 'scale(1)';
        };
        
        imgWrapper.onclick = () => mostrarImagenCompleta(imgSrc, project.title);
        
        imgWrapper.appendChild(img);
        grid.appendChild(imgWrapper);
    });
    
    container.appendChild(title);
    container.appendChild(grid);
    overlay.appendChild(closeBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    alert(`Error: ${mensaje}`);
}

// ================== ANIMACIÓN DE FADE IN PARA EL MODAL ==================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .modal-visible {
        animation: fadeIn 0.3s ease;
    }
    
    .modal-gallery-thumbs img {
        cursor: pointer;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .modal-gallery-thumbs img:hover {
        transform: scale(1.05);
        opacity: 1 !important;
        box-shadow: 0 0 20px rgba(89, 182, 239, 0.6);
    }
`;
document.head.appendChild(style);