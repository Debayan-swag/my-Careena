document.getElementById("log-in-btn")?.addEventListener("click", () => {
    window.location.href = "login.html";
});

document.querySelector("ul li")?.addEventListener("click", () => {
    window.location.href = "signUP.html";
});

document.getElementById("chat-btn")?.addEventListener("click", () => {
if (localStorage.getItem("loggedInUser")) {
window.location.href = "Ca2.html";
} else {
window.location.href = "CaError.html";
}
});

//This part is added from original code.
document.querySelector(".forgot-password")?.addEventListener("click", () => {
    window.location.href = "forgotPass.html";
});

document.querySelector(".login-link")?.addEventListener("click", () => {
    window.location.href = "login.html";
});


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
        window.location.href = "login.html";
    }
});


document.querySelector(".login-container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] && users[username].password === password) {
        alert("Login successful! Redirecting to chatbot.");
        localStorage.setItem("loggedInUser", username);
        window.location.href = "Ca2.html";
        updateUserprofile();
    } else {
        alert("Invalid credentials! Redirecting to login error page.");
        window.location.href = "loginError.html";
    }
});


document.querySelector(".container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("otp", otp);
    alert(`An OTP has been sent to ${email}: ${otp} (Simulated for now)`);
    window.location.href = "otp.html";
});


document.querySelector(".otp-container form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    let enteredOtp = document.getElementById("otp").value;
    let storedOtp = localStorage.getItem("otp");

    if (enteredOtp === storedOtp) {
        alert("OTP Verified! Redirecting to chatbot.");
        localStorage.removeItem("otp");
        window.location.href = "Ca2.html";
        updateUserprofile();
    } else {
        alert("Invalid OTP! Please try again.");
    }
});

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


document.getElementById("input")?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});


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

function updateUserprofile() {
    const username = localStorage.getItem("loggedInUser");
    const userProfile = document.getElementById("user-profile");
    if (username) {
        userProfile.textContent = username.charAt(0).toUpperCase();
        userProfile.style.display = "flex";

        userProfile.addEventListener('click', () => {
            const dialog = document.querySelector('.logout-dialog');
            dialog.style.display = dialog.style.display === 'block' ? 'none' : 'block';
        });

        document.querySelector('.yes-btn')?.addEventListener('click', () => {
            const screenBreak = document.querySelector('.screen-break');
            screenBreak.style.display = 'block';
            screenBreak.style.animation = 'breakEffect 0.5s forwards';

            setTimeout(() => {
                localStorage.removeItem("loggedInUser");
                const userProfile = document.getElementById("user-profile");
                userProfile.style.display = "none";
                document.querySelector('.logout-dialog').style.display = 'none';

                setTimeout(() => {
                    screenBreak.style.display = 'none';
                    location.reload();
                }, 5000);
            }, 500);
        });

        document.querySelector('.no-btn')?.addEventListener('click', () => {
            document.querySelector('.logout-dialog').style.display = 'none';
        });
    } else {
        userProfile.style.display = "none";
    }
}

updateUserprofile();
