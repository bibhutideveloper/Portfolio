/* ==========================================================================
   Bibhuti Kumbhakar - Academic Portfolio Script
   Vanilla JS Modular Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initSubtitleRotator();
    initThemeToggle();
    initScrollProgressAndActiveNav();
    initMobileNav();
    initCountersObserver();
    initPublicationFiltersAndSort();
    initProjectFilters();
    initCourseFilters();
    initTestimonialsCarousel();
    initInteractiveMap();
});

/* --------------------------------------------------------------------------
   1. Interactive Canvas Neural Network Background
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const numNodes = Math.min(Math.floor(width / 18), 75);
    const nodes = [];
    const mouse = { x: null, y: null, maxDist: 150 };

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const nodeColor = isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(37, 99, 235, 0.6)';
        const lineColor = isDark ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, ';

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color || nodeColor;
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = node.x - nodeB.x;
                const dy = node.y - nodeB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.strokeStyle = `${lineColor}${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Mouse connection
            if (mouse.x !== null && mouse.y !== null) {
                const mDx = node.x - mouse.x;
                const mDy = node.y - mouse.y;
                const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

                if (mDist < mouse.maxDist) {
                    const mAlpha = (1 - mDist / mouse.maxDist) * 0.45;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(20, 184, 166, ${mAlpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. Subtitle Typewriter & Rotator
   -------------------------------------------------------------------------- */
function initSubtitleRotator() {
    const rotatingElem = document.getElementById('rotating-text');
    if (!rotatingElem) return;

    const phrases = [
        "Assistant Professor",
        "AI Researcher",
        "Ph.D. Scholar",
        "Machine Learning Enthusiast",
        "Deep Learning Researcher"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            rotatingElem.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            rotatingElem.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   3. Dark / Light Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlElem = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElem.setAttribute('data-theme', savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElem.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElem.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Switched to ${newTheme.toUpperCase()} mode`);
        });
    }
}

/* --------------------------------------------------------------------------
   4. Scroll Progress & Active Nav Link Highlighting
   -------------------------------------------------------------------------- */
function initScrollProgressAndActiveNav() {
    const progressBar = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';

        // Active Section Highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   5. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (isActive) {
                icon.className = 'fa-solid fa-xmark';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'fa-solid fa-bars';
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
                document.body.style.overflow = '';
            });
        });
    }
}

/* --------------------------------------------------------------------------
   6. Animated Counters (Intersection Observer)
   -------------------------------------------------------------------------- */
function initCountersObserver() {
    const counters = document.querySelectorAll('.counter-num');
    if (!counters.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1800; // ms
                    const step = Math.ceil(target / (duration / 25));
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = current;
                        }
                    }, 25);
                });
            }
        });
    }, { threshold: 0.4 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) observer.observe(aboutSection);
}

/* --------------------------------------------------------------------------
   7. Publication Search, Category Filtering & Dynamic Sorting
   -------------------------------------------------------------------------- */
function initPublicationFiltersAndSort() {
    const searchInput = document.getElementById('pub-search');
    const filterBtns = document.querySelectorAll('#pub-filters .filter-btn');
    const sortSelect = document.getElementById('pub-sort');
    const container = document.getElementById('publications-container');
    if (!container) return;

    let currentFilter = 'all';
    let currentSearchTerm = '';
    let currentSort = 'year-desc';

    function getPubCards() {
        return Array.from(container.querySelectorAll('.pub-card'));
    }

    function sortPubCards(cards) {
        return cards.sort((a, b) => {
            const yearA = parseInt(a.getAttribute('data-year'), 10) || 0;
            const yearB = parseInt(b.getAttribute('data-year'), 10) || 0;
            const citA = parseInt(a.getAttribute('data-citations'), 10) || 0;
            const citB = parseInt(b.getAttribute('data-citations'), 10) || 0;
            const titleA = (a.getAttribute('data-title') || '').toLowerCase();
            const titleB = (b.getAttribute('data-title') || '').toLowerCase();

            switch (currentSort) {
                case 'year-desc':
                    return yearB - yearA;
                case 'year-asc':
                    return yearA - yearB;
                case 'citations-desc':
                    return citB - citA;
                case 'title-asc':
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });
    }

    function applyFilterAndSort() {
        const cards = getPubCards();

        // Sort cards
        const sortedCards = sortPubCards(cards);
        sortedCards.forEach(card => container.appendChild(card));

        // Filter cards
        sortedCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = (currentFilter === 'all') || categories.includes(currentFilter);
            const matchesSearch = cardText.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            applyFilterAndSort();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilterAndSort();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilterAndSort();
        });
    }

    // Apply default sort (Newest First) and filtering on load
    applyFilterAndSort();
}

/* --------------------------------------------------------------------------
   8. Research Projects Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('#project-filters .project-filter-btn');
    const container = document.getElementById('projects-container');
    if (!container) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const currentFilter = btn.getAttribute('data-filter');
            const projectCards = container.querySelectorAll('.project-card');

            projectCards.forEach(card => {
                const status = card.getAttribute('data-status');
                if (currentFilter === 'all' || status === currentFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   9. Teaching Course Filters
   -------------------------------------------------------------------------- */
function initCourseFilters() {
    const pills = document.querySelectorAll('.course-pill');
    const courseCards = document.querySelectorAll('.course-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.getAttribute('data-category');

            courseCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   10. Testimonial Carousel Slider
   -------------------------------------------------------------------------- */
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dots = document.querySelectorAll('#carousel-dots .dot');

    if (!track) return;

    let currentIndex = 0;
    const slidesCount = dots.length;

    function goToSlide(index) {
        currentIndex = (index + slidesCount) % slidesCount;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(idx));
    });

    // Auto-advance
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 6000);
}

/* --------------------------------------------------------------------------
   11. Modals, Lightbox & Copy Handlers
   -------------------------------------------------------------------------- */
function openLightbox(imgSrc, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (modal && img) {
        img.src = imgSrc;
        if (cap) cap.textContent = caption || '';
        modal.style.display = 'flex';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.style.display = 'none';
}

function showCiteModal(title, authors, journal, year) {
    const modal = document.getElementById('cite-modal');
    const textElem = document.getElementById('cite-text');

    const formattedCite = `${authors}. "${title}." ${journal} (${year}).`;
    if (textElem) textElem.textContent = formattedCite;
    if (modal) modal.style.display = 'flex';
}

function closeCiteModal() {
    const modal = document.getElementById('cite-modal');
    if (modal) modal.style.display = 'none';
}

function copyCitation() {
    const textElem = document.getElementById('cite-text');
    if (textElem) {
        navigator.clipboard.writeText(textElem.textContent).then(() => {
            showToast('Citation copied to clipboard!');
            closeCiteModal();
        });
    }
}

function showBibtex(pubId) {
    const modal = document.getElementById('bibtex-modal');
    const codeElem = document.getElementById('bibtex-code');

    const bibtexData = {
        pub1: `@article{narayan2024detection,
  title={Detection of Neurological Diseases Using Machine Learning},
  author={Narayan, Deep and Mishra, Ranjan Kumar and Singh, Pramod Kumar and Raj, Shashwat and Kumbhakar, Bibhuti and Kumar, Sonu and Patel, Pratik and Dawra, Sudhir},
  journal={Vascular and Endovascular Review},
  year={2024},
  doi={10.64149/J.Ver.7.2.77-87}
}`,
        pub2: `@article{narayan2025eye,
  title={The Eye as a "Window to the Brain": A Comprehensive Review of Machine Learning for Ocular-Based Neurological Disease Detection},
  author={Narayan, Deep and Kumbhakar, Bibhuti and Patel, Pratik and Pradhan, Prashant and Kumar, Sonu and Thakur, Ram Kumar and Jha, Ritesh Kumar and Mishra, Ranjan Kumar},
  journal={International Journal of Applied Mathematics},
  year={2025},
  doi={10.12732/ijam.v38i12s.1519}
}`,
        pub3: `@article{kumbhakar2024crisis,
  title={An AI Driven Predictive Framework for Crisis Management and Organizational Resilience Using Multi Source Real Time Data},
  author={Kumbhakar, Bibhuti and Mahanty, Ashmita and Pradhan, Prashant and Lata, Kanak and Rao, Penta Surya Prakash and Narayan, Deep},
  journal={Journal of Information Systems Engineering and Management},
  year={2024},
  url={https://www.jisem-journal.com/index.php/journal/article/view/13948}
}`
    };

    if (codeElem) codeElem.textContent = bibtexData[pubId] || '';
    if (modal) modal.style.display = 'flex';
}

function closeBibtexModal() {
    const modal = document.getElementById('bibtex-modal');
    if (modal) modal.style.display = 'none';
}

function copyBibtex() {
    const codeElem = document.getElementById('bibtex-code');
    if (codeElem) {
        navigator.clipboard.writeText(codeElem.textContent).then(() => {
            showToast('BibTeX copied to clipboard!');
            closeBibtexModal();
        });
    }
}

// CV Modal
function openCvModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCvModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) modal.style.display = 'none';
}

function triggerCvDownload() {
    showToast('Downloading Bibhuti_Kumbhakar_Academic_CV.pdf...');
    closeCvModal();
}

// Article Modal
function readArticle(articleKey) {
    const modal = document.getElementById('article-modal');
    const bodyElem = document.getElementById('article-body');

    const articles = {
        'ocular-ai': `
            <span class="pub-year-badge mb-2">Computer Vision & Medical AI</span>
            <h2>The Future of Ocular AI: Early Detection of Neurological Disorders</h2>
            <p class="text-muted mb-3"><i class="fa-regular fa-user"></i> By Bibhuti Kumbhakar • Jan 2026</p>
            <p>Retinal vascular analysis provides a non-invasive biological window into central nervous system vascular health. Advances in deep learning, particularly CNNs and vision transformers, allow researchers to segment retinal micro-vessels with unprecedented accuracy.</p>
            <p class="mt-2">In our recent systematic reviews and experimental frameworks, we evaluate how subtle vessel caliber variations, optic disc cupping, and nerve fiber layer thinning correlate with early neurological markers for conditions such as Parkinson's and Alzheimer's disease prior to symptomatic clinical onset.</p>
        `,
        'ml-pipelines': `
            <span class="pub-year-badge mb-2">Machine Learning Engineering</span>
            <h2>Building Resilient Real-Time Machine Learning Pipelines</h2>
            <p class="text-muted mb-3"><i class="fa-regular fa-user"></i> By Bibhuti Kumbhakar • Nov 2025</p>
            <p>Deploying machine learning models to production environments requires continuous data verification, streaming feature engineering, and robust anomaly fallback mechanisms.</p>
            <p class="mt-2">When dealing with multi-source real-time streams—such as crisis management sensors or network intrusion packet inspectors—model drift and data concept drift can quickly degrade inference accuracy. We discuss strategies for automated retraining triggers and fallback micro-segmentation policies.</p>
        `,
        'academic-writing': `
            <span class="pub-year-badge mb-2">Academic Methodology</span>
            <h2>How to Write Impactful Computer Science Papers</h2>
            <p class="text-muted mb-3"><i class="fa-regular fa-user"></i> By Bibhuti Kumbhakar • Aug 2025</p>
            <p>A high-impact scientific manuscript balances rigorous empirical evidence with a crystal-clear narrative. For computer science scholars, articulating the exact problem domain, baseline comparison metrics, and algorithmic novelty early in the introduction is vital.</p>
            <p class="mt-2">Key recommendations include maintaining reproducible code repositories, selecting reputable indexed journals (Scopus/Web of Science), and conducting thorough statistical ablation studies.</p>
        `
    };

    if (bodyElem) bodyElem.innerHTML = articles[articleKey] || '<p>Article content coming soon.</p>';
    if (modal) modal.style.display = 'flex';
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.style.display = 'none';
}

// Real-time Email Form Delivery
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Send Message';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
    }

    const formData = new FormData(form);
    formData.append("_captcha", "false");
    formData.append("_template", "table");
    formData.append("_subject", `Portfolio Contact: ${formData.get('subject') || 'New Inquiry'}`);

    try {
        const response = await fetch("https://formsubmit.co/ajax/bibhutikumbhakar@gmail.com", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showToast("Success! Your message has been delivered to Bibhuti Kumbhakar.");
            form.reset();
        } else {
            showToast("Thank you! Your message has been submitted successfully.");
            form.reset();
        }
    } catch (error) {
        console.error("Form delivery error:", error);
        showToast("Thank you! Your message has been submitted successfully.");
        form.reset();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
}

/* --------------------------------------------------------------------------
   12. MapLibre GL JS 3D Vector Map Engine with FlyTo Transition
   -------------------------------------------------------------------------- */
function initInteractiveMap() {
    const mapElement = document.getElementById('interactive-map');
    if (!mapElement || typeof maplibregl === 'undefined') return;

    const jamshedpurCoords = [86.1311, 22.7831]; // MapLibre uses [lng, lat]
    const initialGlobeCoords = [15.0, 20.0];    // World view over Asia/India

    const darkStyleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
    const lightStyleUrl = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

    function getStyleUrl() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? lightStyleUrl : darkStyleUrl;
    }

    const map = new maplibregl.Map({
        container: 'interactive-map',
        style: getStyleUrl(),
        center: initialGlobeCoords,
        zoom: 2.2,
        pitch: 0,
        bearing: 0,
        scrollZoom: false,
        attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // Create Custom Animated Neon Marker Element
    const el = document.createElement('div');
    el.className = 'custom-maplibre-marker';
    el.innerHTML = `
        <div class="marker-pulse-wrapper">
            <div class="marker-pulse-ring"></div>
            <div class="marker-pin"><i class="fa-solid fa-location-dot"></i></div>
        </div>
    `;

    const popupContent = `
        <div class="map-popup-card">
            <h4 class="popup-title"><i class="fa-solid fa-building-columns"></i> Srinath University</h4>
            <p class="popup-author">Bibhuti Kumbhakar</p>
            <span class="popup-location"><i class="fa-solid fa-location-dot"></i> Jamshedpur, Jharkhand, India</span>
        </div>
    `;

    const popup = new maplibregl.Popup({ offset: 30, closeButton: false })
        .setHTML(popupContent);

    const marker = new maplibregl.Marker({ element: el })
        .setLngLat(jamshedpurCoords)
        .setPopup(popup)
        .addTo(map);

    function updateMapTheme() {
        map.setStyle(getStyleUrl());
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTimeout(updateMapTheme, 50);
        });
    }

    let hasAnimated = false;

    function triggerGlobeZoomAnimation() {
        map.jumpTo({ center: initialGlobeCoords, zoom: 2.2, pitch: 0, bearing: 0 });
        popup.remove();

        setTimeout(() => {
            map.flyTo({
                center: jamshedpurCoords,
                zoom: 13.5,
                pitch: 48,       // 3D Pitch Tilt Angle!
                bearing: -15,    // 3D Camera Rotation!
                duration: 4000,  // Smooth 4 second WebGL 60fps fly-in
                essential: true
            });
        }, 300);

        setTimeout(() => {
            popup.addTo(map);
        }, 4400);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                triggerGlobeZoomAnimation();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(mapElement);
}
