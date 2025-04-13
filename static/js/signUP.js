document.querySelector(".signup-container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        alert("Username already exists! Try logging in.");
    } else {
        users[username] = { fullname, email, password };
        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful! Redirecting to login.");
        window.location.href = "/login";
    }
});
// Login Functionality
document.querySelector(".login-container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] && users[username].password === password) {
        alert("Login successful! Redirecting to chatbot.");
        localStorage.setItem("loggedInUser", username);
        window.location.href = "/chat-bot";
    } else {
        alert("Invalid credentials! Redirecting to login error page.");
        window.location.href = "/loginerror";
    }
});
// Forgot Password Functionality
document.querySelector(".container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("otp", otp);
    alert(`An OTP has been sent to ${email}: ${otp} (Simulated for now)`);
    window.location.href = "/onetime";
});
// OTP Verification Functionality
document.querySelector(".otp-container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let enteredOtp = document.getElementById("otp").value;
    let storedOtp = localStorage.getItem("otp");
    if (enteredOtp === storedOtp) {
        alert("OTP Verified! Redirecting to chatbot.");
        localStorage.removeItem("otp");
        window.location.href = "/chat-bot";
    } else {
        alert("Invalid OTP! Please try again.");
    }
});
// Chatbot Functionality
function sendMessage() {
    let userMessage = document.getElementById("input").value;
    fetch('https://my-careena.onrender.com/chat', {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            let chatbox = document.querySelector(".ans-div");
            chatbox.innerHTML += `<p><b>You:</b> ${userMessage}</p>`;
            chatbox.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
            document.getElementById("input").value = "";
        });
}
// Trigger sendMessage on Enter Key press
document.getElementById("input")?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
// Voice Recognition (Microphone)
document.getElementById("microphone-btn")?.addEventListener("click", () => {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
        let voiceInput = event.results[0][0].transcript;
        document.getElementById("input").value = voiceInput;
        sendMessage();
    };
    recognition.onerror = () => {
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

