/* INTRO VIDEO */
const introContainer = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");
const page = document.getElementById("page-content");

const hasSeenIntro = sessionStorage.getItem("m7_intro_seen");

if (
  document.referrer &&
  !document.referrer.includes(window.location.hostname)
) {
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

  function exitIntro() {
    if (exited) return;
    exited = true;

    introContainer.classList.add("fade-out");

    setTimeout(() => {
      introContainer.remove();
      document.body.style.overflow = "";
      sessionStorage.setItem("m7_intro_seen", "true");

      page.classList.remove("page-hidden");
      page.classList.add("page-visible");
    }, 800);
  }

  introVideo.play().catch(() => {
    introContainer.addEventListener("click", () => introVideo.play(), { once: true });
  });

  introVideo.onended = exitIntro;

  setTimeout(exitIntro, 2500);
} else {
  introContainer?.remove();
  page.classList.remove("page-hidden");
  page.classList.add("page-visible");
}

/* MOBILE NAV */
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle?.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  navToggle.classList.toggle("open");
});

/* HERO SLIDESHOW */
const slides = document.querySelectorAll(".hero-slideshow img");
let i = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 5000);
}

/* FOOTER YEAR */
document.getElementById("year").textContent = new Date().getFullYear();

/* PICKUP DROPDOWN */
const pickupToggle = document.getElementById("pickupToggle");
pickupToggle?.addEventListener("click", e => {
  e.stopPropagation();
  pickupToggle.closest(".pickup-dropdown").classList.toggle("open");
});
document.addEventListener("click", () => {
  document.querySelector(".pickup-dropdown")?.classList.remove("open");
});

/* =========================
   CHATBOT TOGGLE (FIX)
   ========================= */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.toggle("open");
  });
}

if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("open");
  });
}

