const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('otp', otp);
    alert(`An OTP has been sent to ${email}: ${otp} (Simulated)`);
    window.location.href = '/onetime';
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

