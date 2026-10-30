/**
 * Trattoria SOLE - Main JavaScript
 * Handles navigation, animations, smooth scroll, page transitions
 */

function initApp() {
  // Page load fade-in
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 50);

  // Header scroll detection
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  if (mobileToggle && mobileDrawer) {
    const openMenu = () => {
      mobileDrawer.classList.add('is-open');
      mobileToggle.classList.add('is-active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const toggleMenu = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Remove any previous listener by replacing clone if needed, or simple addEventListener
    mobileToggle.addEventListener('click', toggleMenu);

    if (mobileClose) {
      mobileClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    // Close when tapping outside the drawer nav
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Active navigation highlight based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Smooth page transition when clicking internal links
  const internalLinks = document.querySelectorAll('a[href$=".html"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      // If it's the current page or opening in new tab or with modifier keys, let it be default
      if (!targetUrl || targetUrl.startsWith('#') || link.target === '_blank' || e.metaKey || e.ctrlKey) {
        return;
      }
      if (targetUrl === currentPath) return;

      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 300);
    });
  });

  // Intersection Observer for scroll animations (.fade-up)
  const revealElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Menu tab switching (for menu.html)
  const tabBtns = document.querySelectorAll('.menu-nav-tabs .tab-btn');
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (targetId) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetEl.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
