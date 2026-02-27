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

// ── Visitor Counter Animation ──
function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(start).toLocaleString('en-IN') + '+';
    }, 16);
}

const counterEl = document.getElementById('visitorCount');
if (counterEl) {
    const TARGET = 12847;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(counterEl, TARGET, 2000);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(counterEl);
}

// ══════════════════════════════════════════
//   SITE PROTECTION
// ══════════════════════════════════════════

// ── 1. Disable Right Click ──
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// ── 2. Disable Text Selection ──
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

// ── 3. Disable Image Dragging ──
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        }
});

// ── 4. Disable Keyboard Shortcuts ──
document.addEventListener('keydown', function (e) {
    const key = e.key.toUpperCase();

    // Ctrl+U — View Source
    if (e.ctrlKey && key === 'U') {
        e.preventDefault();
            return;
    }

    // Ctrl+S — Save Page
    if (e.ctrlKey && key === 'S') {
        e.preventDefault();
            return;
    }

    // Ctrl+Shift+I — DevTools
    if (e.ctrlKey && e.shiftKey && key === 'I') {
        e.preventDefault();
            return;
    }

    // Ctrl+Shift+J — DevTools Console
    if (e.ctrlKey && e.shiftKey && key === 'J') {
        e.preventDefault();
            return;
    }

    // Ctrl+Shift+C — DevTools Inspector
    if (e.ctrlKey && e.shiftKey && key === 'C') {
        e.preventDefault();
            return;
    }

    // F12 — DevTools
    if (e.key === 'F12') {
        e.preventDefault();
            return;
    }

    // Ctrl+A — Select All
    if (e.ctrlKey && key === 'A') {
        e.preventDefault();
        return;
    }

    // Ctrl+C — Copy
    if (e.ctrlKey && key === 'C') {
        e.preventDefault();
            return;
    }

    // Ctrl+P — Print
    if (e.ctrlKey && key === 'P') {
        e.preventDefault();
            return;
    }
});

// ── 5. Disable Print Screen (best effort) ──
document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('').catch(() => {});
        }
});

// ── 6. Disable Copy via clipboard event ──
document.addEventListener('copy', function (e) {
    e.preventDefault();
});

// ── 7. Disable Cut ──
document.addEventListener('cut', function (e) {
    e.preventDefault();
});

