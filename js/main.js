// ============================================
// G UNIT SECURITY - Main JavaScript
// ============================================

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle?.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navMenu?.classList.toggle('active');
  document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// STAT COUNTER ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const animateCounter = (element) => {
  const target = parseInt(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * easeOut);
    
    element.innerHTML = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.innerHTML = target + suffix;
    }
  };
  
  requestAnimationFrame(update);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contact-form');
const quoteForm = document.getElementById('quote-form');

const handleFormSubmit = (form, formName) => {
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML;
    
    if (submitBtn) {
      submitBtn.innerHTML = 'SENDING...';
      submitBtn.disabled = true;
    }
    
    // Simulate sending (you can integrate real backend here)
    setTimeout(() => {
      // Show success state
      if (submitBtn) {
        submitBtn.innerHTML = '✓ MESSAGE SENT';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      }
      
      // Show success modal or message
      showNotification('Thank you! Our team will contact you shortly.', 'success');
      
      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }
      }, 3000);
    }, 1500);
  });
};

handleFormSubmit(contactForm, 'contact');
handleFormSubmit(quoteForm, 'quote');

// ============================================
// NOTIFICATION SYSTEM
// ============================================
const showNotification = (message, type = 'success') => {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <div class="notif-icon">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    </div>
    <div class="notif-content">
      <p>${message}</p>
    </div>
    <button class="notif-close">×</button>
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => notif.classList.add('show'), 100);
  
  const close = () => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 400);
  };
  
  notif.querySelector('.notif-close')?.addEventListener('click', close);
  setTimeout(close, 5000);
};

// Notification styles
const notifStyles = document.createElement('style');
notifStyles.textContent = `
  .notification {
    position: fixed;
    top: 100px;
    right: 2rem;
    background: linear-gradient(145deg, #1a2342, #0f1629);
    border: 1px solid rgba(200, 16, 46, 0.3);
    border-radius: 4px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 400px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }
  .notification.show { transform: translateX(0); }
  .notification.success { border-color: #10b981; }
  .notif-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .notif-content p {
    color: white;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
  }
  .notif-close {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.25rem;
    line-height: 1;
  }
  .notif-close:hover { color: white; }
  @media (max-width: 480px) {
    .notification { left: 1rem; right: 1rem; max-width: unset; }
  }
`;
document.head.appendChild(notifStyles);

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ============================================
// YEAR IN FOOTER
// ============================================
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
