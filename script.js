
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

        if (introVideo.currentSrc.includes(correctSrc)) return;

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

        if (homeVideo.src.includes(correctSrc)) return;

        homeVideo.innerHTML = `
            <source src="${correctSrc}" type="video/mp4">
        `;

        homeVideo.load();
        homeVideo.play();
    }

    setHomeVideoSource();
    window.addEventListener("resize", setHomeVideoSource);
}

/* PICKUP DROPDOWN */
pickupBtn.onclick = () => {
    pickupDropdown.style.display =
        pickupDropdown.style.display === "flex" ? "none" : "flex";
};

/* HORIZONTAL SCROLL (DESKTOP) */
const wrapper = document.getElementById("pagesWrapper");

wrapper.addEventListener("wheel", (e) => {
    if (window.innerWidth > 900) {
        e.preventDefault();
        wrapper.scrollLeft += e.deltaY;
    }
}, { passive: false });

/* DOT INDICATORS */
const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".dot");

function updateDots() {
    let index;

    if (window.innerWidth > 900) {
        index = Math.round(wrapper.scrollLeft / wrapper.clientWidth);
    } else {
        index = Math.round(wrapper.scrollTop / wrapper.clientHeight);
    }

    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

wrapper.addEventListener("scroll", updateDots);

/* HAMBURGER MENU */
hamburger.onclick = () => {
    sidebar.classList.toggle("open");
};

/* MENU LINKS NAVIGATION */
document.querySelectorAll(".menu-item").forEach((item, i) => {
    item.onclick = () => {
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

        sidebar.classList.remove("open");
    };
});

/* FADE IN SECTIONS WHEN VISIBLE */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.35 });

pages.forEach(page => {
    page.classList.add("fade-section");
    page.querySelectorAll("*").forEach(child => {
        child.classList.add("fade-section");
        observer.observe(child);
    });
    observer.observe(page);
});

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

serviceThumbs.forEach(thumb => {
    thumb.addEventListener("mouseenter", () => {
        hoverLabel.textContent = thumb.dataset.label;
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
