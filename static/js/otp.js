const form = document.querySelector('form');
const input = document.getElementById('otp');
input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredOtp = input.value;
    const storedOtp = localStorage.getItem('otp');
    if (enteredOtp === storedOtp) {
        alert('OTP Verified! Redirecting...');
        localStorage.removeItem('otp');
        window.location.href = '/chat-bot';
    } else {
        alert('Invalid OTP! Please try again.');
        input.value = '';
    }
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

