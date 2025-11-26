/* ---------------------------------------------------
   INTRO FADE SEQUENCE
---------------------------------------------------*/

const intro = document.getElementById("intro-container");
const introVideo = document.getElementById("introVideo");

const fadeOrder = [
    document.getElementById("sidebar"),
    document.querySelector(".social-icons"),
    document.querySelector(".top-right-login"),
    document.getElementById("dots"),
    document.querySelector(".circle-btn"),
    document.getElementById("pagesWrapper"),
    document.getElementById("hamburger")
];

introVideo.onended = () => {
    // fade out intro
    intro.style.opacity = 0;
    setTimeout(() => intro.style.display = "none", 700);

    // fade in elements one by one
    fadeOrder.forEach((el, index) => {
        setTimeout(() => {
            el.classList.remove("hidden");
            el.classList.add("fade-in");
        }, index * 350);
    });
};


/* ---------------------------------------------------
   PICKUP DROPDOWN
---------------------------------------------------*/
pickupBtn.onclick = () => {
    pickupDropdown.style.display =
        pickupDropdown.style.display === "flex" ? "none" : "flex";
};


/* ---------------------------------------------------
   HORIZONTAL SCROLL (DESKTOP)
---------------------------------------------------*/
const wrapper = document.getElementById("pagesWrapper");

wrapper.addEventListener("wheel", (e) => {
    if (window.innerWidth > 900) {
        e.preventDefault();
        wrapper.scrollLeft += e.deltaY;
    }
}, { passive: false });


/* ---------------------------------------------------
   DOT INDICATORS
---------------------------------------------------*/

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


/* ---------------------------------------------------
   HAMBURGER MENU
---------------------------------------------------*/

hamburger.onclick = () => {
    sidebar.classList.toggle("open");
};


/* ---------------------------------------------------
   MENU LINKS SCROLL NAVIGATION
---------------------------------------------------*/

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
