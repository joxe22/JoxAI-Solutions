// Este script maneja la interfaz, el flujo de conversación y la inserción del widget de agendamiento. 
// Añade este código a tu archivo JavaScript, asegurándote de llamarlo después de que el DOM esté cargado.

//INICIALIZACION Y FUNCIONES DE UTILIDAD

// --- Elementos del DOM ---
const chatContainer = document.getElementById('chatbot-container');
const chatBody = document.getElementById('chatbot-body');
const chatToggleButton = document.getElementById('chatbot-toggle-button');
const closeChatButton = document.getElementById('close-chatbot-btn');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let conversationState = 'initial'; // Estado para controlar el flujo

// --- Funciones de Utilidad ---

// 1. Alternar Visibilidad del Chat
chatToggleButton.addEventListener('click', () => {
    chatContainer.classList.toggle('hidden');
    // Si se abre, reinicia el chat
    if (!chatContainer.classList.contains('hidden')) {
        resetChat();
    }
});
closeChatButton.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
});


// 2. Mostrar Mensaje en el Chat
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
    
    // Crear un párrafo para el texto (mejora visual)
    const textNode = document.createElement('p');
    textNode.innerHTML = text; // Usar innerHTML para aceptar negritas o saltos de línea
    messageDiv.appendChild(textNode);
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll al final
}

// 3. Mostrar Opciones del Botón
function displayOptions(options) {
    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option.text;
        button.onclick = () => handleOptionSelection(option.value, option.text);
        chatBody.appendChild(button);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
}

// 4. Reiniciar el Chat
function resetChat() {
    chatBody.innerHTML = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    conversationState = 'initial';
    setTimeout(() => {
        startChat();
    }, 500);
}

// FLUJO DE CONVERSACION Y LOGICA PRINCIPAL

// 5. Iniciar la Conversación
function startChat() {
    displayMessage("¡Hola! Soy el Asistente de JoxAI Solutions. ¿En qué puedo ayudarte hoy?", 'bot');
    
    const options = [
        { text: "Quiero una Consulta Gratuita", value: "cita" },
        { text: "Ver Tour de Proyectos", value: "tour" }
    ];
    displayOptions(options);
}

// 6. Manejar la Selección de Opciones
function handleOptionSelection(value, text) {
    displayMessage(text, 'user');
    
    // Limpiar opciones anteriores
    const buttons = chatBody.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.remove());

    if (value === 'cita') {
        handleCitaFlow();
    } else if (value === 'tour') {
        handleTourFlow();
    } else if (value === 'volver') {
        resetChat();
    }
}


// 7. Flujo de Cita/Agendamiento
function handleCitaFlow() {
    displayMessage("¡Excelente! Para agendar una reunión por Google Meet o Zoom, utilizaremos nuestra herramienta de calendario. Elige el mejor momento en el widget de abajo.", 'bot');
    
    // --------------------------------------------------------
    // *** CAMBIO CLAVE: Insertar Widget de Calendly ***
    // --------------------------------------------------------
    // 1. CÓDIGO HTML DE CALENDLY:
    //    Debes obtener este código de tu cuenta de Calendly (o la herramienta que uses).
    //    Asegúrate de cambiar 'TUCALENDLY' por tu nombre de usuario real de Calendly.
    const calendlyWidget = `
        <div class="message bot-message" style="max-width: 100%; border-left: none; background: transparent;">
            <div class="calendly-inline-widget" 
                 data-url="https://calendly.com/TUCALENDLY/30min" 
                 style="min-width:320px;height:450px;">
            </div>
        </div>
    `;
    
    // 2. Insertar el script de Calendly (si aún no está en el body)
    if (!document.querySelector('script[src*="calendly.com"]')) {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        document.body.appendChild(script);
    }

    // 3. Añadir el HTML del widget al chat
    chatBody.innerHTML += calendlyWidget;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // --------------------------------------------------------
    
    // Ofrecer opción para volver después
    setTimeout(() => {
        displayOptions([{ text: "Volver al Menú Principal", value: "volver" }]);
    }, 1000);
}


// 8. Flujo de Tour de Proyectos
function handleTourFlow() {
    displayMessage("¡Claro! El tour te llevará a una página especial donde podrás explorar nuestros proyectos más recientes y casos de éxito.", 'bot');
    
    const tourLink = "TU_URL_DEL_TOUR_DE_PROYECTOS"; // <-- REEMPLAZA ESTO
    
    const linkHTML = `<a href="${tourLink}" target="_blank" class="option-button" style="text-align: center; background-color: #28a745;">
                          Iniciar Tour de Proyectos
                      </a>`;
    
    chatBody.innerHTML += `<div class="message bot-message" style="max-width: 100%; border-left: none; background: transparent;">${linkHTML}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    displayMessage("¡Feliz exploración! Si tienes preguntas, agenda una consulta. 😉", 'bot');
    
    setTimeout(() => {
        displayOptions([{ text: "Volver al Menú Principal", value: "volver" }]);
    }, 1000);
}


// --- Llama a la función de inicio al cargar el DOM ---
document.addEventListener('DOMContentLoaded', () => {
    startChat();
});