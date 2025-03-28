// Personal Information Database
const CREATOR_INFO = {
    name: "Muhammad Younas",
    birth_date: "28-02-2005",
    birth_place: "Kabirwala",
    current_city: "Bahawalpur",
    education: "BS Software Engineering (IUB)",
    profession: "Student, Aspiring Software Engineer, Python Developer, Web Developer & Freelancer",
    email: "your_email@example.com"
};

const SOCIAL_MEDIA = {
    facebook: "https://www.facebook.com/share/1XQiHE8mCY/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/myounas6760?igsh=YnNpOGlza2F4MWZ4&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/muhammad-younas-kareem-9ab017324",
    youtube: "https://youtube.com/@codeartbyyounas?si=HqZ9dR2RbBWz8PEC"
};

const INTERESTS = {
    hobbies: ["Programming", "Graphic Designing", "Reading Books", "Creating Websites", "Freelancing"],
    favorite_movies: ["Interstellar", "Inception"],
    favorite_books: ["Clean Code", "The Pragmatic Programmer"],
    favorite_music: ["Instrumental", "Lo-fi Beats"]
};

const ABOUT_ME = `I am Muhammad Younas, a BS Software Engineering student at Islamia University of Bahawalpur (IUB). 
I am passionate about programming, web development, and Python. My goal is to become a skilled 
software engineer and start earning through freelancing by 2025.

I enjoy learning new technologies and improving my coding skills. I am currently focusing on Python 
development and web development. I also have an interest in reading, especially the Quran and 
software engineering books.`;

// Language Support
const RESPONSES = {
    en: {
        greetings: ["Hello!", "Hi there!", "Welcome!"],
        unknown: "I didn't understand that. Could you please rephrase?",
        creator: `I was created by ${CREATOR_INFO.name} as a personal assistant.`,
        socialMedia: "Here are my social media links:"
    },
    ur: {
        greetings: ["السلام علیکم!", "ہیلو!", "خوش آمدید!"],
        unknown: "میں سمجھا نہیں۔ براہ کرم دوبارہ کہیں۔",
        creator: `مجھے ${CREATOR_INFO.name} نے ایک ذاتی معاون کے طور پر بنایا ہے۔`,
        socialMedia: "میرے سوشل میڈیا لنکس یہ ہیں:"
    }
};

let currentLanguage = 'en';
let isDarkMode = false;

// DOM Elements
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const voiceBtn = document.getElementById('voiceBtn');

// Initialize the chat
window.onload = function() {
    loadChat();
    greetUser();
    setupEventListeners();
};

function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Voice recognition
    voiceBtn.addEventListener('click', startVoiceInput);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function greetUser() {
    const greetings = RESPONSES[currentLanguage].greetings;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    addMessage(randomGreeting, 'bot');
}

// Chat Functions
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(`${sender}-message`);
    
    if (typeof content === 'string') {
        messageDiv.textContent = content;
    } else {
        // Handle rich content (HTML)
        messageDiv.innerHTML = content;
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    addMessage(message, 'user');
    userInput.value = '';
    saveChat();
    
    showTypingIndicator();
    
    // Simulate processing delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(message);
        addMessage(response, 'bot');
        saveChat();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function quickQuestion(question) {
    userInput.value = question;
    sendMessage();
}

function clearChat() {
    if (confirm("Are you sure you want to clear the chat?")) {
        chatBox.innerHTML = '';
        localStorage.removeItem('chatHistory');
        greetUser();
    }
}

// Bot Response Logic
function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();
    
    if (userInput.includes('hi') || userInput.includes('hello') || userInput.includes('salam')) {
        const greetings = RESPONSES[currentLanguage].greetings;
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    else if (userInput.includes('who made you') || userInput.includes('who created you')) {
        return RESPONSES[currentLanguage].creator;
    }
    else if (userInput.includes('age') || userInput.includes('umar')) {
        const age = calculateAge(CREATOR_INFO.birth_date);
        return currentLanguage === 'en' 
            ? `My creator is ${age} years old.`
            : `میرے خالق کی عمر ${age} سال ہے۔`;
    }
    else if (userInput.includes('social media') || userInput.includes('links')) {
        let links = [];
        for (const [platform, url] of Object.entries(SOCIAL_MEDIA)) {
            links.push(`<a href="${url}" target="_blank">${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`);
        }
        return `${RESPONSES[currentLanguage].socialMedia}<div class="social-links">${links.join('<br>')}</div>`;
    }
    else if (userInput.includes('hobbies') || userInput.includes('shauq')) {
        return currentLanguage === 'en'
            ? `My hobbies include: ${INTERESTS.hobbies.join(', ')}`
            : `میرے مشاغل میں شامل ہیں: ${INTERESTS.hobbies.join('، ')}`;
    }
    else if (userInput.includes('about') || userInput.includes('tell me about')) {
        return ABOUT_ME;
    }
    else if (userInput.includes('education') || userInput.includes('qualification')) {
        return `Education: ${CREATOR_INFO.education}`;
    }
    else if (userInput.includes('profession') || userInput.includes('kaam')) {
        return `Profession: ${CREATOR_INFO.profession}`;
    }
    else if (userInput.includes('bye') || userInput.includes('goodbye')) {
        return currentLanguage === 'en'
            ? "Goodbye! Have a great day!"
            : "اللہ حافظ! آپ کا دن اچھا گزرے!";
    }
    else {
        return RESPONSES[currentLanguage].unknown;
    }
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate.split('-').reverse().join('-'));
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

// Voice Recognition
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addMessage("Voice recognition is not supported in your browser.", 'bot');
        return;
    }
    
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = currentLanguage === 'en' ? 'en-US' : 'ur-PK';
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        addMessage("Listening... Speak now.", 'bot');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };
    
    recognition.onerror = function(event) {
        addMessage("Voice input error: " + event.error, 'bot');
    };
    
    recognition.onend = function() {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.start();
}

// Dark Mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
}

// Language Switching
function changeLanguage(lang) {
    currentLanguage = lang;
    addMessage(currentLanguage === 'en' 
        ? "Language switched to English" 
        : "زبان اردو میں تبدیل کر دی گئی", 'bot');
}

// Chat History Management
function saveChat() {
    localStorage.setItem('chatHistory', chatBox.innerHTML);
}

function loadChat() {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        chatBox.innerHTML = savedChat;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Export Chat
function exportChat() {
    const chatContent = chatBox.innerText;
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-with-${CREATOR_INFO.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}