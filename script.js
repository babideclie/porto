// ========================================
// Language System (Versão Melhorada)
// ========================================

const translations = {
    pt: {
        // ... todo o seu objeto pt exatamente como você colou ...
    },
    en: {
        // ... todo o seu objeto en exatamente como você colou ...
    }
};

// Idioma atual (padrão português)
let currentLang = 'pt';

// Função principal para trocar o idioma
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);

    // Atualiza todos os elementos com data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            // Para inputs/textarea, atualiza placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.setAttribute('placeholder', translations[lang][key]);
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Atualiza os botões de idioma (adiciona classe 'active' no botão correto)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Atualiza o atributo lang da tag <html>
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
}

// Inicializa o idioma na carga da página
function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const langToUse = savedLang || 'pt'; // padrão pt se não tiver salvo
    
    changeLanguage(langToUse);
}

// Gallery Carousel
let currentGalleryIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryTrack = document.querySelector('.gallery-track');

function scrollGallery(direction) {
    const itemWidth = galleryItems[0].offsetWidth + 20; // width + gap
    const visibleItems = Math.floor(galleryTrack.offsetWidth / itemWidth);
    const maxScroll = (galleryItems.length - visibleItems) * itemWidth;
    
    if (direction === 'next') {
        currentGalleryIndex = Math.min(currentGalleryIndex + 1, galleryItems.length - visibleItems);
    } else {
        currentGalleryIndex = Math.max(currentGalleryIndex - 1, 0);
    }
    
    const scrollAmount = currentGalleryIndex * itemWidth;
    galleryTrack.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
let currentLightboxIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
}));

function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImage.src = galleryImages[index].src;
    lightboxImage.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    } else {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    lightboxImage.src = galleryImages[currentLightboxIndex].src;
    lightboxImage.alt = galleryImages[currentLightboxIndex].alt;
}

// Smooth scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Mobile menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');

function toggleMobileMenu() {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
}

// Header scroll effect
let lastScroll = 0;
function handleScroll() {
    const header = document.getElementById('header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 30px rgba(0, 9, 133, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 9, 133, 0.1)';
    }
    
    lastScroll = currentScroll;
}

// Fade-in on scroll animation
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.refugio-card, .dica-card, .historia-content, .contato-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Here you would normally send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message (you can customize this)
    alert(currentLang === 'pt' 
        ? 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
        : 'Message sent successfully! We will contact you soon.');
    
    e.target.reset();
}

// Initialize all elements with fade-in class
function initFadeIn() {
    const elements = document.querySelectorAll('.refugio-card, .dica-card, .historia-content, .contato-content');
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Language
    initLanguage();
    // Novo: suporta múltiplos botões (ex: um para PT e outro para EN)
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== currentLang) {
            changeLanguage(lang);
        }
    });
});
    
    // Gallery carousel
    document.getElementById('carouselPrev').addEventListener('click', () => scrollGallery('prev'));
    document.getElementById('carouselNext').addEventListener('click', () => scrollGallery('next'));
    
    // Gallery items click for lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Lightbox controls
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox('prev'));
    document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox('next'));
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        }
    });
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                smoothScroll(target);
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Scroll events
    window.addEventListener('scroll', () => {
        handleScroll();
        fadeInOnScroll();
    });
    
    // Form submission
    const form = document.getElementById('contatoForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize fade-in animations
    initFadeIn();
    fadeInOnScroll();
    
    // Touch events for mobile gallery swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe();
    }, { passive: true });
    
    function handleGallerySwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                scrollGallery('next');
            } else {
                scrollGallery('prev');
            }
        }
    }
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.backgroundPositionY = `${parallax}px`;
        }
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Prevent right-click on images (optional - for photo protection)
// Uncomment if needed
/*
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});
*/

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service Worker registration (optional - for PWA capabilities)
// Uncomment and create sw.js if needed
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
*/