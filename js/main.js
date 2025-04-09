import Carousel from './carousel.js';

// Core functionality that needs to load immediately
function initializeCore() {
    // Generate CSRF token on page load
    generateCSRFToken();
    
    // Initialize Carousel
    const carousel = new Carousel();
    
    // Parallax Effect for Hero Section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if href is just "#" or for modals
            if (!href || href === '#' || href === '#login' || href === '#signup') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal Handling
function initializeModals() {
    // Get all modal triggers
    const modalTriggers = document.querySelectorAll('a[href="#login"], a[href="#signup"], .get-started-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    // Show modal function
    function showModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Hide modal function
    function hideModal(modal) {
        modal.style.display = 'none';
    }

    // Hide all modals
    function hideAllModals() {
        modals.forEach(modal => hideModal(modal));
    }

    // Add click handlers to all modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllModals();
            const modalId = trigger.getAttribute('href');
            showModal(modalId);
        });
    });

    // Add click handlers to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideAllModals();
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideAllModals();
            }
        });
    });

    // Handle switching between modals
    document.querySelectorAll('.form-footer a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllModals();
            const modalId = link.getAttribute('href');
            showModal(modalId);
        });
    });
}

// Generate CSRF token
function generateCSRFToken() {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    document.cookie = `csrfToken=${token}; path=/; secure; samesite=strict; max-age=3600`;
    return token;
}

// Get CSRF token
function getCSRFToken() {
    return getCookie('csrfToken') || generateCSRFToken();
}

// Form Submission Handlers
function initializeForms() {
    // Login form handler
    const loginForm = document.querySelector('#login .auth-form');
    if (loginForm) {
        // Add CSRF token to form
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfToken';
        csrfInput.value = getCSRFToken();
        loginForm.appendChild(csrfInput);
        
        // Add input validation
        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');
        
        // Email validation
        emailInput.addEventListener('input', () => {
            validateEmail(emailInput);
        });
        
        // Password validation
        passwordInput.addEventListener('input', () => {
            validatePassword(passwordInput);
        });
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;
            const csrfToken = loginForm.querySelector('input[name="csrfToken"]').value;
            
            // Validate CSRF token
            if (csrfToken !== getCSRFToken()) {
                showError('Invalid form submission. Please try again.');
                return;
            }
            
            // Validate inputs
            if (!validateEmail(emailInput) || !validatePassword(passwordInput)) {
                return;
            }
            
            if (email && password) {
                // Set auth token and user data using secure cookies
                document.cookie = `authToken=demo-token; path=/; secure; samesite=strict; max-age=3600`;
                document.cookie = `userData=${encodeURIComponent(JSON.stringify({
                    name: email.split('@')[0],
                    email: email
                }))}; path=/; secure; samesite=strict; max-age=3600`;
                
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Signup form handler
    const signupForm = document.querySelector('#signup .auth-form');
    if (signupForm) {
        // Add CSRF token to form
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfToken';
        csrfInput.value = getCSRFToken();
        signupForm.appendChild(csrfInput);
        
        // Add input validation
        const nameInput = signupForm.querySelector('input[type="text"]');
        const emailInput = signupForm.querySelector('input[type="email"]');
        const passwordInput = signupForm.querySelector('input[type="password"]');
        const confirmPasswordInput = signupForm.querySelector('input[type="password"]:last-of-type');
        
        // Name validation
        nameInput.addEventListener('input', () => {
            validateName(nameInput);
        });
        
        // Email validation
        emailInput.addEventListener('input', () => {
            validateEmail(emailInput);
        });
        
        // Password validation
        passwordInput.addEventListener('input', () => {
            validatePassword(passwordInput);
            validatePasswordMatch(passwordInput, confirmPasswordInput);
        });
        
        // Confirm password validation
        confirmPasswordInput.addEventListener('input', () => {
            validatePasswordMatch(passwordInput, confirmPasswordInput);
        });
        
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const csrfToken = signupForm.querySelector('input[name="csrfToken"]').value;
            
            // Validate CSRF token
            if (csrfToken !== getCSRFToken()) {
                showError('Invalid form submission. Please try again.');
                return;
            }
            
            // Validate inputs
            if (!validateName(nameInput) || 
                !validateEmail(emailInput) || 
                !validatePassword(passwordInput) || 
                !validatePasswordMatch(passwordInput, confirmPasswordInput)) {
                return;
            }
            
            if (password === confirmPassword) {
                // Set auth token and user data using secure cookies
                document.cookie = `authToken=demo-token; path=/; secure; samesite=strict; max-age=3600`;
                document.cookie = `userData=${encodeURIComponent(JSON.stringify({
                    name: name,
                    email: email
                }))}; path=/; secure; samesite=strict; max-age=3600`;
                
                window.location.href = 'dashboard.html';
            }
        });
    }
}

// Input validation functions
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
        showInputError(input, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showInputError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearInputError(input);
    return true;
}

function validatePassword(input) {
    const password = input.value;
    
    if (!password) {
        showInputError(input, 'Password is required');
        return false;
    }
    
    if (password.length < 8) {
        showInputError(input, 'Password must be at least 8 characters long');
        return false;
    }
    
    if (!/[A-Z]/.test(password)) {
        showInputError(input, 'Password must contain at least one uppercase letter');
        return false;
    }
    
    if (!/[a-z]/.test(password)) {
        showInputError(input, 'Password must contain at least one lowercase letter');
        return false;
    }
    
    if (!/[0-9]/.test(password)) {
        showInputError(input, 'Password must contain at least one number');
        return false;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
        showInputError(input, 'Password must contain at least one special character');
        return false;
    }
    
    clearInputError(input);
    return true;
}

function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showInputError(confirmPasswordInput, 'Passwords do not match');
        return false;
    }
    
    clearInputError(confirmPasswordInput);
    return true;
}

function validateName(input) {
    const name = input.value.trim();
    
    if (!name) {
        showInputError(input, 'Name is required');
        return false;
    }
    
    if (name.length < 2) {
        showInputError(input, 'Name must be at least 2 characters long');
        return false;
    }
    
    clearInputError(input);
    return true;
}

function showInputError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('error');
}

function clearInputError(input) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.classList.remove('error');
}

// Show error message
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Helper function to delete cookie
function deleteCookie(name) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCore();
    initializeModals();
    initializeForms();
}); 