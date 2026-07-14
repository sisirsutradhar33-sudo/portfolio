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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 3. Highlight Navigation Links on Scroll
    const isHomePage = document.body.classList.contains('page-home');
    const sections = document.querySelectorAll('section');

    if (isHomePage) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
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

    // 4. Contact Form Submission (Web3Forms AJAX)
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    function displayFeedback(text, type) {
        if (!formFeedback) return;
        formFeedback.innerText = text;
        formFeedback.className = 'form-feedback';
        
        if (type === 'success') {
            formFeedback.classList.add('success');
        } else if (type === 'error') {
            formFeedback.classList.add('error');
        }
        
        setTimeout(() => {
            formFeedback.classList.add('hide');
        }, 8000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // This line STOPS the browser from redirecting to the Web3Forms page
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            displayFeedback('Sending your message...', '');

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Success! Show message and clear the form
                    displayFeedback('Thank you! Your message has been sent directly to my inbox.', 'success');
                    contactForm.reset(); 
                } else {
                    displayFeedback(json.message, 'error');
                }
            })
            .catch(error => {
                displayFeedback('Something went wrong. Please email me directly.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            });
        });

        // 4B. Clear form if user ever clicks the "Back" button to return to this page
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                contactForm.reset();
            }
        });
    }

    // 5. Interactive Portfolio Modals (Pop-ups)
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const closeModalBtns = document.querySelectorAll('.modal-close');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.classList.add('modal-open');
                targetModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeModal = btn.closest('.modal-overlay');
            if (activeModal) {
                closeModal(activeModal);
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    function closeModal(modalElement) {
        modalElement.classList.remove('active');
        document.body.classList.remove('modal-open');
        modalElement.setAttribute('aria-hidden', 'true');
    }

}); // End of DOMContentLoaded