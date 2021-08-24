const menuToggle = document.querySelector('.menu-toggle input');
const navLink = document.querySelector('.nav-link');

menuToggle.addEventListener('click', () => {
    navLink.classList.toggle('slide');
})