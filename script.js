// ── AOS (Scroll Animations) ──
AOS.init({ duration: 800, once: true, offset: 80 });

// ── Hamburger Menu Toggle ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}

// ══════════════════════════════════════════
//   REAL-TIME VISITOR COUNTER
//   Uses CountAPI — free, no account needed
//   Counts every unique page visit
// ══════════════════════════════════════════
const visitorEl = document.getElementById('visitorCount');

if (visitorEl) {
    // Hit the counter — increments by 1 each visit and returns total
    fetch('https://api.countapi.xyz/hit/srisuvarnasilverpalace.com/visits')
        .then(res => res.json())
        .then(data => {
            const total = data.value;
            animateCounterTo(visitorEl, total);
        })
        .catch(() => {
            // If API fails, show a fallback gracefully
            visitorEl.textContent = '—';
        });
}

function animateCounterTo(el, target) {
    let current = Math.max(0, target - 80);
    const duration = 1800;
    const steps = 60;
    const increment = (target - current) / steps;
    let step = 0;

    const timer = setInterval(() => {
        current += increment;
        step++;
        el.textContent = Math.floor(current).toLocaleString('en-IN');
        if (step >= steps) {
            el.textContent = target.toLocaleString('en-IN');
            clearInterval(timer);
        }
    }, duration / steps);
}

// ══════════════════════════════════════════
//   SITE PROTECTION
// ══════════════════════════════════════════

// ── 1. Disable Right Click ──
document.addEventListener('contextmenu', e => e.preventDefault());

// ── 2. Disable Text Selection ──
document.addEventListener('selectstart', e => e.preventDefault());

// ── 3. Disable Image Dragging ──
document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// ── 4. Disable Keyboard Shortcuts ──
document.addEventListener('keydown', function (e) {
    const key = e.key.toUpperCase();
    if (e.ctrlKey && key === 'U') { e.preventDefault(); return; }
    if (e.ctrlKey && key === 'S') { e.preventDefault(); return; }
    if (e.ctrlKey && key === 'C') { e.preventDefault(); return; }
    if (e.ctrlKey && key === 'A') { e.preventDefault(); return; }
    if (e.ctrlKey && key === 'P') { e.preventDefault(); return; }
    if (e.ctrlKey && e.shiftKey && key === 'I') { e.preventDefault(); return; }
    if (e.ctrlKey && e.shiftKey && key === 'J') { e.preventDefault(); return; }
    if (e.ctrlKey && e.shiftKey && key === 'C') { e.preventDefault(); return; }
    if (e.key === 'F12') { e.preventDefault(); return; }
});

// ── 5. Disable Print Screen ──
document.addEventListener('keyup', e => {
    if (e.key === 'PrintScreen') navigator.clipboard.writeText('').catch(() => {});
});

// ── 6. Disable Copy & Cut ──
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
