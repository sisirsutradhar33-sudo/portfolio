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

    // 4. Contact Form Submission via Hidden Iframe
    // Uses native HTML form submission to a hidden iframe.
    // This completely bypasses CORS — no fetch, no XMLHttpRequest.
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby4AgyJqHti2WMsSGAf1zsEBvv6fZSSdjzcuPbBYhA6atZ_771Z9vt6pG2g8DSVmR35/exec';

    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    let feedbackTimer = null;

    function displayFeedback(text, type) {
        if (!formFeedback) return;

        // Clear any existing auto-hide timer
        if (feedbackTimer) {
            clearTimeout(feedbackTimer);
            feedbackTimer = null;
        }

        formFeedback.innerText = text;
        formFeedback.className = 'form-feedback';

        if (type === 'success') {
            formFeedback.classList.add('success');
        } else if (type === 'error') {
            formFeedback.classList.add('error');
        }

        // Auto-hide after 8 seconds for success/error messages
        if (type === 'success' || type === 'error') {
            feedbackTimer = setTimeout(() => {
                formFeedback.classList.add('hide');
            }, 8000);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const nameVal = document.getElementById('name').value.trim();
            const emailVal = document.getElementById('email').value.trim();
            const subjectVal = document.getElementById('subject').value.trim();
            const messageVal = document.getElementById('message').value.trim();
            
            // Honeypot check: If the hidden field has been filled, it is a spam bot
            const honeypotVal = document.getElementById('website_url').value;
            if (honeypotVal) {
                // Fake a successful submission so the bot thinks it worked, but exit quietly
                displayFeedback('Thank you for reaching out! Your message has been received successfully.', 'success');
                contactForm.reset();
                return;
            }

            // General empty-field validation
            if (!nameVal || !emailVal || !subjectVal || !messageVal) {
                displayFeedback('Please fill out all fields in the contact form.', 'error');
                return;
            }

            // Technical validation: Check for basic valid email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailVal)) {
                displayFeedback('Please enter a valid email address.', 'error');
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            displayFeedback('Sending your message...', '');

            // --- Hidden Iframe Approach (CORS-proof) ---
            // Create a unique iframe name to avoid conflicts
            const iframeName = 'form-iframe-' + Date.now();
            const iframe = document.createElement('iframe');
            iframe.name = iframeName;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Create a temporary hidden form that targets the iframe
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = SCRIPT_URL;
            tempForm.target = iframeName;
            tempForm.style.display = 'none';

            // Add form fields as hidden inputs
            const fields = { name: nameVal, email: emailVal, subject: subjectVal, message: messageVal };
            for (const [key, value] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                tempForm.appendChild(input);
            }

            document.body.appendChild(tempForm);

            // Track whether we've already handled the response
            let handled = false;

            function handleSuccess() {
                if (handled) return;
                handled = true;

                displayFeedback(
                    'Thank you for reaching out! Your message has been received successfully.',
                    'success'
                );
                contactForm.reset();

                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';

                // Cleanup
                cleanup();
            }

            function cleanup() {
                setTimeout(() => {
                    if (document.body.contains(iframe)) document.body.removeChild(iframe);
                    if (document.body.contains(tempForm)) document.body.removeChild(tempForm);
                }, 500);
            }

            // When iframe loads (after Google processes the form), show success
            iframe.addEventListener('load', handleSuccess);

            // Submit the hidden form
            tempForm.submit();

            // Safety timeout: if iframe load doesn't fire within 4 seconds,
            // assume success (the POST was sent, data is saved)
            setTimeout(() => {
                if (!handled) {
                    handleSuccess();
                }
            }, 4000);
        });
    }
});