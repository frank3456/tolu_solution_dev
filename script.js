document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    themeToggle.textContent = savedTheme === 'dark' ? '☀' : '🌙';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeToggle.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      themeToggle.textContent = isDark ? '☀' : '🌙';
      themeToggle.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      menuToggle.textContent = isActive ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', isActive.toString());
    });
  }

  const typewriterElement = document.querySelector('.typewriter-text');
  if (typewriterElement) {
    const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
    let i = 0;
    typewriterElement.textContent = '';
    (function type() {
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i++);
        setTimeout(type, 100);
      }
    })();
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
          resultDisplay.textContent = '❌ Please enter valid positive numbers.';
          resultDisplay.style.color = '#ef4444';
        } else {
          const profit = revenue - expenses;
          resultDisplay.textContent = `✅ Your estimated monthly profit is: ₦${profit.toLocaleString()}`;
          resultDisplay.style.color = '#10b981';
        }
        calculateBtn.textContent = 'Calculate';
        calculateBtn.disabled = false;
      }, 500);
    });
  }

  const generatePaletteBtn = document.getElementById('generate-palette');
  const paletteContainer = document.getElementById('palette-container');
  const toast = document.getElementById('toast');
  if (generatePaletteBtn && paletteContainer && toast) {
    const palettes = [
      ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
      ['#0f172a', '#2563eb', '#10b981', '#facc15', '#f97316'],
      ['#1e293b', '#334155', '#64748b', '#cbd5e1', '#f8fafc'],
      ['#3b82f6', '#9333ea', '#f43f5e', '#22c55e', '#f59e0b'],
      ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd']
    ];

    function displayPalette() {
      const colors = palettes[Math.floor(Math.random() * palettes.length)];
      paletteContainer.innerHTML = '';
      colors.forEach(color => {
        const colorCard = document.createElement('div');
        colorCard.className = 'palette-color';
        colorCard.style.backgroundColor = color;
        colorCard.setAttribute('aria-label', `Color ${color}`);

        const label = document.createElement('p');
        label.textContent = color;
        label.className = 'color-label';
        colorCard.appendChild(label);

        colorCard.addEventListener('click', () => {
          navigator.clipboard.writeText(color).then(() => {
            toast.textContent = `✅ ${color} copied!`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
          });
        });

        paletteContainer.appendChild(colorCard);
      });
    }

    generatePaletteBtn.addEventListener('click', displayPalette);
    displayPalette();
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
    });

    window.addEventListener('click', e => {
      if (e.target === deviceModal) deviceModal.style.display = 'none';
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && deviceModal.style.display === 'flex') deviceModal.style.display = 'none';
    });

    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        const url = siteUrlInput.value.trim();

        if (!/^https?:\/\//.test(url)) {
          toast.textContent = '❌ Please enter a valid URL (e.g., https://example.com)';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
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
  }

  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }
  });
});
