/**
 * Portfolio Interactive Scripts
 * Features: Dark/Light Mode, Mobile Navigation, Scroll Spy, Typing Effect,
 * Project Filters, Form Validation with Toast Notification, Back to Top.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Dynamic Year
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 2. Dark / Light Theme Toggle with LocalStorage
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme in localStorage or system preferences
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // =========================================================================
  // 3. Mobile Navigation Menu Toggle
  // =========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'ri-close-line' : 'ri-menu-4-line';
      }
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const icon = mobileToggleBtn.querySelector('i');
          if (icon) icon.className = 'ri-menu-4-line';
          mobileToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) icon.className = 'ri-menu-4-line';
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) icon.className = 'ri-menu-4-line';
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 4. Scroll Spy (Active Navigation Item Highlighting)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');

  const scrollSpy = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy, { passive: true });

  // =========================================================================
  // 5. Hero Dynamic Typing Effect
  // =========================================================================
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'Full-Stack Developer',
      'UI/UX Enthusiast',
      'JavaScript Specialist',
      'Creative Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of word
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    typeLoop();
  }

  // =========================================================================
  // 6. Project Filter Tabs
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // =========================================================================
  // 7. Contact Form Handling & Client-side Validation
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message, isSuccess = true) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.style.background = isSuccess ? '#10b981' : '#ef4444';
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');

    // Error helper
    const setError = (elementId, message) => {
      const errEl = document.getElementById(elementId);
      if (errEl) errEl.textContent = message;
    };

    const clearErrors = () => {
      ['name-error', 'email-error', 'subject-error', 'message-error'].forEach((id) => setError(id, ''));
    };

    // Email format validator
    const isValidEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError('name-error', 'Please enter your name.');
        hasError = true;
      } else if (nameInput.value.trim().length < 2) {
        setError('name-error', 'Name must be at least 2 characters long.');
        hasError = true;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError('email-error', 'Please enter your email address.');
        hasError = true;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError('email-error', 'Please enter a valid email address.');
        hasError = true;
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError('subject-error', 'Please provide a subject.');
        hasError = true;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError('message-error', 'Please write your message.');
        hasError = true;
      } else if (messageInput.value.trim().length < 10) {
        setError('message-error', 'Message should be at least 10 characters.');
        hasError = true;
      }

      if (hasError) return;

      // Simulation of submission
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="ri-loader-4-line ri-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.');
      }, 1200);
    });
  }

  // =========================================================================
  // 8. Back To Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
