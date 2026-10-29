export function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const coord = document.getElementById('cursorCoord');
    const toggleBtn = document.getElementById('toggleCursorBtn');

    let enabled = true;
    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        if (!enabled) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        coord.textContent = `0x${mouseX.toString(16).toUpperCase()},0x${mouseY.toString(16).toUpperCase()}`;
    });

    function animateRing() {
        if (enabled) {
            ringX += (mouseX - ringX) * 0.28;
            ringY += (mouseY - ringY) * 0.28;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveSelector = 'a, button, input, select, textarea, li, .poster-card, .file-title, .tag, .vip-user, #logoEasterEgg';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            ring.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            ring.classList.remove('cursor-hover');
        }
    });

    window.addEventListener('mousedown', (e) => {
        if (!enabled) return;
        ring.classList.add('cursor-click');
        const pulse = document.createElement('div');
        pulse.className = 'click-pulse';
        pulse.style.left = `${e.clientX}px`;
        pulse.style.top = `${e.clientY}px`;
        document.body.appendChild(pulse);
        setTimeout(() => pulse.remove(), 350);
    });

    window.addEventListener('mouseup', () => {
        ring.classList.remove('cursor-click');
    });

    toggleBtn.addEventListener('click', () => {
        enabled = !enabled;
        document.body.classList.toggle('custom-cursor-active', enabled);
        toggleBtn.textContent = enabled ? '[Cursor: HUD]' : '[Cursor: OS]';
    });
}