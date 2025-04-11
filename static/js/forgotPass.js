const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('otp', otp);
    alert(`An OTP has been sent to ${email}: ${otp} (Simulated)`);
    window.location.href = '/onetime';
});