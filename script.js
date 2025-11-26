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

/* DOT UPDATES */
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

/* HAMBURGER */
hamburger.onclick = () => {
    sidebar.classList.toggle("open");
};

/* MENU LINKS → SCROLL TO SECTIONS */
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
