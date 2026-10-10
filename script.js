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

// Handle contact form submission asynchronously via Web3Forms
if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formStatus.textContent = 'Sending message...';
        
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            
            const result = await response.json();
            
            if (response.status === 200) {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                formStatus.textContent = result.message || 'Something went wrong. Please try again.';
            }
        } catch (error) {
            console.error(error);
            formStatus.textContent = 'Failed to send message. Please check your network connection.';
        }
    });
}
