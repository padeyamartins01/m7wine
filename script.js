/* -------------------------------------------------
   INTRO — PREVENT FLASH ON RELOAD
------------------------------------------------- */

const intro = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");

const introMobileSrc  = "pictures/ani2_mobile.mp4";
const introDesktopSrc = "pictures/ani2.mp4";

const fadeOrder = [
    document.getElementById("sidebar"),
    document.querySelector(".social-icons"),
    document.querySelector(".top-right-login"),
    document.getElementById("dots"),
    document.querySelector(".circle-btn"),
    document.getElementById("pagesWrapper"),
    document.getElementById("hamburger")
];

function revealUI(immediate = false) {
    if (immediate) {
        intro.style.display = "none";
    } else {
        intro.style.opacity = 0;
        setTimeout(() => intro.style.display = "none", 700);
    }

    fadeOrder.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
            el.classList.remove("hidden");
            el.classList.add("fade-in");
        }, immediate ? 0 : i * 150);
    });
}

/* -------------------------------------------------
   SKIP INTRO (NO FLASH)
------------------------------------------------- */

if (sessionStorage.getItem("introPlayed")) {
    // 🔑 HARD STOP video before it can render
    introVideo.pause();
    introVideo.removeAttribute("autoplay");
    introVideo.removeAttribute("src");
    introVideo.innerHTML = "";

    revealUI(true); // immediate, no fade
}

/* -------------------------------------------------
   PLAY INTRO (FIRST LOAD ONLY)
------------------------------------------------- */
else {
    function setIntroVideoSource() {
        const isMobile = window.innerWidth <= 900;
        const correctSrc = isMobile ? introMobileSrc : introDesktopSrc;

        if (introVideo.currentSrc && introVideo.currentSrc.includes(correctSrc)) return;

        introVideo.innerHTML = `
            <source src="${correctSrc}" type="video/mp4">
        `;
        introVideo.load();
    }

    setIntroVideoSource();

    introVideo.onended = () => {
        sessionStorage.setItem("introPlayed", "true");
        revealUI();
    };

    window.addEventListener("resize", setIntroVideoSource);
}

/* ---------------------------------------------------------
   🔥 HOME VIDEO DESKTOP / MOBILE SWITCH
--------------------------------------------------------- */

const homeVideo = document.querySelector(".home-bg-video");

if (homeVideo) {
    const mobileVersion = "pictures/STG_flashmobile.mp4";
    const desktopVersion = "pictures/STG_flash.mp4";

    function setHomeVideoSource() {
        const isMobile = window.innerWidth <= 900;
        const correctSrc = isMobile ? mobileVersion : desktopVersion;

        if (homeVideo.currentSrc && homeVideo.currentSrc.includes(correctSrc)) return;

        homeVideo.innerHTML = `
            <source src="${correctSrc}" type="video/mp4">
        `;

        homeVideo.load();
        // play() can throw if user hasn't interacted; safe-guard it
        const p = homeVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
    }

    setHomeVideoSource();
    window.addEventListener("resize", setHomeVideoSource);
}

/* PICKUP DROPDOWN */
const pickupBtn = document.getElementById("pickupBtn");
const pickupDropdown = document.getElementById("pickupDropdown");

if (pickupBtn && pickupDropdown) {
    pickupBtn.onclick = () => {
        pickupDropdown.style.display =
            pickupDropdown.style.display === "flex" ? "none" : "flex";
    };
}

/* HORIZONTAL SCROLL (DESKTOP) */
const wrapper = document.getElementById("pagesWrapper");

if (wrapper) {
    wrapper.addEventListener("wheel", (e) => {
        if (window.innerWidth > 900) {
            e.preventDefault();
            wrapper.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}

/* DOT INDICATORS */
const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".dot");

function updateDots() {
    if (!wrapper) return;

    let index;

    if (window.innerWidth > 900) {
        index = Math.round(wrapper.scrollLeft / wrapper.clientWidth);
    } else {
        index = Math.round(wrapper.scrollTop / wrapper.clientHeight);
    }

    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

if (wrapper) {
    wrapper.addEventListener("scroll", updateDots);
}

/* HAMBURGER MENU */
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

if (hamburger && sidebar) {
    hamburger.onclick = () => {
        sidebar.classList.toggle("open");
    };
}

/* MENU LINKS NAVIGATION */
document.querySelectorAll(".menu-item").forEach((item, i) => {
    item.onclick = () => {
        if (!wrapper) return;

        if (window.innerWidth > 900) {
            wrapper.scrollTo({
                left: i * wrapper.clientWidth,
                behavior: "smooth"
            });
        } else {
            wrapper.scrollTo({
                top: i * wrapper.clientHeight,
                behavior: "smooth"
            });
        }

        if (sidebar) sidebar.classList.remove("open");
    };
});

/* ---------------------------------------------------------
   ABOUT SECTION SCROLL + TYPE (hooks into SAME observer)
--------------------------------------------------------- */

function isMobile() {
    return window.innerWidth <= 900;
}


const aboutSection = document.querySelector("#about-us");
const aboutHeader = document.querySelector(".about-header");
const aboutEm = document.querySelector(".about-us-text p em");

let aboutPlayed = false;

function splitTextIntoLines(element) {
    const text = element.innerText.trim();
    element.innerHTML = "";

    // Create a measuring span to prevent "offsetWidth is 0" issues
    const measurer = document.createElement("span");
    measurer.style.visibility = "hidden";
    measurer.style.position = "absolute";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.pointerEvents = "none";
    document.body.appendChild(measurer);

    const words = text.split(/\s+/);
    let line = document.createElement("span");
    line.className = "about-line";
    line.style.opacity = 0;
    element.appendChild(line);

    words.forEach((word) => {
        const current = line.innerText;
        const next = (current + " " + word).trim();

        measurer.innerText = next;

        // wrap when line exceeds container width
        if (measurer.offsetWidth > element.offsetWidth && current.length > 0) {
            line = document.createElement("span");
            line.className = "about-line";
            line.style.opacity = 0;
            line.innerText = word;
            element.appendChild(line);
        } else {
            line.innerText = next;
        }
    });

    document.body.removeChild(measurer);
}

function playAboutAnimation() {
    if (aboutPlayed) return;
    aboutPlayed = true;

    if (aboutHeader) aboutHeader.classList.add("fade-in");

    // 🔹 MOBILE: fade whole paragraph
    if (isMobile()) {
        aboutEm.style.transition = "opacity 0.9s ease";
        aboutEm.style.opacity = 1;
        return;
    }

    // 🔹 DESKTOP: line-by-line
    const lines = document.querySelectorAll(".about-line");
    lines.forEach((line, i) => {
        setTimeout(() => {
            line.style.opacity = 1;
        }, i * 350);
    });
}

// Prepare About text split ONLY if About exists
if (aboutSection && aboutEm) {

    if (!isMobile()) {
        // DESKTOP: split into lines
        requestAnimationFrame(() => {
            splitTextIntoLines(aboutEm);
        });

        window.addEventListener("resize", () => {
            if (!isMobile()) {
                aboutPlayed = false;
                splitTextIntoLines(aboutEm);
            }
        });
    } else {
        // MOBILE: ensure clean text + hidden start
        aboutEm.style.opacity = 0;
    }
}


/* ---------------------------------------------------------
   FADE IN SECTIONS WHEN VISIBLE (SINGLE OBSERVER)
--------------------------------------------------------- */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // default fade-in behavior
        entry.target.classList.add("visible");

        // trigger about typing once About section comes into view
        if (aboutSection && entry.target === aboutSection) {
            playAboutAnimation();
        }
    });
}, { threshold: 0.35 });

// Observe pages + children
pages.forEach(page => {
    page.classList.add("fade-section");

    page.querySelectorAll("*").forEach(child => {
        child.classList.add("fade-section");
        observer.observe(child);
    });

    observer.observe(page);
});

// Observe About section specifically (for typing trigger)
if (aboutSection) observer.observe(aboutSection);

/* ---------------------------------------------------------
   🔥 3D MODEL – DRAG TO ROTATE Z AXIS ONLY
--------------------------------------------------------- */

const bottleModel = document.getElementById("bottleModel");

if (bottleModel) {

    let dragging = false;
    let lastX = 0;
    let rotationZ = 0;

    bottleModel.addEventListener("mousedown", (e) => {
        dragging = true;
        lastX = e.clientX;
    });

    window.addEventListener("mouseup", () => dragging = false);

    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        const dx = e.clientX - lastX;
        lastX = e.clientX;
        rotationZ += dx * 0.5;

        bottleModel.style.transform = `rotateZ(${rotationZ}deg)`;
    });

    bottleModel.addEventListener("touchstart", (e) => {
        dragging = true;
        lastX = e.touches[0].clientX;
    });

    window.addEventListener("touchend", () => dragging = false);

    window.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        const dx = e.touches[0].clientX - lastX;
        lastX = e.touches[0].clientX;
        rotationZ += dx * 0.5;

        bottleModel.style.transform = `rotateZ(${rotationZ}deg)`;
    });
}

/* ----------------------------------
   SERVICE HOVER LABEL FOLLOW
---------------------------------- */

const hoverLabel = document.getElementById("hover-label");
const serviceThumbs = document.querySelectorAll(".service-thumb");

if (hoverLabel && serviceThumbs.length) {
    serviceThumbs.forEach(thumb => {
        thumb.addEventListener("mouseenter", () => {
            hoverLabel.textContent = thumb.dataset.label || "";
            hoverLabel.style.opacity = 1;
        });

        thumb.addEventListener("mouseleave", () => {
            hoverLabel.style.opacity = 0;
        });

        thumb.addEventListener("mousemove", (e) => {
            hoverLabel.style.left = e.clientX + "px";
            hoverLabel.style.top = e.clientY + "px";
        });
    });
}

/* ----------------------------------
   MOBILE SERVICE THUMB TAP CAPTIONS
---------------------------------- */

function bindMobileThumbCaptions() {
    const thumbs = document.querySelectorAll(".service-thumb");

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            thumbs.forEach(t => {
                if (t !== thumb) t.classList.remove("active");
            });
            thumb.classList.toggle("active");
        });
    });
}

if (window.innerWidth <= 900) {
    bindMobileThumbCaptions();
}
