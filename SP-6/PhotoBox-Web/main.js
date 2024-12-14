window.onscroll = function() {makeNavbarSticky()};

const navbar = document.querySelector("nav");
const sticky = navbar.offsetTop;

function makeNavbarSticky() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}

