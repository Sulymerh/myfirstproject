// Find the shared navigation controls used on every page.
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
let lastScrollPosition = window.scrollY;

// Open and close the mobile navigation menu.
if (menuToggle && navLinks) {
    const menuIcon = menuToggle.querySelector('i');
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuIcon.classList.toggle('fa-bars', !isOpen);
        menuIcon.classList.toggle('fa-xmark', isOpen);
    });

    // Close the mobile menu after choosing a page link.
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-xmark');
        });
    });

    // Close the mobile menu when the visitor clicks outside it.
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('open') && !navLinks.contains(event.target)) {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-xmark');
        }
    });
}

// Hide the header while scrolling down and reveal it while scrolling up.
window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    if (header) header.classList.toggle('hidden', currentScrollPosition > lastScrollPosition && currentScrollPosition > 80);
    if (backToTop) backToTop.classList.toggle('show', currentScrollPosition > 400);
    lastScrollPosition = currentScrollPosition;
}, { passive: true });

// Return the visitor to the top of the current page.
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Confirm the contact form submission while no server is connected yet.
if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        formStatus.textContent = 'Thank you. Your message is ready to send.';
        contactForm.reset();
    });
}
