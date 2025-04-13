        // Add logout functionality
        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "/dashboard";
        });

        const chatbox = document.querySelector(".ans-div");
        const inputField = document.getElementById("input");
        const diseaseSuggestions = document.querySelector(".disease-suggestions");
        const sendButton = document.getElementById("send-btn");
        const clearButton = document.getElementById("clear-btn");
        let isTyping = false;
        let shouldStop = false;
        const stopButton = document.getElementById("stop-btn");
        const sessionId = Date.now().toString();
        let conversationHistory = [];

        // Add to local storage
        function saveToLocalStorage() {
            localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(conversationHistory));
        }

        // Load from local storage
        function loadFromLocalStorage() {
            const savedHistory = localStorage.getItem(`chat_history_${sessionId}`);
            if (savedHistory) {
                conversationHistory = JSON.parse(savedHistory);
                conversationHistory.forEach(msg => {
                    appendMessage(msg.sender, msg.message, msg.type);
                });
            }
        }

        // Load chat history on startup
        loadFromLocalStorage();

        // Handle disease card clicks
        document.querySelectorAll(".disease-card").forEach(card => {
            card.addEventListener("click", () => {
                inputField.value = `Tell me about ${card.textContent}`;
                sendMessage();
            });
        });


        async function sendMessage() {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;

            // Reset stop flag
            shouldStop = false;

            // Hide suggestions, set display to none
            diseaseSuggestions.style.display = "none";
            chatbox.classList.add("show");

            appendMessage("You", userMessage, "user");
            inputField.value = "";

            showTypingEffect();
            stopButton.style.display = "flex";
            sendButton.style.display = "none";

            try {
                // Save message to history
                conversationHistory.push({
                    sender: "You",
                    message: userMessage,
                    type: "user",
                    timestamp: new Date().toISOString()
                });
                saveToLocalStorage();

                const response = await fetch('https://my-careena.onrender.com/chat', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        message: userMessage,
                        sessionId: sessionId
                    })
                });

                const data = await response.json();
                removeTypingEffect();

                // Save bot response to history
                conversationHistory.push({
                    sender: "Careena",
                    message: data.reply,
                    type: "bot",
                    timestamp: new Date().toISOString()
                });
                saveToLocalStorage();

                typeBotMessage("Careena", data.reply, "bot");
            } catch (error) {
                removeTypingEffect();
                typeBotMessage("Careena", "Sorry, I'm having trouble connecting to the server. Please try again later.", "bot");
            }
        }


        function appendMessage(sender, message, senderType) {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add(senderType === "user" ? "user-msg" : "bot-msg");
            msgDiv.innerHTML = `<b>${sender}:</b> <span>${message}</span>`;
            chatbox.appendChild(msgDiv);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function showTypingEffect() {
            const typingDiv = document.createElement("div");
            typingDiv.classList.add("typing");
            typingDiv.innerHTML = `<b>Careena is typing...</b>`;
            chatbox.appendChild(typingDiv);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function removeTypingEffect() {
            const typingDiv = document.querySelector(".typing");
            if (typingDiv) typingDiv.remove();
        }

        function formatMessage(message) {
            // Remove asterisks
            message = message.replace(/\*/g, '');


            // Format headings with proper spacing and styling
            message = message.replace(/\n(#+)\s*([^\n]+)/g, (match, hashes, text) => {
                const level = hashes.length;
                const fontSize = 1.6 - (level - 1) * 0.2;
                const marginTop = level === 1 ? '2em' : '1.5em';
                const marginBottom = '1em';
                const icon = level === 1 ? '📌' : '🔹';
                return `\n<h${level} style="color: ${level === 1 ? '#05445E' : '#1eb0ba'}; font-size: ${fontSize}em; margin: ${marginTop} 0 ${marginBottom} 0; padding-bottom: 0.5em; border-bottom: ${level === 1 ? '2px solid #eee' : 'none'};">${icon} ${text}</h${level}>`;
            });

            // Format lists
            message = message.replace(/^-\s+([^\n]+)/gm, '<li style="margin: 0.5rem 0 0.5rem 1.5rem; list-style: none; position: relative;"><span style="position: absolute; left: -1.5rem;">•</span> $1</li>');

            // Format paragraphs
            message = message.replace(/\n\n([^#\n][^\n]+)/g, '<p style="margin: 1em 0; line-height: 1.6;">$1</p>');

            return message;
        }

        function detectMood(message) {
            const casualPatterns = /hey|hi|hello|what's up|wassup|how are you|who are you/i;
            const formalPatterns = /could you|please|would you|I need|help me/i;
            const urgentPatterns = /emergency|urgent|hurry|asap|quickly/i;
            const personalPatterns = /who are you|tell me about yourself|what can you do/i;
            const medicalPatterns = /symptoms|disease|pain|treatment|medicine|doctor|medical|health|condition|diagnosis|sick|illness|infection|injury|therapy|cure|healing|medication/i;

            if (personalPatterns.test(message)) {
                return "personal";
            } else if (urgentPatterns.test(message)) {
                return "urgent";
            } else if (formalPatterns.test(message)) {
                return "formal";
            } else if (casualPatterns.test(message)) {
                return "casual";
            } else if (medicalPatterns.test(message)) {
                return "medical";
            }
            return "neutral";
        }

        function getPersonalityResponse(mood) {
            const responses = {
                personal: "I'm CAREENA, your dedicated AI healthcare assistant. I'm here to help you understand health-related topics and provide general medical information. While I can't replace a doctor, I can offer educational insights about health conditions, symptoms, and wellness. How can I assist you today?",
                casual: "Hey there! 👋 What's on your mind? I'm here to chat about any health questions you have!",
                formal: "Greetings, I'm here to assist you with your medical inquiry. Please proceed with your question.",
                urgent: "I understand this is urgent. While I'll provide information quickly, please remember to seek immediate medical attention for emergencies by calling your local emergency services.",
                neutral: "I'm listening. How can I help you with your health concerns today?",
                medical: "I can help you with that. Please provide me with more details."
            };
            return responses[mood] || responses.neutral;
        }

        let lastScrollPosition = 0;
        let userHasScrolled = false;

        chatbox.addEventListener('scroll', () => {
            lastScrollPosition = chatbox.scrollTop;
            userHasScrolled = true;
        });

        function typeBotMessage(sender, message, senderType) {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add(senderType === "user" ? "user-msg" : "bot-msg");
            if (senderType === "bot") {
                msgDiv.style.fontSize = "1rem";
                msgDiv.style.lineHeight = "1.5";
            }

            // Check if it's a user message and detect mood
            if (senderType === "user") {
                const mood = detectMood(message);
                if (mood === "personal") {
                    message = "about_careena";
                }
            }

            // Handle personal questions about Careena
            if (message === "about_careena") {
                message = getPersonalityResponse("personal");
            }

            msgDiv.innerHTML = `<b>${sender}:</b> <div class="message-content"></div>`;
            chatbox.appendChild(msgDiv);

            const content = msgDiv.querySelector(".message-content");
            const formattedMessage = formatMessage(message);
            let i = 0;
            const typingSpeed = 4; // Adjust typing speed
            isTyping = true;

            function typeChar() {
                if (i < formattedMessage.length && isTyping && !shouldStop) {
                    content.innerHTML = formattedMessage.substring(0, i + 1);
                    i++;

                    // Only auto-scroll if user hasn't manually scrolled up
                    if (!userHasScrolled || chatbox.scrollTop + chatbox.clientHeight >= chatbox.scrollHeight - 100) {
                        chatbox.scrollTop = chatbox.scrollHeight;
                    }

                    setTimeout(typeChar, typingSpeed);
                } else {
                    if (!shouldStop) {
                        content.innerHTML = formattedMessage;
                        if (!userHasScrolled) {
                            chatbox.scrollTop = chatbox.scrollHeight;
                        }
                    }
                    stopButton.style.display = "none";
                    sendButton.style.display = "flex";
                    isTyping = false;
                }
            }

            typeChar();

            // Add stop button click handler
            stopButton.onclick = () => {
                shouldStop = true;
                isTyping = false;
                // Don't update content immediately, let it stop naturally
                stopButton.style.display = "none";
                sendButton.style.display = "flex";
            };
        }

        // Event Listeners
        inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });

        sendButton.addEventListener("click", sendMessage);

        clearButton.addEventListener("click", () => {
            chatbox.innerHTML = '';
            conversationHistory = [];
            localStorage.removeItem(`chat_history_${sessionId}`);
            diseaseSuggestions.style.display = "block";
            chatbox.classList.remove("show");
        });

        document.getElementById("microphone-btn")?.addEventListener("click", () => {
            const micButton = document.getElementById("microphone-btn");
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            // Visual feedback when recording
            micButton.style.background = "#ff4444";
            micButton.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';

            recognition.start();

            recognition.onresult = (event) => {
                const voiceInput = event.results[0][0].transcript;
                document.getElementById("input").value = voiceInput;
                sendMessage();
            };

            recognition.onend = () => {
                micButton.style.background = "#1eb0ba";
                micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                micButton.style.background = "#1eb0ba";
                micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                alert("Voice recognition error. Please try again.");
            };
        });
        const createOrb = () => {
            const orb = document.createElement('div');
            orb.className = 'orb';
        
            const size = Math.random() * 20 + 10;
            orb.style.width = `${size}px`;
            orb.style.height = `${size}px`;
            orb.style.left = `${Math.random() * 100}vw`;
            orb.style.bottom = '-30px';
            orb.style.animationDuration = `${8 + Math.random() * 5}s`;
        
            document.body.appendChild(orb);
        
            setTimeout(() => orb.remove(), 15000);
        };
        
        setInterval(createOrb, 400);
        
        