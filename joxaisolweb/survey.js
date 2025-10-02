// ==========================================
// SURVEY WIDGET - JavaScript Mejorado
// Versión: 2.0
// ==========================================

// Variables de control global
let widgetShown = false;
let userIdleTimer;

// Configuración (personalizable)
const CONFIG = {
    idleTimeBeforeShow: 5000,        // 5 segundos (cambiar a 30000 para producción)
    initialDelay: 3000,               // 3 segundos después de cargar
    autoCloseSuccessDelay: 3000,      // 3 segundos después del éxito
    notificationDuration: 3000        // 3 segundos de notificación
};

// ==========================================
// CONTROL DEL WIDGET FLOTANTE
// ==========================================

function showSurveyWidget() {
    if (!widgetShown) {
        const widget = document.getElementById('survey-widget');
        if (widget) {
            widget.classList.remove('hidden');
            widget.classList.add('show');
            widgetShown = true;
            console.log('✅ Survey widget mostrado');
        }
    }
}

function closeSurveyWidget() {
    const widget = document.getElementById('survey-widget');
    if (widget) {
        widget.classList.remove('show');
        widget.classList.add('hidden');
    }
    widgetShown = false;
    clearTimeout(userIdleTimer);
    console.log('❌ Survey widget cerrado');
}

function openSurveyModal() {
    const modal = document.getElementById('surveyModal');
    if (modal) {
        modal.style.display = 'flex';
        // Pequeño delay para activar la animación
        setTimeout(() => {
            const container = modal.querySelector('.modal-container');
            if (container) {
                container.classList.add('animate-in');
            }
        }, 10);
        // Cerrar el widget cuando se abre el modal
        closeSurveyWidget();
        console.log('📝 Modal de survey abierto');
    }
}

function closeSurveyModal() {
    const modal = document.getElementById('surveyModal');
    const container = modal?.querySelector('.modal-container');
    
    if (container) {
        container.classList.remove('animate-in');
        container.classList.add('animate-out');
    }
    
    setTimeout(() => {
        if (modal) {
            modal.style.display = 'none';
            resetForm();
        }
        if (container) {
            container.classList.remove('animate-out');
        }
    }, 300);
    
    console.log('❌ Modal de survey cerrado');
}

function resetForm() {
    const form = document.getElementById('surveyForm');
    if (form) form.reset();
    
    // Reset de los estados visuales
    document.querySelectorAll('.emoji-button.selected').forEach(btn => 
        btn.classList.remove('selected')
    );
    document.querySelectorAll('.rating-button.selected').forEach(btn => 
        btn.classList.remove('selected')
    );
    document.querySelectorAll('.checkbox-option.selected').forEach(opt => 
        opt.classList.remove('selected')
    );
    
    // Mostrar formulario y ocultar mensaje de éxito
    const formSection = document.getElementById('formSection');
    const successSection = document.getElementById('successSection');
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.style.opacity = '1';
        formSection.style.transform = 'translateY(0)';
    }
    if (successSection) {
        successSection.style.display = 'none';
    }
    
    console.log('🔄 Formulario reseteado');
}

// ==========================================
// GESTIÓN DE IDLE TIME
// ==========================================

function resetIdleTimer() {
    if (!widgetShown) {
        clearTimeout(userIdleTimer);
        
        userIdleTimer = setTimeout(() => {
            showSurveyWidget();
        }, CONFIG.idleTimeBeforeShow);
    }
}

// Eventos para detectar interacción
function initializeIdleDetection() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });
    
    console.log('👂 Detección de inactividad inicializada');
}

// ==========================================
// FUNCIONES DEL FORMULARIO
// ==========================================

function selectEmoji(button, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Remover selección previa
    document.querySelectorAll('.emoji-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Agregar selección actual
    button.classList.add('selected');
    const rating = button.getAttribute('data-rating');
    document.getElementById('experienceInput').value = rating;
    
    // Feedback visual
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
    
    console.log(`⭐ Emoji seleccionado: ${rating}/5`);
}

function selectRating(button, category, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Remover selección previa del mismo grupo
    button.parentElement.querySelectorAll('.rating-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Agregar selección actual
    button.classList.add('selected');
    const value = button.textContent;
    
    if (category === 'navigation') {
        document.getElementById('navigationInput').value = value;
    }
    
    console.log(`📊 Rating ${category}: ${value}`);
}

function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        option.classList.add('selected');
    } else {
        option.classList.remove('selected');
    }
    
    console.log(`☑️ Checkbox "${checkbox.value}": ${checkbox.checked}`);
}

// ==========================================
// VALIDACIÓN Y ENVÍO
// ==========================================

function validateForm() {
    const experienceValue = document.getElementById('experienceInput').value;
    
    if (!experienceValue) {
        showNotification(
            'Por favor, califica tu experiencia general con un emoji', 
            'warning'
        );
        return false;
    }
    
    console.log('✅ Formulario validado correctamente');
    return true;
}

function submitFeedback(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (!validateForm()) {
        console.log('❌ Validación fallida');
        return;
    }
    
    console.log('📤 Enviando feedback...');
    
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    
    // Convertir FormData a URLSearchParams para Netlify
    const encoded = new URLSearchParams(formData).toString();
    
    // Mostrar feedback visual inmediato
    const submitBtn = event?.target;
    if (submitBtn) {
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
    }
    
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ Feedback enviado exitosamente');
            showSuccessMessage();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('❌ Error al enviar:', error);
        showNotification(
            'Hubo un error al enviar. Por favor intenta de nuevo.', 
            'error'
        );
        
        // Restaurar botón
        if (submitBtn) {
            submitBtn.textContent = 'Enviar Evaluación';
            submitBtn.disabled = false;
        }
    });
}

function showSuccessMessage() {
    const formSection = document.getElementById('formSection');
    const successSection = document.getElementById('successSection');
    
    if (!formSection || !successSection) return;
    
    // Animación de salida del formulario
    formSection.style.transition = 'all 0.3s ease';
    formSection.style.opacity = '0';
    formSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        formSection.style.display = 'none';
        successSection.style.display = 'block';
        
        // Forzar reflow para la animación
        void successSection.offsetWidth;
        
        successSection.style.opacity = '1';
        successSection.style.transform = 'translateY(0)';
    }, 300);
    
    // Auto-cerrar después del delay configurado
    setTimeout(() => {
        closeSurveyModal();
    }, CONFIG.autoCloseSuccessDelay);
    
    console.log('🎉 Mensaje de éxito mostrado');
}

// ==========================================
// NOTIFICACIONES
// ==========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        info: '#4a90e2',
        warning: '#ff9800',
        error: '#f44336',
        success: '#4caf50'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, CONFIG.notificationDuration);
    
    console.log(`📢 Notificación (${type}): ${message}`);
}

// ==========================================
// ANIMACIONES CSS DINÁMICAS
// ==========================================

function injectAnimationStyles() {
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
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

function initializeSurveyWidget() {
    console.log('🚀 Inicializando Survey Widget...');
    
    // Inyectar estilos de animación
    injectAnimationStyles();
    
    // Inicializar detección de inactividad
    initializeIdleDetection();
    
    // Iniciar el timer después del delay inicial
    setTimeout(() => {
        resetIdleTimer();
        console.log('⏰ Timer de inactividad iniciado');
    }, CONFIG.initialDelay);
    
    console.log('✅ Survey Widget inicializado correctamente');
}

// ==========================================
// AUTO-INICIALIZACIÓN
// ==========================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSurveyWidget);
} else {
    initializeSurveyWidget();
}

// Exponer funciones globales para uso en HTML
window.showSurveyWidget = showSurveyWidget;
window.closeSurveyWidget = closeSurveyWidget;
window.openSurveyModal = openSurveyModal;
window.closeSurveyModal = closeSurveyModal;
window.selectEmoji = selectEmoji;
window.selectRating = selectRating;
window.toggleCheckbox = toggleCheckbox;
window.submitFeedback = submitFeedback;