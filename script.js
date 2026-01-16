/* =========================
   INTRO VIDEO
========================= */
const introContainer = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");
const page = document.getElementById("page-content");

const hasSeenIntro = sessionStorage.getItem("m7_intro_seen");

// If user came from outside site, skip intro
if (document.referrer && !document.referrer.includes(window.location.hostname)) {
  sessionStorage.setItem("m7_intro_seen", "true");
}

if (introContainer && introVideo && !hasSeenIntro) {
  document.body.style.overflow = "hidden";

  introVideo.src = window.matchMedia("(max-width: 768px)").matches
    ? "pictures/ani2_mobile.mp4"
    : "pictures/ani2.mp4";

  introVideo.muted = true;
  introVideo.playsInline = true;
  introVideo.load();

  let exited = false;

  function showPage() {
    page?.classList.remove("page-hidden");
    page?.classList.add("page-visible");
  }

  function exitIntro() {
    if (exited) return;
    exited = true;

    introContainer.classList.add("fade-out");

    setTimeout(() => {
      introContainer.remove();
      document.body.style.overflow = "";
      sessionStorage.setItem("m7_intro_seen", "true");
      showPage();
    }, 800);
  }

  introVideo.play().catch(() => {
    introContainer.addEventListener("click", () => introVideo.play(), { once: true });
  });

  introVideo.addEventListener("ended", exitIntro);

  // fallback auto-exit
  setTimeout(exitIntro, 2500);
} else {
  introContainer?.remove();
  page?.classList.remove("page-hidden");
  page?.classList.add("page-visible");
}

/* =========================
   PICKUP DROPDOWNS (NAV + PANEL)
========================= */
function wireDropdown(toggleId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const wrap = toggle.closest(".pickup-dropdown");
    if (!wrap) return;

    // close other dropdowns first
    document.querySelectorAll(".pickup-dropdown.open").forEach((d) => {
      if (d !== wrap) d.classList.remove("open");
    });

    wrap.classList.toggle("open");
  });
}

wireDropdown("pickupToggleNav");    // top nav dropdown button
wireDropdown("pickupTogglePanel");  // hero panel dropdown button

/* =========================
   MOBILE NAV
========================= */
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileNav?.classList.toggle("open");
  navToggle.classList.toggle("open");

  // close any open dropdowns when opening mobile nav
  document.querySelectorAll(".pickup-dropdown").forEach((d) => d.classList.remove("open"));
});

// close mobile nav when clicking a link
mobileNav?.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  mobileNav.classList.remove("open");
  navToggle?.classList.remove("open");
});

/* =========================
   GLOBAL OUTSIDE CLICK CLOSER
   - closes dropdowns + mobile nav (optional)
========================= */
document.addEventListener("click", () => {
  // close dropdowns
  document.querySelectorAll(".pickup-dropdown").forEach((d) => d.classList.remove("open"));
});

/* =========================
   HERO SLIDESHOW
========================= */
const slides = document.querySelectorAll(".hero-slideshow img");
let slideIndex = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 5000);
}

/* =========================
   FOOTER YEAR
========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   CHATBOT TOGGLE
========================= */
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");

chatbotToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  chatbotPanel?.classList.toggle("open");
});

chatbotClose?.addEventListener("click", (e) => {
  e.stopPropagation();
  chatbotPanel?.classList.remove("open");
});

// prevent clicks inside panel from closing dropdowns / bubbling weirdly
chatbotPanel?.addEventListener("click", (e) => e.stopPropagation());
