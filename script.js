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
//   POSTER MEDIA LOADER  [MOD 1]
//   Reads data-src on #posterMedia.
//   If URL ends in .mp4/.webm/.mov etc -> video
//   Otherwise -> img
//   To switch: just change data-src in index.html
// ══════════════════════════════════════════
const posterEl = document.getElementById('posterMedia');

if (posterEl) {
    const src = posterEl.dataset.src;
    if (src) {
        const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
        const cleanSrc  = src.toLowerCase().split('?')[0];
        const isVideo   = videoExts.some(ext => cleanSrc.endsWith(ext));

        if (isVideo) {
            const vid = document.createElement('video');
            vid.src         = src;
            vid.className   = 'highlight-poster';
            vid.autoplay    = true;
            vid.loop        = true;
            vid.muted       = true;
            vid.playsInline = true;
            vid.controls    = false;
            posterEl.appendChild(vid);
        } else {
            const img     = document.createElement('img');
            img.src       = src;
            img.alt       = 'Current Event Poster';
            img.className = 'highlight-poster';
            posterEl.appendChild(img);
        }
    }
}

// ══════════════════════════════════════════
//   REAL-TIME VISITOR COUNTER  [MOD 3]
//   CountAPI.xyz is permanently offline.
//   Now using counterapi.dev (free, no login)
// ══════════════════════════════════════════
const visitorEl = document.getElementById('visitorCount');

if (visitorEl) {
    fetch('https://api.counterapi.dev/v1/srisuvarnasilverpalace/visits/up')
        .then(res => res.json())
        .then(data => {
            const total = data.count;
            if (total) {
                animateCounterTo(visitorEl, total);
            } else {
                visitorEl.textContent = '0';
            }
        })
        .catch(() => {
            visitorEl.textContent = '-';
        });
}

function animateCounterTo(el, target) {
    let current = Math.max(0, target - 80);
    const duration  = 1800;
    const steps     = 60;
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
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });
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
document.addEventListener('keyup', e => { if (e.key === 'PrintScreen') navigator.clipboard.writeText('').catch(() => {}); });
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut',  e => e.preventDefault());