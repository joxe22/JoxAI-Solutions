// ================== SIMULACIÓN DE DATOS DE PROYECTOS ==================
const projectsData = {
    'proyecto1': {
        title: 'Diseño de Aplicación AI (FinTech)',
        description: 'Detalle extenso del Proyecto 1. Este proyecto se centró en la creación de una aplicación móvil con soluciones de IA para la predicción de mercados financieros. Implementamos un modelo de Machine Learning y una API robusta para la gestión de datos en tiempo real. Los resultados superaron las expectativas del cliente en un 30% en eficiencia.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0', // URL de embed de YouTube
        gallery: [
            'img/p1-screen1.jpg',
            'img/p1-screen2.jpg',
            'img/p1-screen3.jpg',
            'img/p1-screen4.jpg'
        ]
        
    },
    'proyecto2': {
        title: 'Plataforma B2B a Escala',
        description: 'Detalle extenso del Proyecto 2. Desarrollo de un E-commerce B2B de alto rendimiento con integración de sistemas de inventario (ERP). Se utilizó un stack de tecnología MERN, priorizando la escalabilidad y la experiencia de usuario. El lanzamiento generó un incremento del 45% en pedidos online.',
        videoUrl: 'https://www.youtube.com/embed/H377R629Qv4?autoplay=0',
        gallery: [
            'img/p2-screen1.jpg',
            'img/p2-screen2.jpg',
            'img/p2-screen3.jpg'
        ]
    }
    // Añade más proyectos aquí:
};

// ================== GESTIÓN DEL MODAL ==================

// Event listener para manejar el click en las cards (Delegación de eventos)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(event) {
        const projectId = this.getAttribute('data-project-id');
        openModal(projectId);
    });
});

document.querySelector('.close-btn').addEventListener('click', closeModal);

function openModal(projectId) {
    const project = projectsData[projectId];
    const modal = document.getElementById('project-modal');
    const detailsContainer = document.getElementById('modal-details');

    if (!project) return;

    // 1. Inyectar contenido en el modal
    detailsContainer.innerHTML = `
        <h2>${project.title}</h2>
        <p style="margin-bottom: 20px;">${project.description}</p>
        
        <div class="video-container">
            <iframe src="${project.videoUrl}" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
        </div>
        
        <h3>Galería de Pantallas</h3>
        <p style="color: #999;">Haz click en el botón para ver la galería completa de imágenes del proyecto.</p>
        <div class="modal-gallery-thumbs">
            ${project.gallery.map((imgSrc, index) => 
                `<img src="${imgSrc}" alt="Captura ${index + 1}" onclick="showFullGallery('${projectId}')">`
            ).join('')}
        </div>
        <a href="../project-tour/previews/bankbot.html" tyle="margin-top: 15px;" target="_self" class="btn-demo" class="fas fa-th-large">Preview</a>
        <button class="btn-demo" style="margin-top: 15px;" onclick="showFullGallery('${projectId}')">
            <i class="fas fa-th-large"></i> Ver Galería Completa
        </button>
    `;

    // 2. Mostrar el modal
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    
    // Detener la reproducción del video al cerrar
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        // Recarga el iframe para detener el video
        iframe.src = iframe.src; 
    }

    modal.style.display = 'none';
}

// Cierra el modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('project-modal');
    if (event.target == modal) {
        closeModal();
    }
}

// ================== FUNCIÓN GALERÍA COMPLETA ==================
function showFullGallery(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    // En un entorno real, aquí se inicializaría una librería de Lightbox/Gallery
    let galleryContent = project.gallery.map((imgSrc, index) => 
        `[${index + 1}] ${imgSrc}`
    ).join('\n');

    alert(`*** Ventana de Galería de ${project.title} ***\n\nImágenes Disponibles:\n${galleryContent}\n\n(Implementación final: Aquí se abriría un Lightbox con cuadrícula de las fotos para seleccionar y abrirlas individualmente.)`);
}