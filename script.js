/* =========================
   INTRO ANIMATION LOGIC
   ========================= */

const introContainer = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");

const hasSeenIntro = localStorage.getItem("m7_intro_seen");

if (introContainer && introVideo) {
  if (hasSeenIntro) {
    introContainer.remove();
    document.body.style.overflow = "";
  } else {
    document.body.style.overflow = "hidden";

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      introVideo.src = "pictures/ani2_mobile.mp4";
    }

    introVideo.load();
    introVideo.play().catch(() => {});

    introVideo.onended = () => {
      introContainer.classList.add("fade-out");

      setTimeout(() => {
        introContainer.remove();
        document.body.style.overflow = "";
        localStorage.setItem("m7_intro_seen", "true");
      }, 900);
    };

    introContainer.addEventListener("click", () => {
      introContainer.classList.add("fade-out");

      setTimeout(() => {
        introContainer.remove();
        document.body.style.overflow = "";
        localStorage.setItem("m7_intro_seen", "true");
      }, 600);
    });
  }
}



const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
});

/* Close menu on link click */
mobileNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    navToggle.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

/* HERO SLIDESHOW */
const slides = document.querySelectorAll(".hero-slideshow img");
let slideIndex = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 5000);
}

/* Footer year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* PICKUP DROPDOWN */
const pickupToggle = document.getElementById("pickupToggle");
const pickupMenu = document.getElementById("pickupMenu");
const pickupDropdown = pickupToggle?.closest(".pickup-dropdown");

if (pickupToggle && pickupDropdown) {
  pickupToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    pickupDropdown.classList.toggle("open");
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    pickupDropdown.classList.remove("open");
  });
}

/* CHATBOT TOGGLE */
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotContainer = document.getElementById("chatbot-container");
const contactSection = document.getElementById("contact");

chatbotToggle.addEventListener("click", () => {
  chatbotPanel.classList.toggle("open");
});

chatbotClose.addEventListener("click", () => {
  chatbotPanel.classList.remove("open");
});

/* PIN CHATBOT AT CONTACT SECTION */
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      // Switch to absolute so it stops before footer
      chatbotContainer.classList.add("pinned");

      const contactRect = contactSection.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      chatbotContainer.style.top =
        scrollTop +
        contactRect.bottom -
        chatbotContainer.offsetHeight -
        24 +
        "px";
    } else {
      chatbotContainer.classList.remove("pinned");
      chatbotContainer.style.top = "";
    }
  },
  {
    threshold: 0.15,
  }
);

observer.observe(contactSection);

/* CHATBOT LOGIC */
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.querySelector(".chatbot-messages");

if (chatbotForm) {
  chatbotForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 🚫 stop page reload

    const message = chatbotInput.value.trim();
    if (!message) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = message;
    chatbotMessages.appendChild(userMsg);

    chatbotInput.value = "";
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Fake AI response (replace later with real backend)
    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "bot-msg";
      botMsg.textContent = getBotReply(message);
      chatbotMessages.appendChild(botMsg);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 600);
  });
}

/* SIMPLE PLACEHOLDER RESPONSES */
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



