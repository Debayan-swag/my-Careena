document.addEventListener("DOMContentLoaded", function () {
    // Navigation buttons
    const loginBtn = document.getElementById("log-in-btn");
    const signupBtn = document.querySelector("ul li"); // Ensure the correct element
    const exploreBtn = document.getElementById("chat-btn");
    const forgotPasswordLink = document.querySelector(".forgot-password");
    const loginLink = document.querySelector(".login-link");

    // Navigation event listeners
    if (loginBtn) loginBtn.addEventListener("click", () => window.location.href = "login.html");
    if (signupBtn) signupBtn.addEventListener("click", () => window.location.href = "signUP.html");
    if (exploreBtn) exploreBtn.addEventListener("click", () => window.location.href = "Ca2.html");
    if (forgotPasswordLink) forgotPasswordLink.addEventListener("click", () => window.location.href = "forgotPass.html");
    if (loginLink) loginLink.addEventListener("click", () => window.location.href = "login.html");

    // Signup Functionality
    const signupForm = document.querySelector(".signup-container form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const fullname = document.getElementById("fullname").value;
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || {};
            if (users[username]) {
                alert("Username already exists! Try logging in.");
            } else {
                users[username] = { fullname, email, password };
                localStorage.setItem("users", JSON.stringify(users));
                alert("Signup successful! Redirecting to login.");
                window.location.href = "login.html";
            }
        });
    }

    // Login Functionality
    const loginForm = document.querySelector(".login-container form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || {};
            if (users[username] && users[username].password === password) {
                alert("Login successful! Redirecting to chatbot.");
                localStorage.setItem("loggedInUser", username);
                window.location.href = "Ca2.html";
            } else {
                alert("Invalid credentials! Redirecting to login error page.");
                window.location.href = "loginError.html";
            }
        });
    }

    // Forgot Password Functionality
    const forgotPasswordForm = document.querySelector(".forgot-password-container form");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem("otp", otp);
            alert(`An OTP has been sent to ${email}: ${otp} (Simulated for now)`);
            window.location.href = "otp.html";
        });
    }

    // OTP Verification Functionality
    const otpForm = document.querySelector(".otp-container form");
    if (otpForm) {
        otpForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const enteredOtp = document.getElementById("otp").value;
            const storedOtp = localStorage.getItem("otp");

            if (enteredOtp === storedOtp) {
                alert("OTP Verified! Redirecting to chatbot.");
                localStorage.removeItem("otp");
                window.location.href = "Ca2.html";
            } else {
                alert("Invalid OTP! Please try again.");
            }
        });
    }

    // Chatbot Functionality
    const chatInput = document.getElementById("input");
    const answerDiv = document.querySelector(".ans-div");
    const microphoneBtn = document.getElementById("microphone-btn");

    if (chatInput && answerDiv) {
        chatInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const userMessage = chatInput.value.trim();
                if (userMessage) {
                    displayMessage(userMessage, "user");
                    chatInput.value = "";
                    setTimeout(() => generateBotResponse(userMessage), 1000);
                }
            }
        });

        function displayMessage(message, sender) {
            const messageElement = document.createElement("p");
            messageElement.textContent = message;
            messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
            answerDiv.appendChild(messageElement);
            answerDiv.scrollTop = answerDiv.scrollHeight;
        }

        function generateBotResponse(userMessage) {
            const responses = {
                "hi": "Hello! How can I assist you today?",
                "how are you?": "I'm just a bot, but I'm here to help!",
                "what's your name?": "I'm Careena, your virtual health assistant!",
                "thank you": "You're welcome! Stay healthy!",
                "bye": "Goodbye! Take care!"
            };

            const lowerMessage = userMessage.toLowerCase();
            const botResponse = responses[lowerMessage] || "I'm not sure how to respond to that. Can you specify more details?";
            displayMessage(botResponse, "bot");
        }

        if (microphoneBtn) {
            microphoneBtn.addEventListener("click", function () {
                const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.lang = "en-US";
                recognition.start();

                recognition.onresult = function (event) {
                    const voiceInput = event.results[0][0].transcript;
                    chatInput.value = voiceInput;
                    chatInput.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));
                };

                recognition.onerror = function () {
                    alert("Voice recognition error. Please try again.");
                };
            });
        }
    }
});
