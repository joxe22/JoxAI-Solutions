// Variables de control
let formData = {
    experience: null,
    navigation: null,
    features: [],
    comments: ''
};

// Seleccionar emoji con animación
function selectEmoji(button) {
    // Remover selección previa
    document.querySelectorAll('.emoji-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Agregar selección actual con animación
    button.classList.add('selected');
    const rating = button.getAttribute('data-rating');
    formData.experience = rating;
    
    // Actualizar campo oculto para Netlify
    document.getElementById('experienceInput').value = rating;
    
    // Feedback visual
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// Seleccionar rating con animación
function selectRating(button, category) {
    // Remover selección previa del mismo grupo
    button.parentElement.querySelectorAll('.rating-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Agregar selección actual
    button.classList.add('selected');
    const value = button.textContent;
    formData[category] = value;
    
    // Actualizar campo oculto para Netlify
    document.getElementById('navigationInput').value = value;
}

// Toggle checkbox con animación
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        option.classList.add('selected');
        formData.features.push(checkbox.value);
    } else {
        option.classList.remove('selected');
        const index = formData.features.indexOf(checkbox.value);
        if (index > -1) {
            formData.features.splice(index, 1);
        }
    }
}

// Validar formulario
function validateForm() {
    if (!formData.experience) {
        showNotification('Por favor, califica tu experiencia general con un emoji', 'warning');
        return false;
    }
    return true;
}

// Mostrar notificación
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'warning' ? '#ff9800' : type === 'error' ? '#f44336' : '#4a90e2'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Enviar feedback a Netlify
function submitFeedback() {
    if (!validateForm()) return;
    
    formData.comments = document.getElementById('comments').value;
    console.log('Datos del formulario:', formData);
    
    const form = document.getElementById('surveyForm');
    const netlifyFormData = new FormData(form);
    
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData).toString()
    })
    .then(response => {
        if (response.ok) {
            const formSection = document.getElementById('formSection');
            const successSection = document.getElementById('successSection');
            
            formSection.style.transition = 'all 0.3s ease';
            formSection.style.opacity = '0';
            formSection.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                formSection.style.display = 'none';
                successSection.classList.add('show');
                successSection.style.opacity = '1';
                successSection.style.transform = 'translateY(0)';
            }, 300);
            
            setTimeout(() => {
                window.close();
            }, 3000);
        } else {
            throw new Error('Error en el envío');
        }
    })
    .catch(error => {
        console.error('Error al enviar:', error);
        showNotification('Hubo un error al enviar. Por favor intenta de nuevo.', 'error');
    });
}

// Crear partículas de fondo
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(74, 144, 226, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', createParticles);