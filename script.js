//lowkey just working javascript interaction to switch the site's color theme.
const button = document.querySelector('#themeButton');
button.addEventListener('click', () => {
    const light = document.body.classList.toggle('light');
    button.textContent = light ? 'Dark mode' : 'Light mode';
    button.setAttribute('aria-pressed', String(light));

});

//for the mobile people
const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');
menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
});
mobileNav.addEventListener('click', e => {
    if (e.target.closest('a')) {
        mobileNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
    }
});

//demo contact cuz im not giving out my personal info or getting spammed..
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
contactForm.addEventListener('input', () => {
    formStatus.textContent = contactForm.checkValidity() ? 'All fields look good.' : 'Complete all fields with a valid email.';
});
contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.textContent = 'Valid! Demo only: nothing was sent.';
    contactForm.reset();
});
