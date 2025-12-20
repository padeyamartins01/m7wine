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
