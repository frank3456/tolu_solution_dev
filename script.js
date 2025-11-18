document.addEventListener('DOMContentLoaded', () => {
  function handleViewportChange() {
    const isDesktop = window.innerWidth >= 769;
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    if (isDesktop) {
      document.body.style.width = '100%';
      document.body.style.overflowX = 'hidden';
    }
  }

  let resizeTimeout;
  function debounceViewportChange() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleViewportChange, 100);
  }

  window.addEventListener('resize', debounceViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  window.addEventListener('load', handleViewportChange);
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 600);
    }
  };
  const preloaderTimeout = setTimeout(hidePreloader, 5000);

  window.addEventListener('load', () => {
    clearTimeout(preloaderTimeout);
    hidePreloader();
  });
  const themeToggle = document.querySelector('.theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  if (themeToggle && themeDropdown && themeOptions.length) {
    const savedTheme = localStorage.getItem('theme') || (
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    document.body.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.className = `fas ${savedTheme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;

    themeToggle.addEventListener('click', () => {
      const isExpanded = themeToggle.getAttribute('aria-expanded') === 'true';
      themeToggle.setAttribute('aria-expanded', !isExpanded);
      themeDropdown.classList.toggle('active', !isExpanded);
    });

    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        themeIcon.className = `fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
      });

      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        }
      });
    });

    document.addEventListener('click', e => {
      if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && themeDropdown.classList.contains('active')) {
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
        themeToggle.focus();
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'system') {
        const theme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeIcon.className = `fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;
      }
    });
  }
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive.toString());
        menuToggle.querySelector('i').className = `fas ${isActive ? 'fa-times' : 'fa-bars'}`;
        if (isActive) {
          const focusableElements = navLinks.querySelectorAll('a, button');
          focusableElements[0].focus();
          document.addEventListener('keydown', trapFocus);
        } else {
          document.removeEventListener('keydown', trapFocus);
        }
      }
    });

    function trapFocus(e) {
      const focusableElements = navLinks.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('i').className = 'fas fa-bars';
        document.removeEventListener('keydown', trapFocus);
      }
    });
  }
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const typewriterElement = document.querySelector('.typewriter-text');
  if (typewriterElement) {
    const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
    let i = 0;
    typewriterElement.innerHTML = '<span class="typed-text"></span><span class="modern-caret"></span>';
    const typedTextElement = typewriterElement.querySelector('.typed-text');
    function type() {
      if (i < text.length) {
        typedTextElement.textContent += text.charAt(i++);
        setTimeout(type, 100);
      }
    }
    type();
  }
  const calculateBtn = document.getElementById('calculate-btn');
  const resultDisplay = document.getElementById('result');
  if (calculateBtn && resultDisplay) {
    calculateBtn.addEventListener('click', () => {
      const revenue = parseFloat(document.getElementById('revenue').value);
      const expenses = parseFloat(document.getElementById('expenses').value);
      calculateBtn.disabled = true;
      calculateBtn.textContent = 'Calculating...';
      setTimeout(() => {
        if (isNaN(revenue) || isNaN(expenses) || revenue < 0 || expenses < 0) {
          resultDisplay.textContent = 'Error: Please enter valid positive numbers.';
          resultDisplay.style.color = '#ef4444';
        } else {
          const profit = revenue - expenses;
          if (profit >= 0) {
            resultDisplay.textContent = `Success: Your estimated monthly profit is: ₦${profit.toLocaleString()}`;
            resultDisplay.style.color = '#2dd4bf';
          } else {
            resultDisplay.textContent = `Error: You incurred a loss of: ₦${Math.abs(profit).toLocaleString()}`;
            resultDisplay.style.color = '#ef4444';
          }
        }
        calculateBtn.textContent = 'Calculate';
        calculateBtn.disabled = false;
      }, 500);
    });
  }
  const generatePaletteBtn = document.getElementById('generate-palette');
  const paletteContainer = document.getElementById('palette-container');
  const toast = document.getElementById('toast');
  let toastTimeout;
  if (generatePaletteBtn && paletteContainer && toast) {
    const palettes = [
      ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
      ['#0f172a', '#4c51bf', '#2dd4bf', '#facc15', '#f97316'],
      ['#1e293b', '#334155', '#64748b', '#cbd5e1', '#f8fafc'],
      ['#3b82f6', '#9333ea', '#f43f5e', '#22c55e', '#f59e0b'],
      ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd']
    ];
    function displayPalette() {
      paletteContainer.innerHTML = '';
      paletteContainer.classList.add('active');
      const colors = palettes[Math.floor(Math.random() * palettes.length)];
      colors.forEach(color => {
        const colorCard = document.createElement('div');
        colorCard.className = 'palette-color micro-interaction show';
        colorCard.style.backgroundColor = color;
        colorCard.setAttribute('aria-label', `Color ${color}`);
        const label = document.createElement('p');
        label.textContent = color;
        label.className = 'color-label';
        colorCard.appendChild(label);
        colorCard.addEventListener('click', () => {
          navigator.clipboard.writeText(color).then(() => {
            clearTimeout(toastTimeout);
            toast.textContent = `Success: ${color} copied!`;
            toast.classList.add('show');
            toastTimeout = setTimeout(() => {
              toast.classList.remove('show');
              toast.textContent = '';
            }, 2500);
          });
        });
        paletteContainer.appendChild(colorCard);
      });
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-palette micro-interaction';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.setAttribute('aria-label', 'Close palette');
      closeBtn.addEventListener('click', () => {
        paletteContainer.classList.remove('active');
        paletteContainer.innerHTML = '';
      });
      paletteContainer.appendChild(closeBtn);
      const copyAllBtn = document.createElement('button');
      copyAllBtn.className = 'copy-all-btn micro-interaction';
      copyAllBtn.textContent = 'Copy All Colors';
      copyAllBtn.setAttribute('aria-label', 'Copy all colors');
      copyAllBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(colors.join(', ')).then(() => {
          clearTimeout(toastTimeout);
          toast.textContent = 'Success: All colors copied!';
          toast.classList.add('show');
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = '';
          }, 2500);
        });
      });
      paletteContainer.appendChild(copyAllBtn);
    }
    generatePaletteBtn.addEventListener('click', displayPalette);
  }
  const openCheckerBtn = document.getElementById('open-checker-btn');
  const deviceModal = document.getElementById('device-modal');
  const closeModal = document.getElementById('close-modal');
  const deviceButtons = document.querySelectorAll('.device-btn');
  const siteUrlInput = document.getElementById('site-url');
  const devicePreviewContainer = document.getElementById('device-preview-container');
  if (openCheckerBtn && deviceModal && closeModal && deviceButtons.length && siteUrlInput && devicePreviewContainer) {
    openCheckerBtn.addEventListener('click', () => {
      deviceModal.style.display = 'flex';
      siteUrlInput.focus();
    });
    closeModal.addEventListener('click', () => {
      deviceModal.style.display = 'none';
      devicePreviewContainer.innerHTML = '';
    });
    window.addEventListener('click', e => {
      if (e.target === deviceModal) {
        deviceModal.style.display = 'none';
        devicePreviewContainer.innerHTML = '';
      }
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && deviceModal.style.display === 'flex') {
        deviceModal.style.display = 'none';
        devicePreviewContainer.innerHTML = '';
      }
    });
    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        const url = siteUrlInput.value.trim();
        if (!/^https?:\/\//.test(url)) {
          clearTimeout(toastTimeout);
          toast.textContent = 'Error: Please enter a valid URL (e.g., https://example.com)';
          toast.classList.add('show');
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = '';
          }, 2500);
          return;
        }
        const dimensions = {
          mobile: { width: 375, height: 667 },
          tablet: { width: 768, height: 1024 },
          desktop: { width: 1280, height: 720 }
        }[device];
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = dimensions.width;
        iframe.height = dimensions.height;
        iframe.className = 'device-frame';
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
        iframe.setAttribute('aria-label', `Preview of ${url} on ${device}`);
        iframe.onerror = () => {
          clearTimeout(toastTimeout);
          toast.textContent = 'Error: Failed to load URL. Try another site.';
          toast.classList.add('show');
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = '';
          }, 2500);
        };
        devicePreviewContainer.innerHTML = '';
        devicePreviewContainer.appendChild(iframe);
        deviceModal.style.display = 'none';
      });
    });
  }
  window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      if (window.matchMedia('(max-width: 480px)').matches) {
        gsap.config({ autoSleep: 60, force3D: false });
      }
      gsap.to('#back-to-top', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'body',
          start: '100px top',
          toggleActions: 'play none none reverse',
          toggleClass: 'show'
        }
      });
      document.querySelectorAll('.parallax-section').forEach(section => {
        const bg = section.querySelector('.hero-background') || section;
        gsap.to(bg, {
          y: '15%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
      const cards = document.querySelectorAll('.project-card, .tool-card');
      if (cards.length) {
        cards.forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          });

          card.addEventListener('mouseenter', () => {
            const isFirstCard = index === 0;
            gsap.to(card, {
              rotationX: isFirstCard ? 8 : 3,
              rotationY: isFirstCard ? 8 : 3,
              duration: 0.3,
              ease: 'power2.out'
            });
            if (isFirstCard) {
              gsap.to(card.querySelector('.btn.micro-interaction'), {
                backgroundColor: '#008c3f',
                duration: 0.3
              });
            }
            const details = card.querySelector('.project-details');
            if (details) details.setAttribute('aria-hidden', 'false');
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
            if (index === 0) {
              gsap.to(card.querySelector('.btn.micro-interaction'), {
                backgroundColor: '#00A651',
                duration: 0.3
              });
            }
            const details = card.querySelector('.project-details');
            if (details) details.setAttribute('aria-hidden', 'true');
          });
        });
      }
      gsap.utils.toArray('.connect-card').forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        });
      });

      gsap.from('.hero-content', { opacity: 0, y: 80, duration: 1, ease: 'power2.out', delay: 0.5 });
      gsap.utils.toArray('.nav-link').forEach((link, index) => {
        gsap.from(link, { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out', delay: 0.2 * index });
      });
      gsap.from('.palette-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.palette-container',
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
      gsap.from('.footer', {
        autoAlpha: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top bottom',
          toggleActions: 'play none none none'
        }
      });
    }
    if (typeof particlesJS !== 'undefined') {
      const particlesConfig = {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 2, direction: 'none', random: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
          modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      };
      particlesJS('particles-js', particlesConfig);

      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.addEventListener('mouseenter', () => {
          Object.assign(particlesConfig.particles, {
            number: { value: 100 },
            opacity: { value: 0.7 },
            size: { value: 4 },
            line_linked: { opacity: 0.5, width: 1.5 },
            move: { speed: 3 }
          });
          particlesJS('particles-js', particlesConfig);
        });
        particlesContainer.addEventListener('mouseleave', () => {
          Object.assign(particlesConfig.particles, {
            number: { value: 80 },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: { opacity: 0.4, width: 1 },
            move: { speed: 2 }
          });
          particlesJS('particles-js', particlesConfig);
        });
      }
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof gsap !== 'undefined') {
      gsap.globalTimeline.clear();
    }

    let refreshTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 200);
    });
    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal().reveal('.section', {
        distance: '20px',
        duration: 800,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 100
      });
    }
  });
});