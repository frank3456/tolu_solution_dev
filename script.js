document.addEventListener('DOMContentLoaded', () => {
    // Auto Light/Dark Mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
    }

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const typewriterText = "Hi, I'm a Web Developer & Economics Analyst";
    let index = 0;
    function typeWriter() {
        if (index < typewriterText.length) {
            typewriterElement.textContent += typewriterText.charAt(index);
            index++;
            setTimeout(typeWriter, 80);
        }
    }
    typeWriter();

    // Clock
    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        clockElement.textContent = `Current Time: ${timeString}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Profit Calculator
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const revenue = parseFloat(document.getElementById('revenue').value);
            const expenses = parseFloat(document.getElementById('expenses').value);
            calculateBtn.textContent = "Calculating...";
            setTimeout(() => {
                if (isNaN(revenue) || isNaN(expenses) || revenue < 0 || expenses < 0) {
                    resultDisplay.textContent = "❌ Please enter valid positive numbers.";
                } else {
                    const profit = revenue - expenses;
                    resultDisplay.textContent = `✅ Your estimated monthly profit is: ₦${profit.toLocaleString()}`;
                }
                calculateBtn.textContent = "Calculate Profit";
            }, 500);
        });
    }

    // Charts
    const inflationCanvas = document.getElementById('inflationChart');
    const fxCanvas = document.getElementById('fxChart');
    if (inflationCanvas && fxCanvas) {
        new Chart(inflationCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Inflation Rate (%)',
                    data: [28, 29, 30, 31, 32, 33],
                    backgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Monthly Inflation in Nigeria (Sample Data)' },
                    legend: { display: true }
                }
            }
        });

        new Chart(fxCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'USD/NGN Rate',
                    data: [900, 950, 1100, 1200, 1300, 1250],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Naira Exchange Rate (Sample Data)' },
                    legend: { display: true }
                }
            }
        });
    }

    // EmailJS Contact Form
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        emailjs.init({ publicKey: "PVmA9jqSgYjC1BXi3" });
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            formStatus.textContent = "Sending...";
            emailjs.sendForm('service_jro9q1h', 'template_uzpun54', this)
                .then(() => {
                    formStatus.textContent = "✅ Message sent successfully!";
                    contactForm.reset();
                })
                .catch(() => {
                    formStatus.textContent = "❌ Failed to send. Check your connection and try again.";
                });
        });
    }

    // ScrollReveal (fade-in)
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // Paragraph Typewriter
    async function typeParagraph(paragraph, speed = 40) {
        return new Promise(resolve => {
            const text = paragraph.textContent;
            paragraph.textContent = '';
            paragraph.classList.add('visible');
            let i = 0;
            const interval = setInterval(() => {
                paragraph.textContent += text.charAt(i);
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    setTimeout(resolve, 400);
                }
            }, speed);
        });
    }
    async function typeAllParagraphs() {
        const paragraphs = document.querySelectorAll('.typewriter-container p');
        for (let p of paragraphs) {
            await typeParagraph(p);
        }
    }
    typeAllParagraphs();

    // Palette Generator
    const generatePaletteBtn = document.getElementById('generate-palette');
    const paletteContainer = document.getElementById('palette-container');
    const toast = document.getElementById('toast');

    function getBalancedPalette() {
        const palettes = [
            ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
            ["#0f172a", "#2563eb", "#10b981", "#facc15", "#f97316"],
            ["#1e293b", "#334155", "#64748b", "#cbd5e1", "#f8fafc"],
            ["#3b82f6", "#9333ea", "#f43f5e", "#22c55e", "#f59e0b"],
            ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"]
        ];
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    function displayPalette() {
        const colors = getBalancedPalette();
        paletteContainer.innerHTML = '';

        colors.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.className = 'palette-color';
            colorCard.style.backgroundColor = color;
            colorCard.title = color;

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

    if (generatePaletteBtn) {
        generatePaletteBtn.addEventListener('click', displayPalette);
    }

    // Device Preview Modal
    const openCheckerBtn = document.getElementById('open-checker-btn');
    const deviceModal = document.getElementById('device-modal');
    const closeModal = document.getElementById('close-modal');
    const deviceButtons = document.querySelectorAll('.device-btn');
    const siteUrlInput = document.getElementById('site-url');
    const devicePreviewContainer = document.getElementById('device-preview-container');

    if (openCheckerBtn) {
        openCheckerBtn.addEventListener('click', () => {
            deviceModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            deviceModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === deviceModal) {
            deviceModal.style.display = 'none';
        }
    });

    deviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const device = btn.getAttribute('data-device');
            const url = siteUrlInput.value.trim();

            if (!url.startsWith('http')) {
                alert('Please enter a valid URL including https://');
                return;
            }

            let width, height;
            if (device === 'mobile') {
                width = 375; height = 667;
            } else if (device === 'tablet') {
                width = 768; height = 1024;
            } else {
                width = 1280; height = 720;
            }

            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = width;
            iframe.height = height;
            iframe.className = 'device-frame';
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');

            devicePreviewContainer.innerHTML = '';
            devicePreviewContainer.appendChild(iframe);
            deviceModal.style.display = 'none';
        });
    });
});
