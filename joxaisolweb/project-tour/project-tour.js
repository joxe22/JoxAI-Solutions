/// ================== CONFIGURACIÓN DE PROYECTOS ==================
/**
 * Base de datos de proyectos
 * Cada proyecto debe tener:
 * - title: Título del proyecto
 * - description: Descripción detallada
 * - videoUrl: URL de EMBED de YouTube (formato: https://www.youtube.com/embed/VIDEO_ID)
 * - gallery: Array de rutas de imágenes
 * - demoUrl: (Opcional) URL del proyecto demo funcional
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
        demoUrl: './previews/bankbot.html' // URL del proyecto demo
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
        demoUrl: null // No tiene demo disponible
    },
    'proyecto3': {
        title: 'DocClassifier',
        description: 'Sistema de clasificación de documentos potenciado por IA con aprendizaje activo humano en el ciclo. Características principales: Soporte multi-formato (PDF, DOCX, TXT, PNG, JPG con OCR), Clasificación automática usando TF-IDF + LightGBM (actualizable a Transformers), Extracción de campos con Regex (fechas, montos, IDs, entidades), Aprendizaje activo con muestreo de incertidumbre, Explicabilidad con importancia de tokens y valores SHAP, API REST con FastAPI y documentación OpenAPI, UI moderna con React + Vite y analíticas en tiempo real, Listo para producción con Docker, monitoreo y procesamiento por lotes.',
        videoUrl: 'https://www.youtube.com/embed/XZCiOvggLOY',
        gallery: [
            './thumbs_img/doclass1.png',
            './thumbs_img/doclass2.png',
            './thumbs_img/doclass3.png',
            './thumbs_img/doclass4.png'
        ],
        demoUrl: 'https://docclassifier.netlify.app/' // No tiene demo disponible
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
    
    // Manejar clicks en botones de demo
    document.addEventListener('click', function(event) {
        const demoBtn = event.target.closest('.btn-demo-project');
        if (demoBtn) {
            event.preventDefault();
            const demoUrl = demoBtn.getAttribute('data-demo-url');
            confirmarAperturDemo().then(accepted => {
                if (accepted) {
                    window.open(demoUrl, '_blank');
                }
            });
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
    
    // Generar el botón de demo si existe
    const demoButton = project.demoUrl 
        ? `<a href="${project.demoUrl}" 
              target="_blank" 
              class="btn-demo btn-demo-project" 
              data-demo-url="${project.demoUrl}">
              <i class="fas fa-rocket"></i> Ver Proyecto Demo
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
        
        <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
            ${demoButton}
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

/**
 * Muestra un disclaimer antes de abrir el proyecto demo
 * @returns {Promise<boolean>} True si el usuario acepta continuar
 */
function confirmarAperturDemo() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const disclaimerBox = document.createElement('div');
    disclaimerBox.style.cssText = `
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        border-radius: 15px;
        padding: 40px;
        max-width: 550px;
        width: 90%;
        box-shadow: 0 0 50px rgba(89, 182, 239, 0.4);
        border: 2px solid rgba(89, 182, 239, 0.3);
        text-align: center;
        animation: slideInUp 0.3s ease;
    `;
    
    disclaimerBox.innerHTML = `
        <div style="margin-bottom: 25px;">
            <i class="fas fa-info-circle" style="font-size: 60px; color: #59b6ef;"></i>
        </div>
        <h3 style="color: #59b6ef; margin: 0 0 20px 0; font-size: 1.8em;">
            Aviso Importante
        </h3>
        <p style="color: #E0E0E0; line-height: 1.8; margin: 0 0 30px 0; font-size: 1.05em;">
            Esta es una <strong style="color: #9ac8ee;">versión demo</strong> del proyecto. 
            Puede contener funcionalidades limitadas o deshabilitadas con fines demostrativos. 
            El proyecto final incluye todas las características y optimizaciones acordadas con el cliente.
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button id="demo-accept" style="
                background: linear-gradient(135deg, #59b6ef, #9ac8ee);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 1.05em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(89, 182, 239, 0.4);
            ">
                <i class="fas fa-check"></i> Entendido, Continuar
            </button>
            <button id="demo-cancel" style="
                background: transparent;
                color: #E0E0E0;
                border: 2px solid rgba(224, 224, 224, 0.3);
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 1.05em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            ">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    overlay.appendChild(disclaimerBox);
    document.body.appendChild(overlay);
    
    // Agregar efectos hover
    const acceptBtn = disclaimerBox.querySelector('#demo-accept');
    const cancelBtn = disclaimerBox.querySelector('#demo-cancel');
    
    acceptBtn.onmouseover = () => {
        acceptBtn.style.transform = 'translateY(-2px)';
        acceptBtn.style.boxShadow = '0 6px 20px rgba(89, 182, 239, 0.6)';
    };
    acceptBtn.onmouseout = () => {
        acceptBtn.style.transform = 'translateY(0)';
        acceptBtn.style.boxShadow = '0 4px 15px rgba(89, 182, 239, 0.4)';
    };
    
    cancelBtn.onmouseover = () => {
        cancelBtn.style.background = 'rgba(224, 224, 224, 0.1)';
        cancelBtn.style.borderColor = 'rgba(224, 224, 224, 0.5)';
    };
    cancelBtn.onmouseout = () => {
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.borderColor = 'rgba(224, 224, 224, 0.3)';
    };
    
    // Retornar una promesa para manejar la acción del usuario
    return new Promise((resolve) => {
        acceptBtn.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(true);
            }, 200);
        };
        
        cancelBtn.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(false);
            }, 200);
        };
    });
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
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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