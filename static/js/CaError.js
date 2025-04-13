document.getElementById("log-in-btn")?.addEventListener("click", () => {
    window.location.href = "/login";
});
document.getElementById("sign-up-btn")?.addEventListener("click", () => {
    window.location.href = "/signup";
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

