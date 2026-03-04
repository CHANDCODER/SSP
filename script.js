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
//   BACKGROUND MUSIC  [MOD 4]
//   - First ever visit: starts on first scroll
//     (required by browser autoplay policy)
//   - All pages after that: starts instantly,
//     no interaction needed (sessionStorage flag)
//   - Loops continuously
//   - No UI controls on screen
//   - Visitor controls volume via device buttons
//   - Pauses when tab minimized, resumes on return
//   - To change track: replace the URL below with
//     your Cloudinary audio URL (mp3 / ogg / wav)
// ══════════════════════════════════════════
const bgMusic = new Audio('https://res.cloudinary.com/domlhckfb/video/upload/v1772647748/SSSP/Audio/SoundHelix-Song-1_zlkxmt.mp3');
bgMusic.loop   = true;
bgMusic.volume = 0.25;   // 15% — audible but not intrusive (0.0 = silent, 1.0 = full)

let musicStarted = false;

function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.play()
        .then(() => {
            // Mark that visitor has interacted — future pages autoplay instantly
            sessionStorage.setItem('audioUnlocked', 'true');
        })
        .catch(() => {
            // Still blocked — fallback to first click/tap
            document.addEventListener('click', () => {
                bgMusic.play().then(() => {
                    sessionStorage.setItem('audioUnlocked', 'true');
                });
            }, { once: true });
        });
    window.removeEventListener('scroll', startMusic);
}

// If visitor already scrolled/interacted on a previous page this session
// → start music immediately, no waiting
if (sessionStorage.getItem('audioUnlocked') === 'true') {
    startMusic();
} else {
    // First ever page — wait for first scroll
    window.addEventListener('scroll', startMusic, { passive: true });
}

// Pause when visitor minimizes or switches tab — resume when they return
document.addEventListener('visibilitychange', () => {
    if (!musicStarted) return;
    if (document.hidden) {
        bgMusic.pause();
    } else {
        bgMusic.play().catch(() => {});
    }
});

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