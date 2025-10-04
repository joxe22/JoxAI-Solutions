// ========== WIDGET DE COTIZACIONES ==========

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const floatIcon = document.getElementById('quote-float-icon');
    const widget = document.getElementById('quote-widget');
    const closeBtn = document.getElementById('close-quote-btn');
    const form = document.getElementById('quote-form');
    const successMessage = document.getElementById('quote-success');

    // Campos condicionales
    const projectSelect = document.getElementById('project-select');
    const projectOptions = document.getElementById('project-options');
    const changesRadios = document.querySelectorAll('input[name="modificar_demo"]');
    const changesInput = document.getElementById('changes-input');

    const contactPreference = document.getElementById('contact-preference');
    const phoneSection = document.getElementById('phone-section');
    const phoneNumber = document.getElementById('phone-number');

    const quoteType = document.getElementById('quote-type');
    const generalDescription = document.getElementById('general-description');
    const customOptions = document.getElementById('custom-options');
    const normalService = document.getElementById('normal-service');

    const serviceType = document.getElementById('service-type');
    const serviceDetails = document.getElementById('service-details');

    // Abrir widget
    floatIcon.addEventListener('click', function() {
        widget.classList.add('active');
        floatIcon.style.display = 'none';
    });

    // Cerrar widget
    closeBtn.addEventListener('click', function() {
        widget.classList.remove('active');
        floatIcon.style.display = 'flex';
        resetForm();
    });

    // Lógica condicional: Proyecto disponible
    projectSelect.addEventListener('change', function() {
        if (this.value !== '') {
            projectOptions.classList.remove('hidden');
        } else {
            projectOptions.classList.add('hidden');
            changesInput.classList.add('hidden');
        }
    });

    // Lógica condicional: Modificar demo
    changesRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'con_cambios') {
                changesInput.classList.remove('hidden');
            } else {
                changesInput.classList.add('hidden');
            }
        });
    });

    // Lógica condicional: Preferencia de contacto
    contactPreference.addEventListener('change', function() {
        if (this.value === 'whatsapp' || this.value === 'sms') {
            phoneSection.classList.remove('hidden');
            phoneNumber.setAttribute('required', 'required');
        } else {
            phoneSection.classList.add('hidden');
            phoneNumber.removeAttribute('required');
            phoneNumber.value = '';
        }
    });

    // Lógica condicional: Tipo de cotización
    quoteType.addEventListener('change', function() {
        // Ocultar todas las secciones
        generalDescription.classList.add('hidden');
        customOptions.classList.add('hidden');
        normalService.classList.add('hidden');
        serviceDetails.classList.add('hidden');

        // Mostrar la sección correspondiente
        if (this.value === 'general') {
            generalDescription.classList.remove('hidden');
        } else if (this.value === 'customizada') {
            customOptions.classList.remove('hidden');
        } else if (this.value === 'normal') {
            normalService.classList.remove('hidden');
        }
    });

    // Lógica condicional: Servicio específico
    serviceType.addEventListener('change', function() {
        if (this.value !== '') {
            serviceDetails.classList.remove('hidden');
        } else {
            serviceDetails.classList.add('hidden');
        }
    });

    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar checkboxes customizados (si aplica)
        if (quoteType.value === 'customizada') {
            const checkedBoxes = document.querySelectorAll('input[name="servicios_custom[]"]:checked');
            if (checkedBoxes.length === 0) {
                alert('Por favor, selecciona al menos un servicio customizado.');
                return;
            }
        }

        // Validar servicio normal (si aplica)
        if (quoteType.value === 'normal' && !serviceType.value) {
            alert('Por favor, selecciona un tipo de servicio.');
            return;
        }

        // Crear FormData para Netlify
        const formData = new FormData(form);

        // Enviar a Netlify
        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            // Ocultar formulario y mostrar mensaje de éxito
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // Cerrar automáticamente después de 3 segundos
            setTimeout(() => {
                widget.classList.remove('active');
                floatIcon.style.display = 'flex';
                resetForm();
            }, 3000);
        })
        .catch((error) => {
            alert('Hubo un error al enviar la cotización. Por favor, intenta de nuevo.');
            console.error('Error:', error);
        });
    });

    // Función para resetear el formulario
    function resetForm() {
        form.reset();
        form.classList.remove('hidden');
        successMessage.classList.add('hidden');
        
        // Ocultar todas las secciones condicionales
        projectOptions.classList.add('hidden');
        changesInput.classList.add('hidden');
        phoneSection.classList.add('hidden');
        generalDescription.classList.add('hidden');
        customOptions.classList.add('hidden');
        normalService.classList.add('hidden');
        serviceDetails.classList.add('hidden');
    }
});
