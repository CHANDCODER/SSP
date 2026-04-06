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
//   LIVE RATES (India — Andhra Pradesh):
//     Gold & silver rates are fetched live from
//     international markets and auto-converted to
//     INR with Indian customs + GST applied.
//
//   TAX & DUTY TWEAKS:
//     Adjust the percentages below to fine-tune
//     the displayed rate. All values are in %.
//     ─ customsDuty      : Basic customs duty
//     ─ swsOnCustoms     : Social Welfare Surcharge
//                          (calculated on customs duty)
//     ─ aidc             : Agri. Infra. Dev. Cess
//     ─ gst              : GST on precious metals (AP)
//     ─ shopMargin       : Your store's margin/premium
//                          (set 0 to show pure landed cost)
//
//   FALLBACK RATES:
//     Shown only if the live API is unreachable.
// ══════════════════════════════════════════
const SITE_CONFIG = {

    // ── Event / Promo Poster ──────────────
    posterSrc:    'images/poster.png',

    // ── Fallback rates (shown if API fails) ─
    silverRateFallback: '240',
    goldRateFallback:   '15,000',

    // ── Indian Customs & Tax (AP, Vijayawada) ─
    // Current import duty structure for silver & gold:
    customsDuty:   15,      // % Basic Customs Duty
    swsOnCustoms:  10,      // % Social Welfare Surcharge (on customs duty)
    aidc:           5,      // % Agriculture Infra. Dev. Cess
    gst:            3,      // % GST on precious metals
    shopMargin:     2,      // % store premium/making adjustment (set 0 to remove)

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
//   Fetches real-time international gold &
//   silver prices (USD/troy oz) and converts
//   to INR/gram applying Indian customs + GST
//   for Andhra Pradesh, Vijayawada.
//
//   APIs used (both free, no key required):
//   ─ Metals : data-asg.goldprice.org
//   ─ Forex  : open.er-api.com (USD → INR)
//
//   Refreshes every 60 seconds.
//   Date & time removed — rates are always live.
// ══════════════════════════════════════════

// Hide date/time spans — rates are now always live
(function hideDateTimeFromBadges() {
    document.querySelectorAll('.rate-updated').forEach(el => {
        el.style.display = 'none';
    });
})();

// ── Tax calculation helper ──────────────────
function applyIndianDutyAndGST(baseINRperGram) {
    const cd   = SITE_CONFIG.customsDuty  / 100;   // Basic Customs Duty
    const sws  = SITE_CONFIG.swsOnCustoms / 100;   // SWS on customs duty
    const aidc = SITE_CONFIG.aidc         / 100;   // AIDC
    const gst  = SITE_CONFIG.gst          / 100;   // GST
    const marg = SITE_CONFIG.shopMargin   / 100;   // Store margin

    const customsAmt = baseINRperGram * cd;
    const swsAmt     = customsAmt * sws;
    const aidcAmt    = baseINRperGram * aidc;
    const afterDuty  = baseINRperGram + customsAmt + swsAmt + aidcAmt;
    const afterGST   = afterDuty * (1 + gst);
    const final      = afterGST  * (1 + marg);

    return Math.round(final);
}

// ── Format number in Indian style ───────────
function formatINR(num) {
    return num.toLocaleString('en-IN');
}

// ── Animate price change ─────────────────────
function flashBadge(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.style.transition = 'color 0.3s ease';
    el.style.color = '#ffffff';
    setTimeout(() => { el.style.color = ''; }, 600);
}

// ── Fetch and apply live rates ───────────────
async function fetchAndApplyLiveRates() {
    try {
        // Fetch both APIs in parallel
        const [metalsRes, forexRes] = await Promise.all([
            fetch('https://data-asg.goldprice.org/dbXRates/USD', { cache: 'no-cache' }),
            fetch('https://open.er-api.com/v6/latest/USD',       { cache: 'no-cache' })
        ]);

        if (!metalsRes.ok || !forexRes.ok) throw new Error('API response error');

        const metals = await metalsRes.json();
        const forex  = await forexRes.json();

        // USD → INR exchange rate
        const usdToInr = forex.rates && forex.rates.INR ? forex.rates.INR : 83.5;

        // International prices are in USD per troy ounce
        // 1 troy oz = 31.1035 grams
        const TROY_OZ_TO_GRAM = 31.1035;

        // goldprice.org gives: items[0].xauPrice (gold) and items[0].xagPrice (silver)
        // both in USD per troy oz
        const item = metals.items && metals.items[0];
        if (!item) throw new Error('No metal data');

        const goldUSDperOz   = item.xauPrice;
        const silverUSDperOz = item.xagPrice;

        const goldBaseINR   = (goldUSDperOz   / TROY_OZ_TO_GRAM) * usdToInr;
        const silverBaseINR = (silverUSDperOz / TROY_OZ_TO_GRAM) * usdToInr;

        const goldFinal   = applyIndianDutyAndGST(goldBaseINR);
        const silverFinal = applyIndianDutyAndGST(silverBaseINR);

        // Push to badge elements
        const silverEl = document.getElementById('silverRatePerGram');
        const goldEl   = document.getElementById('goldRatePerGram');

        if (silverEl) {
            const newVal = formatINR(silverFinal);
            if (silverEl.textContent !== newVal) {
                silverEl.textContent = newVal;
                flashBadge('silverRatePerGram');
            }
        }
        if (goldEl) {
            const newVal = formatINR(goldFinal);
            if (goldEl.textContent !== newVal) {
                goldEl.textContent = newVal;
                flashBadge('goldRatePerGram');
            }
        }

    } catch (err) {
        // API failed — show fallback values from SITE_CONFIG
        const silverEl = document.getElementById('silverRatePerGram');
        const goldEl   = document.getElementById('goldRatePerGram');
        if (silverEl && silverEl.textContent === '—') silverEl.textContent = SITE_CONFIG.silverRateFallback;
        if (goldEl   && goldEl.textContent   === '—') goldEl.textContent   = SITE_CONFIG.goldRateFallback;
        console.warn('Live rate fetch failed, showing fallback.', err.message);
    }
}

// ── Init: show loading dash, then fetch ──────
(function initLiveRates() {
    const silverEl = document.getElementById('silverRatePerGram');
    const goldEl   = document.getElementById('goldRatePerGram');
    if (silverEl) silverEl.textContent = '—';
    if (goldEl)   goldEl.textContent   = '—';

    if (silverEl || goldEl) {
        fetchAndApplyLiveRates();                      // immediate first fetch
        setInterval(fetchAndApplyLiveRates, 60000);    // refresh every 60 seconds
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
