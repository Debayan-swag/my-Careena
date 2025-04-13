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
