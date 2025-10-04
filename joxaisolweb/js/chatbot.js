// ==========================================
// CHATBOT.JS - Funcionalidad del asistente
// ==========================================

// Elementos del DOM
const chatContainer = document.getElementById('chatbot-container');
const chatBody = document.getElementById('chatbot-body');
const chatToggleButton = document.getElementById('chatbot-toggle-button');
const closeChatButton = document.getElementById('close-chatbot-btn');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let conversationState = 'initial';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

function initChatbot() {
    // Event listeners
    chatToggleButton.addEventListener('click', toggleChat);
    closeChatButton.addEventListener('click', closeChat);
    
    // Input handling
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            handleUserInput();
        }
    });
    
    sendBtn.addEventListener('click', handleUserInput);
    
    // Iniciar conversación
    setTimeout(() => {
        startChat();
    }, 1000);
}

function toggleChat() {
    chatContainer.classList.toggle('hidden');
    if (!chatContainer.classList.contains('hidden')) {
        resetChat();
        userInput.focus();
    }
}

function closeChat() {
    chatContainer.classList.add('hidden');
}

function resetChat() {
    chatBody.innerHTML = '';
    userInput.disabled = false;
    sendBtn.disabled = false;
    conversationState = 'initial';
}

// Mostrar mensaje en el chat
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
    
    const textNode = document.createElement('p');
    textNode.innerHTML = text;
    messageDiv.appendChild(textNode);
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Mostrar opciones de botón
function displayOptions(options) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option.text;
        button.onclick = () => handleOptionSelection(option.value, option.text);
        optionsContainer.appendChild(button);
    });
    
    chatBody.appendChild(optionsContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Iniciar conversación
function startChat() {
    displayMessage("¡Hola! Soy el Asistente de JoxAI Solutions. ¿En qué puedo ayudarte hoy?", 'bot');
    
    const options = [
        { text: "Quiero una Consulta Gratuita", value: "cita" },
        { text: "Ver Tour de Proyectos", value: "tour" }
    ];
    displayOptions(options);
}

// Manejar selección de opciones
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

// Flujo de cita/agendamiento
function handleCitaFlow() {
    displayMessage("¡Excelente! Para agendar una reunión por Google Meet o Zoom, utilizaremos nuestra herramienta de calendario. Elige el mejor momento en el widget de abajo.", 'bot');
    
    // Insertar Widget de Calendly
    const calendlyWidget = `
        <div class="message bot-message" style="max-width: 100%; border-left: none; background: transparent; padding: 0;">
            <div class="calendly-inline-widget" 
                 data-url="https://calendly.com/joxai-solutions/30min" 
                 style="min-width:320px;height:450px; border-radius: var(--border-radius); overflow: hidden;">
            </div>
        </div>
    `;
    
    // Insertar el script de Calendly si no existe
    if (!document.querySelector('script[src*="calendly.com"]')) {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
    }

    // Añadir el HTML del widget al chat
    chatBody.innerHTML += calendlyWidget;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Ofrecer opción para volver después
    setTimeout(() => {
        displayOptions([{ text: "Volver al Menú Principal", value: "volver" }]);
    }, 2000);
}

// Flujo de tour de proyectos
function handleTourFlow() {
    displayMessage("¡Claro! El tour te llevará a una página especial donde podrás explorar nuestros proyectos más recientes y casos de éxito.", 'bot');
    
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part);
    const lastPart = pathParts[pathParts.length - 1] || '';
    const depth = pathParts.length - (lastPart.includes('.html') ? 1 : 0);
    
    let tourLink;
    if (depth === 0) {
        tourLink = './project-tour/project-tour.html';
    } else {
        const upLevels = '../'.repeat(depth);
        tourLink = upLevels + 'project-tour/project-tour.html';
    }
    
    const linkHTML = `
        <div class="message bot-message" style="max-width: 100%; border-left: none; background: transparent;">
            <a href="${tourLink}" target="_blank" class="option-button" style="text-align: center; display: block; text-decoration: none;">
                <i class="fas fa-rocket"></i> Iniciar Tour de Proyectos
            </a>
        </div>
    `;
    
    chatBody.innerHTML += linkHTML;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    displayMessage("¡Feliz exploración! Si tienes preguntas, agenda una consulta. 😉", 'bot');
    
    setTimeout(() => {
        displayOptions([{ text: "Volver al Menú Principal", value: "volver" }]);
    }, 1000);
}

// Manejar input del usuario
function handleUserInput() {
    const userText = userInput.value.trim();
    if (userText === '') return;
    
    displayMessage(userText, 'user');
    userInput.value = '';
    
    // Respuesta automática simple
    setTimeout(() => {
        displayMessage("Gracias por tu mensaje. Para una atención más personalizada, te recomiendo usar las opciones del menú o agendar una consulta.", 'bot');
        displayOptions([{ text: "Agendar Consulta", value: "cita" }, { text: "Ver Proyectos", value: "tour" }]);
    }, 1000);
}