document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navigation & Header Transitions
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Responsive Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 3. Highlight Navigation Links on Scroll (Only for Home Page)
    const isHomePage = document.body.classList.contains('page-home');
    const sections = document.querySelectorAll('section');

    if (isHomePage) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Calculate trigger point
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && (href.endsWith('#' + current) || href === '#' + current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 4. Client-side Form Validation and Submission Handling
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('name').value.trim();
            const emailInput = document.getElementById('email').value.trim();
            const subjectInput = document.getElementById('subject').value.trim();
            const messageInput = document.getElementById('message').value.trim();

            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                displayFeedback('Please fill out all fields in the contact form.', 'error');
                return;
            }

            // Simulating API or email delivery service call
            displayFeedback('Sending message...', '');

fetch('https://script.google.com/macros/s/AKfycbx6qNO8uUAuQqFtKuOVSbLWDt8g3RtlZhFUKHKhUD1vqbgxT9FQVNjGPDVbl_Wzu0Y/exec', {
    method: 'POST',
    body: JSON.stringify({
        name: nameInput,
        email: emailInput,
        subject: subjectInput,
        message: messageInput
    })
})
.then(response => response.json())
.then(data => {
    displayFeedback(
        'Thank you for reaching out. Your message was successfully received.',
        'success'
    );
    contactForm.reset();
})
.catch(error => {
    displayFeedback(
        'Error sending message. Please try again.',
        'error'
    );
});

    function displayFeedback(text, type) {
        if (!formFeedback) return;
        formFeedback.innerText = text;
        formFeedback.className = 'form-feedback'; // Reset classes
        
        if (type === 'success') {
            formFeedback.classList.add('success');
        } else if (type === 'error') {
            formFeedback.classList.add('error');
        } else {
            formFeedback.classList.remove('hide');
        }
    }
});