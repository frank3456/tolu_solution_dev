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
  }

  const debouncedHandleViewportChange = debounce(handleViewportChange, 100);
  window.addEventListener('resize', debouncedHandleViewportChange);
  window.addEventListener('orientationchange', debouncedHandleViewportChange);
  window.addEventListener('load', handleViewportChange);

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
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
  if (typewriterElement) {
    const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
    let i = 0;
    typewriterElement.textContent = '';
    function type() {
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i++);
        setTimeout(type, 100);
      }
    }
    type();
  } else {
    console.warn('Typewriter element (.typewriter-text) not found.');
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
          if (profit >= 0) {
            resultDisplay.textContent = `✅ Your estimated monthly profit is: ₦${profit.toLocaleString()}`;
            resultDisplay.style.color = '#2dd4bf';
          } else {
            resultDisplay.textContent = `❌ You incurred a loss of: ₦${Math.abs(profit).toLocaleString()}`;
            resultDisplay.style.color = '#ef4444';
          }
        }
        calculateBtn.textContent = 'Calculate';
        calculateBtn.disabled = false;
      }, 500);
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
            }, 2500);
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
          }, 2500);
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
          toast.textContent = '❌ Failed to load URL. Try another site.';
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
        }, 600);
      }, 5000);
      Promise.all([
        ...Array.from(document.images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          });
        }),
        ...Array.from(document.querySelectorAll('script')).map(script => {
          if (script.complete) return Promise.resolve();
          return new Promise(resolve => {
            script.addEventListener('load', resolve);
            script.addEventListener('error', resolve);
          });
        })
      ]).then(() => {
        clearTimeout(fallbackTimeout);
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }).catch(err => {
        console.warn('Error loading assets for preloader:', err);
        clearTimeout(fallbackTimeout);
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      });
    } else {
      console.warn('Preloader element (#preloader) not found.');
    }
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger);
      const isLowPerformance = navigator.userAgent.includes('Opera Mini') || window.innerWidth >= 992;
      gsap.config({ autoSleep: 60, force3D: isLowPerformance ? false : 'auto' });
      gsap.set('.footer', { autoAlpha: 1 });
      gsap.utils.toArray('.connect-card.social-link').forEach((link, index) => {
        gsap.from(link, {
          opacity: 0,
          y: 10,
          duration: isLowPerformance ? 0.4 : 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.connect-section',
            start: 'top 95%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        });
      });
      gsap.to('#back-to-top', {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'body',
          start: '100px top',
          toggleActions: 'play none none reverse'
        }
      });
      document.querySelectorAll('.parallax-section').forEach(section => {
        const bg = section.querySelector('.hero-background') || section;
        gsap.to(bg, {
          y: isLowPerformance ? '5%' : '10%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
      gsap.utils.toArray('.project-card, .tool-card').forEach(card => {
        gsap.from(card, {
          opacity: 0,
          y: isLowPerformance ? 10 : 20,
          duration: isLowPerformance ? 0.4 : 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        });
      });
      gsap.utils.toArray('.connect-card').forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: isLowPerformance ? 8 : 15,
          duration: isLowPerformance ? 0.4 : 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        });
      });
      gsap.from('.hero-content', {
        opacity: 0,
        y: isLowPerformance ? 30 : 60,
        duration: isLowPerformance ? 0.5 : 0.8,
        ease: 'power2.out',
        delay: isLowPerformance ? 0.2 : 0.4
      });
      gsap.utils.toArray('.nav-link').forEach((link, index) => {
        gsap.from(link, {
          opacity: 0,
          x: -10,
          duration: isLowPerformance ? 0.2 : 0.4,
          ease: 'power2.out',
          delay: 0.2 * index
        });
      });
      gsap.from('.palette-container', {
        opacity: 0,
        scale: 1,
        duration: isLowPerformance ? 0.4 : 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.palette-container',
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      });
      gsap.from('.footer', {
        autoAlpha: 0,
        y: isLowPerformance ? 8 : 15,
        duration: isLowPerformance ? 0.5 : 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      });
    } catch (err) {
      console.warn('Error initializing GSAP/ScrollTrigger:', err);
    }
  } else {
    console.warn('GSAP or ScrollTrigger not loaded.');
  }

  if (typeof particlesJS !== 'undefined') {
    try {
      const isOperaMini = navigator.userAgent.includes('Opera Mini');
      particlesJS('particles-js', {
        particles: {
          number: { value: isOperaMini ? 20 : window.innerWidth >= 992 ? 40 : 60, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: !isOperaMini, distance: 120, color: '#ffffff', opacity: 0.3, width: 1 },
          move: { enable: true, speed: isOperaMini ? 1 : 1.5, direction: 'none', random: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: !isOperaMini && window.innerWidth < 992, mode: 'repulse' }, onclick: { enable: !isOperaMini && window.innerWidth < 992, mode: 'push' } },
          modes: { repulse: { distance: 80 }, push: { particles_nb: 3 } }
        },
        retina_detect: true
      });
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        let timeout;
        particlesContainer.addEventListener('mouseenter', () => {
          if (isOperaMini) return;
          clearTimeout(timeout);
          particlesJS('particles-js', {
            particles: {
              number: { value: window.innerWidth >= 992 ? 50 : 80, density: { enable: true, value_area: 800 } },
              color: { value: '#ffffff' },
              shape: { type: 'circle' },
              opacity: { value: 0.6, random: true },
              size: { value: 3.5, random: true },
              line_linked: { enable: true, distance: 120, color: '#ffffff', opacity: 0.4, width: 1.2 },
              move: { enable: true, speed: 2, direction: 'none', random: false }
            },
            interactivity: {
              detect_on: 'canvas',
              events: { onhover: { enable: window.innerWidth < 992, mode: 'repulse' }, onclick: { enable: window.innerWidth < 992, mode: 'push' } },
              modes: { repulse: { distance: 80 }, push: { particles_nb: 3 } }
            },
            retina_detect: true
          });
        });
        particlesContainer.addEventListener('mouseleave', () => {
          if (isOperaMini) return;
          timeout = setTimeout(() => {
            particlesJS('particles-js', {
              particles: {
                number: { value: isOperaMini ? 20 : window.innerWidth >= 992 ? 40 : 60, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 120, color: '#ffffff', opacity: 0.3, width: 1 },
                move: { enable: true, speed: 1.5, direction: 'none', random: false }
              },
              interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: window.innerWidth < 992, mode: 'repulse' }, onclick: { enable: window.innerWidth < 992, mode: 'push' } },
                modes: { repulse: { distance: 80 }, push: { particles_nb: 3 } }
              },
              retina_detect: true
            });
          }, 300);
        });
      }
    } catch (err) {
      console.warn('Error initializing ParticlesJS:', err);
    }
  } else {
    console.warn('ParticlesJS not loaded.');
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typeof gsap !== 'undefined') {
      gsap.globalTimeline.clear();
    }
  }

  const debouncedScrollTriggerRefresh = debounce(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      try {
        ScrollTrigger.refresh();
      } catch (err) {
        console.warn('Error refreshing ScrollTrigger:', err);
      }
    }
    handleViewportChange();
  }, 100);
  window.addEventListener('resize', debouncedScrollTriggerRefresh);

  if (typeof ScrollReveal !== 'undefined') {
    try {
      ScrollReveal().reveal('.section', {
        distance: '15px',
        duration: navigator.userAgent.includes('Opera Mini') ? 500 : 600,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 80
      });
    } catch (err) {
      console.warn('Error initializing ScrollReveal:', err);
    }
  } else {
    console.warn('ScrollReveal not loaded.');
  }
});
