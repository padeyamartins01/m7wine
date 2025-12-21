/* =========================
   INTRO VIDEO (SESSION SAFE)
   ========================= */

const introContainer = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");

// ✅ sessionStorage = once per visit, across pages
const hasSeenIntro = sessionStorage.getItem("m7_intro_seen");

// ✅ Skip intro when coming back from external sites
if (
  document.referrer &&
  !document.referrer.includes(window.location.hostname)
) {
  sessionStorage.setItem("m7_intro_seen", "true");
}

if (introContainer && introVideo && !hasSeenIntro) {
  document.body.style.overflow = "hidden";

  // Set correct video source
  introVideo.src = window.matchMedia("(max-width: 768px)").matches
    ? "pictures/ani2_mobile.mp4"
    : "pictures/ani2.mp4";

  introVideo.muted = true;
  introVideo.playsInline = true;
  introVideo.preload = "auto";
  introVideo.load();

  let hasStarted = false;
  let hasExited = false;

  function exitIntro() {
    if (hasExited) return;
    hasExited = true;

    // 🔥 Immediately unblock UI
    introContainer.style.pointerEvents = "none";
    introContainer.style.zIndex = "-1";
    introContainer.classList.add("fade-out");

    setTimeout(() => {
      introContainer.remove();
      document.body.style.overflow = "";
      sessionStorage.setItem("m7_intro_seen", "true");
    }, 800);
  }

  // Try autoplay
  introVideo
    .play()
    .then(() => {
      hasStarted = true;
    })
    .catch(() => {
      // Tap to start playback
      introContainer.addEventListener(
        "click",
        () => {
          introVideo.play().then(() => {
            hasStarted = true;
          });
        },
        { once: true }
      );
    });

  // Exit when video finishes
  introVideo.onended = exitIntro;

  // ⛑️ FAILSAFE — never trap the user
  setTimeout(() => {
    if (!hasStarted) exitIntro();
  }, 2000);
} else if (introContainer) {
  // Already seen → remove instantly
  introContainer.remove();
}

/* =========================
   PREVENT INTRO ON INTERNAL NAV
   ========================= */

document.querySelectorAll("a[href]").forEach(link => {
  const href = link.getAttribute("href");

  if (
    href &&
    !href.startsWith("#") &&
    !href.startsWith("http") &&
    !href.startsWith("mailto") &&
    !href.startsWith("tel")
  ) {
    link.addEventListener("click", () => {
      sessionStorage.setItem("m7_intro_seen", "true");
    });
  }
});

/* =========================
   MOBILE NAV TOGGLE
   ========================= */

const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      navToggle.classList.remove("open");
      document.body.classList.remove("nav-open");
    });
  });
}

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
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =========================
   PICKUP DROPDOWN
   ========================= */

const pickupToggle = document.getElementById("pickupToggle");
const pickupDropdown = pickupToggle?.closest(".pickup-dropdown");

if (pickupToggle && pickupDropdown) {
  pickupToggle.addEventListener("click", e => {
    e.stopPropagation();
    pickupDropdown.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    pickupDropdown.classList.remove("open");
  });
}

/* =========================
   CHATBOT TOGGLE
   ========================= */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotContainer = document.getElementById("chatbot-container");
const contactSection = document.getElementById("contact");

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.toggle("open");
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("open");
  });
}

/* =========================
   PIN CHATBOT AT CONTACT
   ========================= */

if (chatbotContainer && contactSection) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        chatbotContainer.classList.add("pinned");

        const rect = contactSection.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        chatbotContainer.style.top =
          scrollTop +
          rect.bottom -
          chatbotContainer.offsetHeight -
          24 +
          "px";
      } else {
        chatbotContainer.classList.remove("pinned");
        chatbotContainer.style.top = "";
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(contactSection);
}

/* =========================
   CHATBOT MESSAGES
   ========================= */

const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.querySelector(".chatbot-messages");

if (chatbotForm && chatbotInput && chatbotMessages) {
  chatbotForm.addEventListener("submit", e => {
    e.preventDefault();

    const message = chatbotInput.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = message;
    chatbotMessages.appendChild(userMsg);

    chatbotInput.value = "";
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "bot-msg";
      botMsg.textContent = getBotReply(message);
      chatbotMessages.appendChild(botMsg);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 600);
  });
}

function getBotReply(text) {
  const msg = text.toLowerCase();

  if (msg.includes("pricing") || msg.includes("cost")) {
    return "Pricing depends on volume, services, and destination states. A team member can follow up with details.";
  }

  if (msg.includes("pickup")) {
    return "We offer winery, customer, and distributor pickups. Scheduling is available directly from the site.";
  }

  if (msg.includes("shipping")) {
    return "We specialize in compliant DTC, international, and distributor shipping solutions.";
  }

  return "Thanks for reaching out! A logistics specialist can follow up with more details.";
}
