// ══════════════════════════════════════════
//   SITE CONFIG — Only edit this block
//   ─────────────────────────────────────
//   POSTER:
//     Paste any Cloudinary URL, local relative
//     path, or video URL (.mp4 / .webm / .mov).
//     Images and videos are auto-detected.
//     Examples:
//       Cloudinary image → 'https://res.cloudinary.com/.../poster.jpg'
//       Cloudinary video → 'https://res.cloudinary.com/.../video.mp4'
//       Local image      → 'images/poster.jpg'
//       Local video      → 'videos/event.mp4'
//
//   RATES:
//     Update silverRate / goldRate values here.
//     Format: numbers as strings, e.g. '999' or '9,450'
//     Date format: 'DD Mon YYYY'   e.g. '06 Mar 2026'
//     Time format: 'HH:MM AM/PM'  e.g. '10:30 AM'
// ══════════════════════════════════════════
const SITE_CONFIG = {

    // ── Event / Promo Poster ──────────────
    posterSrc:    'images/poster.png',

    // ── Fallback rates (shown if API fails) ─
    silverRateFallback: '96,000',    // ₹ per kg
    goldRateFallback:   '9,450.00',  // ₹ per gram

    // ── Indian Customs & Tax (AP, Vijayawada) ──
    // As per Union Budget 2024-25 (effective 24 Jul 2024):
    customsDuty:   5,      // % Basic Customs Duty (cut from 15% → 5%)
    swsOnCustoms:  10,     // % Social Welfare Surcharge (on BCD only)
    aidc:          1,      // % AIDC (cut from 5% → 1%)
    gst:           3,      // % GST on precious metals
    shopMargin:    2,      // % store premium — tune to match local market

};
// ══════════════════════════════════════════


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
//   Source is now controlled from SITE_CONFIG
//   above — no need to touch index.html.
//   Supports: Cloudinary URLs, local paths,
//   images (.jpg / .png / .webp / etc.) and
//   videos (.mp4 / .webm / .mov / .ogg / .m4v)
//
//   VIDEO AUDIO BEHAVIOUR:
//   ─ Video always starts MUTED (browser rule)
//   ─ A gold unmute button appears bottom-right
//   ─ Click unmute → video audio plays, bg music pauses
//   ─ Click mute   → video audio off, bg music resumes
//   ─ This choice is LOCAL to this page only.
//   ─ Navigate away → bg music plays normally on
//     every other page. Return here → music plays,
//     video is muted again (fresh state every visit).
// ══════════════════════════════════════════
const posterEl = document.getElementById('posterMedia');

if (posterEl) {
    const src = SITE_CONFIG.posterSrc || posterEl.dataset.src;
    if (src) {
        const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
        const cleanSrc  = src.toLowerCase().split('?')[0];
        const isVideo   = videoExts.some(ext => cleanSrc.endsWith(ext));

        if (isVideo) {
            // ── Create video element ──────────────
            const vid = document.createElement('video');
            vid.src         = src;
            vid.className   = 'highlight-poster';
            vid.autoplay    = true;
            vid.loop        = true;
            vid.muted       = true;   // always start muted (browser requires this for autoplay)
            vid.playsInline = true;
            vid.controls    = false;
            posterEl.appendChild(vid);

            // ── Inject unmute button styles once ──
            if (!document.getElementById('posterAudioBtnStyle')) {
                const style = document.createElement('style');
                style.id = 'posterAudioBtnStyle';
                style.textContent = `
                    .poster-audio-btn {
                        position: absolute;
                        bottom: 18px;
                        right: 18px;
                        z-index: 20;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(10, 31, 28, 0.82);
                        border: 1px solid rgba(212, 175, 55, 0.6);
                        border-radius: 50%;
                        color: #d4af37;
                        font-size: 1rem;
                        cursor: pointer;
                        backdrop-filter: blur(6px);
                        transition: all 0.3s ease;
                        user-select: none;
                        -webkit-user-select: none;
                        padding: 0;
                    }
                    .poster-audio-btn:hover {
                        background: rgba(212, 175, 55, 0.18);
                        border-color: #d4af37;
                        transform: scale(1.1);
                    }
                    /* Make poster wrapper position:relative so button positions correctly */
                    .poster-wrapper {
                        position: relative;
                    }
                `;
                document.head.appendChild(style);
            }

            // ── Create unmute button ──────────────
            const btn = document.createElement('button');
            btn.className = 'poster-audio-btn';
            btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            btn.title = 'Unmute video';

            // ── Toggle logic ──────────────────────
            // videoUnmuted is LOCAL — never stored in sessionStorage.
            // Every page load of index.html always starts fresh (muted + music).
            let videoUnmuted = false;

            btn.addEventListener('click', () => {
                videoUnmuted = !videoUnmuted;

                if (videoUnmuted) {
                    // User wants to hear the video — unmute video, pause bg music
                    vid.muted = false;
                    vid.volume = 0.85;
                    bgMusic.pause();
                    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                    btn.title = 'Mute video';
                    btn.style.borderColor = 'rgba(212, 175, 55, 1)';
                    btn.style.color = '#fff';
                } else {
                    // User mutes video — restore bg music
                    vid.muted = true;
                    bgMusic.play().catch(() => {});
                    btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                    btn.title = 'Unmute video';
                    btn.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    btn.style.color = '#d4af37';
                }
            });

            // Append button inside poster-wrapper (parent of posterEl)
            const posterWrapper = posterEl.closest('.poster-wrapper') || posterEl.parentElement;
            posterWrapper.appendChild(btn);

        } else {
            // ── Image poster — no audio button needed ──
            const img     = document.createElement('img');
            img.src       = src;
            img.alt       = 'Current Event Poster';
            img.className = 'highlight-poster';
            posterEl.appendChild(img);
        }
    }
}

// ══════════════════════════════════════════
//   LIVE RATE BADGES  [MOD 2]
//   • Silver → ₹ per KG  (with green/red flash)
//   • Gold   → ₹ per gram with 2 decimals
//   • Polls every 5 seconds
//   • Green background flash = price went UP
//   • Red background flash   = price went DOWN
//   • Hides date/time (rates are always live)
//   • Falls back to SITE_CONFIG if API fails
// ══════════════════════════════════════════

// ── Inject flash animation styles once ──────
(function injectRateStyles() {
    if (document.getElementById('rateFlashStyle')) return;
    const s = document.createElement('style');
    s.id = 'rateFlashStyle';
    s.textContent = `
        @keyframes flashGreen {
            0%   { background: rgba(0,200,80,0.35); }
            60%  { background: rgba(0,200,80,0.15); }
            100% { background: transparent; }
        }
        @keyframes flashRed {
            0%   { background: rgba(220,50,50,0.35); }
            60%  { background: rgba(220,50,50,0.15); }
            100% { background: transparent; }
        }
        .rate-flash-up   { animation: flashGreen 1.2s ease forwards; }
        .rate-flash-down { animation: flashRed   1.2s ease forwards; }

        /* Arrow indicator next to price */
        .rate-arrow {
            font-size: 0.75rem;
            margin-left: 4px;
            font-weight: bold;
            transition: color 0.4s;
        }
        .rate-arrow.up   { color: #00c850; }
        .rate-arrow.down { color: #dc3232; }
        .rate-arrow.flat { color: transparent; }
    `;
    document.head.appendChild(s);
})();

// ── Hide date/time — rates are always live ──
(function hideDateTimeFromBadges() {
    document.querySelectorAll('.rate-updated').forEach(el => el.style.display = 'none');
})();

// ── Fix unit labels: silver → /kg, gold → /g ──
(function fixUnitLabels() {
    const silverCard = document.querySelector('.silver-rate-card');
    if (silverCard) {
        const unit = silverCard.querySelector('.rate-unit');
        if (unit) unit.textContent = '/ kg';
    }
    const goldCard = document.querySelector('.gold-rate-card');
    if (goldCard) {
        const unit = goldCard.querySelector('.rate-unit');
        if (unit) unit.textContent = '/ gm';
    }
})();

// ── Add arrow elements next to prices ────────
(function addArrows() {
    ['silverRatePerGram', 'goldRatePerGram'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const arrow = document.createElement('span');
        arrow.className = 'rate-arrow flat';
        arrow.id = id + 'Arrow';
        arrow.textContent = '▲';
        el.insertAdjacentElement('afterend', arrow);
    });
})();

// ── Tax calculation ───────────────────────────
function applyIndianDutyAndGST(baseINRperGram) {
    const cd   = SITE_CONFIG.customsDuty  / 100;
    const sws  = SITE_CONFIG.swsOnCustoms / 100;
    const aidc = SITE_CONFIG.aidc         / 100;
    const gst  = SITE_CONFIG.gst          / 100;
    const marg = SITE_CONFIG.shopMargin   / 100;

    const customsAmt = baseINRperGram * cd;
    const swsAmt     = customsAmt * sws;
    const aidcAmt    = baseINRperGram * aidc;
    const afterDuty  = baseINRperGram + customsAmt + swsAmt + aidcAmt;
    const afterGST   = afterDuty * (1 + gst);
    return afterGST * (1 + marg);
}

// ── Flash a card green or red ─────────────────
function flashCard(cardSelector, direction) {
    const card = document.querySelector(cardSelector);
    if (!card) return;
    card.classList.remove('rate-flash-up', 'rate-flash-down');
    void card.offsetWidth; // force reflow to restart animation
    card.classList.add(direction === 'up' ? 'rate-flash-up' : 'rate-flash-down');
}

// ── Update arrow indicator ────────────────────
function setArrow(id, direction) {
    const arrow = document.getElementById(id + 'Arrow');
    if (!arrow) return;
    arrow.classList.remove('up', 'down', 'flat');
    if (direction === 'up')   { arrow.textContent = '▲'; arrow.classList.add('up'); }
    if (direction === 'down') { arrow.textContent = '▼'; arrow.classList.add('down'); }
    if (direction === 'flat') { arrow.textContent = '▲'; arrow.classList.add('flat'); }
}

// ── Store previous values to detect change ────
let prevSilverVal  = null;
let prevGoldVal    = null;
let prevGoldSpot   = null;
let prevSilverSpot = null;
let prevUsdInr     = null;

// ── Flash a spot value green or red ──────────
function flashSpot(id, direction) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('flash-up', 'flash-down');
    void el.offsetWidth;
    el.classList.add(direction === 'up' ? 'flash-up' : 'flash-down');
    setTimeout(() => el.classList.remove('flash-up', 'flash-down'), 1400);
}

// ── Main fetch & update function ─────────────
async function fetchAndApplyLiveRates() {
    try {
        const [metalsRes, forexRes] = await Promise.all([
            fetch('https://data-asg.goldprice.org/dbXRates/USD', { cache: 'no-cache' }),
            fetch('https://open.er-api.com/v6/latest/USD',       { cache: 'no-cache' })
        ]);
        if (!metalsRes.ok || !forexRes.ok) throw new Error('API error');

        const metals = await metalsRes.json();
        const forex  = await forexRes.json();

        const usdToInr       = (forex.rates && forex.rates.INR) ? forex.rates.INR : 84.0;
        const TROY_OZ_TO_GRAM = 31.1035;

        const item = metals.items && metals.items[0];
        if (!item) throw new Error('No metal data');

        // Per gram in INR before duties
        const silverBaseINR = (item.xagPrice / TROY_OZ_TO_GRAM) * usdToInr;
        const goldBaseINR   = (item.xauPrice / TROY_OZ_TO_GRAM) * usdToInr;

        // Apply Indian duties
        const silverPerGram = applyIndianDutyAndGST(silverBaseINR);
        const goldPerGram   = applyIndianDutyAndGST(goldBaseINR);

        // Silver → display per KG, Gold → display per gram with 2 decimals
        const silverPerKg   = silverPerGram * 1000;

        const silverDisplay = silverPerKg.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        const goldDisplay   = goldPerGram.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // ── Silver badge update ──
        const silverEl = document.getElementById('silverRatePerGram');
        if (silverEl) {
            const changed = prevSilverVal !== null && silverPerKg !== prevSilverVal;
            if (changed || prevSilverVal === null) {
                silverEl.textContent = silverDisplay;
                if (changed) {
                    const dir = silverPerKg > prevSilverVal ? 'up' : 'down';
                    flashCard('.silver-rate-card', dir);
                    setArrow('silverRatePerGram', dir);
                }
            }
            prevSilverVal = silverPerKg;
        }

        // ── Gold badge update ──
        const goldEl = document.getElementById('goldRatePerGram');
        if (goldEl) {
            const changed = prevGoldVal !== null && goldPerGram !== prevGoldVal;
            if (changed || prevGoldVal === null) {
                goldEl.textContent = goldDisplay;
                if (changed) {
                    const dir = goldPerGram > prevGoldVal ? 'up' : 'down';
                    flashCard('.gold-rate-card', dir);
                    setArrow('goldRatePerGram', dir);
                }
            }
            prevGoldVal = goldPerGram;
        }

        // ── Spot strip update (raw international values) ──
        const goldSpotEl   = document.getElementById('goldSpotUSD');
        const silverSpotEl = document.getElementById('silverSpotUSD');
        const usdInrEl     = document.getElementById('usdInrValue');

        const goldSpotVal   = item.xauPrice;
        const silverSpotVal = item.xagPrice;
        const usdInrRounded = Math.round(usdToInr * 100) / 100;

        if (goldSpotEl) {
            const display = goldSpotVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (prevGoldSpot !== null && goldSpotVal !== prevGoldSpot)
                flashSpot('goldSpotUSD', goldSpotVal > prevGoldSpot ? 'up' : 'down');
            goldSpotEl.textContent = display;
            prevGoldSpot = goldSpotVal;
        }
        if (silverSpotEl) {
            const display = silverSpotVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (prevSilverSpot !== null && silverSpotVal !== prevSilverSpot)
                flashSpot('silverSpotUSD', silverSpotVal > prevSilverSpot ? 'up' : 'down');
            silverSpotEl.textContent = display;
            prevSilverSpot = silverSpotVal;
        }
        if (usdInrEl) {
            const display = usdInrRounded.toFixed(2);
            if (prevUsdInr !== null && usdInrRounded !== prevUsdInr)
                flashSpot('usdInrValue', usdInrRounded > prevUsdInr ? 'up' : 'down');
            usdInrEl.textContent = display;
            prevUsdInr = usdInrRounded;
        }

    } catch (err) {
        // Show fallback only on first load if elements still show —
        const silverEl = document.getElementById('silverRatePerGram');
        const goldEl   = document.getElementById('goldRatePerGram');
        if (silverEl && silverEl.textContent === '—') silverEl.textContent = SITE_CONFIG.silverRateFallback;
        if (goldEl   && goldEl.textContent   === '—') goldEl.textContent   = SITE_CONFIG.goldRateFallback;
        console.warn('Live rate fetch failed:', err.message);
    }
}

// ── Init: show loading dash, start polling ───
(function initLiveRates() {
    const silverEl = document.getElementById('silverRatePerGram');
    const goldEl   = document.getElementById('goldRatePerGram');
    if (silverEl) silverEl.textContent = '—';
    if (goldEl)   goldEl.textContent   = '—';

    if (silverEl || goldEl) {
        fetchAndApplyLiveRates();               // immediate first fetch
        setInterval(fetchAndApplyLiveRates, 5000); // poll every 5 seconds
    }
})();

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
const bgMusic = new Audio('images/bm.mp3');
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
