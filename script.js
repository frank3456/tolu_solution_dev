document.addEventListener('DOMContentLoaded', () => {
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  let lastViewportWasDesktop = window.innerWidth >= 992; // Track initial viewport state

  function handleViewportChange() {
    const isDesktop = window.innerWidth >= 992;
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    if (isDesktop) {
      document.body.style.width = '100%';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.transform = 'scale(1)';
      document.documentElement.style.transformOrigin = '0 0';
    } else {
      document.documentElement.style.transform = 'none';
    }
    if (typeof particlesJS !== 'undefined' && window.pJSDom?.[0]?.pJS) {
      window.pJSDom[0].pJS.fn.vendors.resize();
    }
    // Restart typewriter on mobile ↔ desktop transition
    if (isDesktop !== lastViewportWasDesktop) {
      const typewriterElement = document.querySelector('.typewriter-text');
      if (typewriterElement && sessionStorage.getItem('typewriterCompleted') === 'true') {
        sessionStorage.removeItem('typewriterCompleted'); // Clear flag to allow retyping
        startTypewriter(); // Restart typewriter
      }
      lastViewportWasDesktop = isDesktop; // Update viewport state
    }
  }

  const debouncedHandleViewportChange = debounce(handleViewportChange, 100);
  window.addEventListener('resize', debouncedHandleViewportChange);
  window.addEventListener('orientationchange', debouncedHandleViewportChange);

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeToggle.textContent = savedTheme === 'dark' ? '☀' : '🌙';
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  } else {
    console.warn('Theme toggle (.theme-toggle) not found.');
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      menuToggle.textContent = isActive ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', isActive.toString());
    });
  } else {
    console.warn('Menu toggle (.menu-toggle) or nav links (.nav-links) not found.');
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    console.warn('Back to top button (#back-to-top) not found.');
  }

  const typewriterElement = document.querySelector('.typewriter-text');
  let typeTimeout; // Store timeout for clearing
  function startTypewriter() {
    if (typewriterElement) {
      const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
      let i = 0;
      let currentText = '';
      typewriterElement.textContent = '';
      typewriterElement.style.position = 'relative';
      typewriterElement.style.display = 'inline-block';
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.textContent = '|';
      typewriterElement.appendChild(cursor);

      function type() {
        currentText = text.substring(0, i + 1);
        typewriterElement.textContent = currentText;
        i++;
        if (i >= text.length) {
          sessionStorage.setItem('typewriterCompleted', 'true'); // Mark as completed
          typewriterElement.appendChild(cursor); // Ensure cursor remains
          return; // Stop typing
        }
        typeTimeout = setTimeout(type, 80);
        if (!typewriterElement.querySelector('.typewriter-cursor')) {
          typewriterElement.appendChild(cursor);
        }
      }
      typeTimeout = setTimeout(type, 1000);
    } else {
      console.warn('Typewriter element (.typewriter-text) not found.');
    }
  }

  // Check if typewriter has already run in this session
  if (typewriterElement && sessionStorage.getItem('typewriterCompleted') === 'true') {
    const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
    typewriterElement.textContent = text;
    typewriterElement.style.position = 'relative';
    typewriterElement.style.display = 'inline-block';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    typewriterElement.appendChild(cursor);
  } else {
    startTypewriter(); // Start typewriter if not completed
  }

  const calculateBtn = document.getElementById('calculate-btn');
  const resultDisplay = document.getElementById('result');
  if (calculateBtn && resultDisplay) {
    calculateBtn.addEventListener('click', () => {
      const revenueInput = document.getElementById('revenue');
      const expensesInput = document.getElementById('expenses');
      if (!revenueInput || !expensesInput) {
        console.warn('Revenue (#revenue) or expenses (#expenses) input not found.');
        return;
      }
      const revenue = parseFloat(revenueInput.value);
      const expenses = parseFloat(expensesInput.value);
      calculateBtn.disabled = true;
      calculateBtn.textContent = 'Calculating...';
      setTimeout(() => {
        if (isNaN(revenue) || isNaN(expenses) || revenue < 0 || expenses < 0) {
          resultDisplay.textContent = '❌ Please enter valid positive numbers.';
          resultDisplay.style.color = '#ef4444';
        } else {
          const profit = revenue - expenses;
          resultDisplay.textContent = profit >= 0
            ? `✅ Your estimated monthly profit is: ₦${profit.toLocaleString()}`
            : `❌ You incurred a loss of: ₦${Math.abs(profit).toLocaleString()}`;
          resultDisplay.style.color = profit >= 0 ? '#2dd4bf' : '#ef4444';
        }
        calculateBtn.textContent = 'Calculate';
        calculateBtn.disabled = false;
      }, 200);
    });
  } else {
    console.warn('Calculate button (#calculate-btn) or result display (#result) not found.');
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
            toast.textContent = `✅ ${color} copied!`;
            toast.classList.add('show');
            toastTimeout = setTimeout(() => {
              toast.classList.remove('show');
              toast.textContent = '';
            }, 2000);
          }).catch(() => {
            console.warn('Clipboard API not supported or failed.');
          });
        });
        paletteContainer.appendChild(colorCard);
      });
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-palette micro-interaction';
      closeBtn.textContent = '✕';
      closeBtn.setAttribute('aria-label', 'Close palette');
      closeBtn.style.display = 'block';
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
          toast.textContent = '✅ All colors copied!';
          toast.classList.add('show');
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = '';
          }, 2000);
        }).catch(() => {
          console.warn('Clipboard API not supported or failed.');
        });
      });
      paletteContainer.appendChild(copyAllBtn);
    }
    generatePaletteBtn.addEventListener('click', displayPalette);
  } else {
    console.warn('Palette generator elements (#generate-palette, #palette-container, #toast) not found.');
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
          toast.textContent = '❌ Please enter a valid URL (e.g., https://example.com)';
          toast.classList.add('show');
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = '';
          }, 2000);
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
        devicePreviewContainer.innerHTML = '';
        devicePreviewContainer.appendChild(iframe);
        deviceModal.style.display = 'none';
      });
    });
  } else {
    console.warn('Device checker elements (#open-checker-btn, #device-modal, #close-modal, .device-btn, #site-url, #device-preview-container) not found.');
  }

  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const fallbackTimeout = setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 400);
      }, 2500);
      Promise.all([
        ...Array.from(document.images).filter(img => !img.complete).map(img =>
          new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          })
        ),
        ...Array.from(document.querySelectorAll('script')).filter(script => !script.complete).map(script =>
          new Promise(resolve => {
            script.addEventListener('load', resolve);
            script.addEventListener('error', resolve);
          })
        )
      ]).then(() => {
        clearTimeout(fallbackTimeout);
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          handleViewportChange();
          if (typeof particlesJS !== 'undefined') {
            initParticlesJS();
          }
        }, 400);
      }).catch(err => {
        console.warn('Error loading assets for preloader:', err);
        clearTimeout(fallbackTimeout);
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          handleViewportChange();
          if (typeof particlesJS !== 'undefined') {
            initParticlesJS();
          }
        }, 400);
      });
    } else {
      console.warn('Preloader element (#preloader) not found.');
      if (typeof particlesJS !== 'undefined') {
        initParticlesJS();
      }
    }
  });

  function initParticlesJS() {
    try {
      const isOperaMini = navigator.userAgent.includes('Opera Mini');
      const isDesktop = window.innerWidth >= 992;
      particlesJS('particles-js', {
        particles: {
          number: { value: isOperaMini ? 10 : isDesktop ? 25 : 20, density: { enable: true, value_area: 1000 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          line_linked: { enable: false },
          move: { enable: true, speed: isOperaMini ? 0.5 : 1, direction: 'none', random: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: false }, onclick: { enable: false } }
        },
        retina_detect: true
      });
    } catch (err) {
      console.warn('Error initializing ParticlesJS:', err);
    }
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger);
      const isLowPerformance = navigator.userAgent.includes('Opera Mini') || window.innerWidth >= 992;
      gsap.config({ autoSleep: 120, force3D: false });
      gsap.set('.footer, .project-card, .tool-card, .connect-card', { opacity: 1, visibility: 'visible' });
      gsap.from('.connect-card.social-link', {
        autoAlpha: 0,
        y: 5,
        duration: isLowPerformance ? 0.2 : 0.3,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.connect-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
          immediateRender: true
        }
      });
      gsap.to('#back-to-top', {
        autoAlpha: 1,
        duration: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'body',
          start: '100px top',
          toggleActions: 'play none none reverse',
          immediateRender: true
        }
      });
      gsap.from('.project-card, .tool-card', {
        autoAlpha: 0,
        y: isLowPerformance ? 5 : 10,
        duration: isLowPerformance ? 0.2 : 0.3,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.projects-grid, .tools-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
          immediateRender: true
        }
      });
      gsap.from('.hero-content', {
        autoAlpha: 0,
        y: isLowPerformance ? 10 : 20,
        duration: isLowPerformance ? 0.2 : 0.3,
        ease: 'power2.out',
        delay: isLowPerformance ? 0.1 : 0.2
      });
      gsap.from('.nav-link', {
        autoAlpha: 0,
        x: -5,
        duration: isLowPerformance ? 0.1 : 0.2,
        ease: 'power2.out',
        stagger: 0.05
      });
      gsap.from('.palette-container', {
        autoAlpha: 0,
        duration: isLowPerformance ? 0.2 : 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.palette-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
          immediateRender: true
        }
      });
      gsap.from('.footer', {
        autoAlpha: 0,
        y: isLowPerformance ? 5 : 10,
        duration: isLowPerformance ? 0.2 : 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 90%',
          toggleActions: 'play none none none',
          immediateRender: true
        }
      });
      document.querySelectorAll('.parallax-section').forEach(section => {
        const bg = section.querySelector('.hero-background') || section;
        gsap.to(bg, {
          y: isLowPerformance ? '2%' : '4%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      });
    } catch (err) {
      console.warn('Error initializing GSAP/ScrollTrigger:', err);
      document.querySelectorAll('.footer, .project-card, .tool-card, .connect-card').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
    }
  } else {
    console.warn('GSAP or ScrollTrigger not loaded.');
    document.querySelectorAll('.footer, .project-card, .tool-card, .connect-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof gsap !== 'undefined') {
    gsap.globalTimeline.clear();
    document.querySelectorAll('.footer, .project-card, .tool-card, .connect-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  if (typeof ScrollReveal !== 'undefined') {
    try {
      ScrollReveal().reveal('.section', {
        distance: '5px',
        duration: navigator.userAgent.includes('Opera Mini') ? 200 : 300,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 25,
        reset: false
      });
    } catch (err) {
      console.warn('Error initializing ScrollReveal:', err);
      document.querySelectorAll('.footer, .project-card, .tool-card, .connect-card').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
    }
  } else {
    console.warn('ScrollReveal not loaded.');
    document.querySelectorAll('.footer, .project-card, .tool-card, .connect-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }
});
