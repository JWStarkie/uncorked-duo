// ── Nav background on scroll ───────────────────────────────
const nav = document.querySelector('.nav');
function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Collab list carousel dots (mobile only) ───────────────
(function () {
    const list = document.querySelector('.collab-list');
    const dots = document.querySelectorAll('.collab-dot');
    if (!list || !dots.length) return;

    function updateDots() {
        const items = list.querySelectorAll('li');
        if (!items.length) return;
        const itemW = items[0].offsetWidth;
        const idx = Math.min(Math.round(list.scrollLeft / itemW), dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    list.addEventListener('scroll', updateDots, { passive: true });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const items = list.querySelectorAll('li');
            if (items[i]) items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
    });
})();

// ── Mobile menu ────────────────────────────────────────────
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn  = document.querySelector('.nav-hamburger');
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn  = document.querySelector('.nav-hamburger');
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
}

// ── Scroll fade-in ─────────────────────────────────────────
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fi').forEach(el => io.observe(el));

// ── Modals ─────────────────────────────────────────────────
function openModal(id) {
    const overlay = document.getElementById(id);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-close').focus();
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
}

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open')
            .forEach(m => closeModal(m.id));
    }
});
