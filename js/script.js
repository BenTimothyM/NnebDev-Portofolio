// System-matching and Persistent Theme Switcher
const html = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'dark') {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

// Theme Switch Interaction
themeToggleBtn.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
});

// Mobile Navigation Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on nav link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.reveal');
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    revealOnScroll.observe(element);
});

// Dynamic copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact Form Submission Handling using Web3Forms (Asynchronous submission)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Update UI loading state on submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                alert("Your message has been sent successfully!");
                contactForm.reset();
            } else {
                console.error(response);
                alert(res.message || "Something went wrong. Please try again.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Connection failed. Please check your network and try again.");
        })
        .then(() => {
            // Reset submit button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
});

// View More Projects Toggle
const viewMoreBtn = document.getElementById('view-more-projects');
const hiddenProjects = document.getElementById('hidden-projects');
const viewMoreText = document.getElementById('view-more-text');
const viewMoreIcon = document.getElementById('view-more-icon');
let projectsExpanded = false;

viewMoreBtn.addEventListener('click', () => {
    projectsExpanded = !projectsExpanded;
    hiddenProjects.classList.toggle('hidden');
    viewMoreText.textContent = projectsExpanded ? 'View Less' : 'View More';
    viewMoreIcon.style.transform = projectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)';

    // Re-initialize Lucide icons for newly visible elements
    if (projectsExpanded) {
        lucide.createIcons();
    }
});

// Initialize Lucide Icons
lucide.createIcons();