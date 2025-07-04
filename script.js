// Academic ML Paper Website JavaScript
// Handles navigation, smooth scrolling, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeCopyFunctionality();
    initializeAnimations();
    initializeInteractiveExample();
    initializeComparisonCarousel();
    initializeBenefitsCarousel();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Handle navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(139, 126, 200, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // Observe resource cards for staggered animation
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Copy functionality for BibTeX citation
function initializeCopyFunctionality() {
    window.copyBibtex = function() {
        const bibtexText = document.getElementById('bibtex-citation').textContent;
        const copyBtn = document.querySelector('.copy-btn');
        
        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(bibtexText).then(function() {
                showCopySuccess(copyBtn);
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
                fallbackCopyTextToClipboard(bibtexText, copyBtn);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(bibtexText, copyBtn);
        }
    };
    
    function fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess(button);
            } else {
                showCopyError(button);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            showCopyError(button);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#27ae60';
        
        setTimeout(function() {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    function showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = '❌ Failed';
        button.style.background = '#e74c3c';
        
        setTimeout(function() {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Additional animations and interactions
function initializeAnimations() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Paper title displays immediately without typing effect
    const paperTitle = document.querySelector('.paper-title');
    if (paperTitle) {
        // Title is already displayed, no animation needed
        paperTitle.style.borderRight = 'none';
    }
    
    // Add interactive table row highlighting
    const tableRows = document.querySelectorAll('.results-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add smooth reveal animation for code blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    const codeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });
    
    codeBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateX(-30px)';
        block.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        codeObserver.observe(block);
    });
}

// Interactive Example Tooltip Functionality
function initializeInteractiveExample() {
    // Tooltip data
    const tooltipData = {
        'villain': {
            title: '🦹‍♂️ Villain: Climate Advocates',
            content: 'Climate scientists and advocates are framed as the antagonists who spread fear and misinformation about climate change impacts on wildlife.'
        },
        'hero-focus': {
            title: '🦸‍♂️ Hero + 🎯 Focus',
            content: 'The University of Southern Denmark researchers are positioned as heroes providing "objective" science. The narrative focuses on their findings to support the overall message.'
        },
        'cultural-story': {
            title: '🏛️ Cultural Story: Individualistic',
            content: 'This reflects an individualistic cultural story - nature is resilient and self-regulating, requiring no external control or collective action to address climate change.'
        },
        'villain-media': {
            title: '🦹‍♂️ Villain: Media',
            content: 'USA Today is portrayed as part of the villain group, using "terrifying" language to unnecessarily frighten the public about climate impacts.'
        },
        'hero-conflict': {
            title: '🦸‍♂️ Hero + ⚔️ Fuels Conflict',
            content: 'Global warming skeptics are framed as heroes who provide perspective, but this actually fuels conflict by promoting pseudoscience that undermines climate action.'
        }
    };

    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }

    // Add event listeners to all highlighted elements
    const highlightedElements = document.querySelectorAll('[data-tooltip]');
    highlightedElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', moveTooltip);
        
        // Add click tracking for interactive elements
        element.addEventListener('click', function() {
            const tooltipKey = this.getAttribute('data-tooltip');
            trackEvent('interactive_element_click', {
                tooltip_key: tooltipKey,
                element_text: this.textContent.trim()
            });
        });
    });

    function showTooltip(e) {
        const tooltipKey = e.target.getAttribute('data-tooltip');
        const data = tooltipData[tooltipKey];
        
        if (data) {
            tooltip.innerHTML = `<h4>${data.title}</h4><p>${data.content}</p>`;
            tooltip.classList.add('show');
            moveTooltip(e);
        }
    }

    function hideTooltip() {
        tooltip.classList.remove('show');
    }

    function moveTooltip(e) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = e.pageX - tooltipRect.width / 2;
        let top = e.pageY - tooltipRect.height - 15;
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = e.pageY + 15;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // Add smooth animations to interactive example elements
    const interactiveContainer = document.querySelector('.interactive-example-container');
    if (interactiveContainer) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate legend items
                    const legendItems = entry.target.querySelectorAll('.legend-item');
                    legendItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    // Animate article content
                    const article = entry.target.querySelector('.example-article');
                    if (article) {
                        setTimeout(() => {
                            article.style.opacity = '1';
                            article.style.transform = 'translateY(0)';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        // Set initial styles for animation
        const legendItems = interactiveContainer.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });
        
        const article = interactiveContainer.querySelector('.example-article');
        if (article) {
            article.style.opacity = '0';
            article.style.transform = 'translateY(30px)';
            article.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        
        observer.observe(interactiveContainer);
    }
}

// Comparison Carousel Functionality
function initializeComparisonCarousel() {
    const carousel = document.querySelector('.comparison-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.comparison-slide');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;
    
    // Initialize carousel
    updateCarousel();
    
    // Remove any existing event listeners
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    // Previous button
    newPrevBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isAnimating) return;
        isAnimating = true;
        
        console.log('Comparison carousel: Previous clicked, current slide:', currentSlide);
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        console.log('Comparison carousel: Moving to slide:', currentSlide);
        updateCarousel();
        trackEvent('carousel_navigation', { direction: 'previous', slide: currentSlide, carousel: 'comparison' });
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };
    
    // Next button
    newNextBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isAnimating) return;
        isAnimating = true;
        
        console.log('Comparison carousel: Next clicked, current slide:', currentSlide);
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        console.log('Comparison carousel: Moving to slide:', currentSlide);
        updateCarousel();
        trackEvent('carousel_navigation', { direction: 'next', slide: currentSlide, carousel: 'comparison' });
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
            trackEvent('carousel_navigation', { direction: 'dot', slide: currentSlide });
        });
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextBtn.click();
            } else {
                // Swipe right - previous slide
                prevBtn.click();
            }
        }
    }, { passive: true });
    
    // Mouse drag support for desktop
    let mouseStartX = 0;
    let mouseEndX = 0;
    let isMouseDragging = false;
    
    carousel.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isMouseDragging) return;
        mouseEndX = e.clientX;
    });
    
    document.addEventListener('mouseup', function() {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        carousel.style.cursor = 'grab';
        
        const threshold = 50;
        const diff = mouseStartX - mouseEndX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    });
    
    // Update carousel position and state
    function updateCarousel() {
        // Move track
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Add active class to current slide for animations
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update ARIA attributes for accessibility
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== currentSlide);
        });
        
        track.setAttribute('aria-live', 'polite');
        
        // Announce slide change for screen readers
        const slideTitle = slides[currentSlide].querySelector('.comparison-title').textContent;
        const announcement = `Slide ${currentSlide + 1} of ${totalSlides}: ${slideTitle}`;
        
        // Create or update screen reader announcement
        let srAnnouncement = document.getElementById('carousel-sr-announcement');
        if (!srAnnouncement) {
            srAnnouncement = document.createElement('div');
            srAnnouncement.id = 'carousel-sr-announcement';
            srAnnouncement.className = 'sr-only';
            srAnnouncement.setAttribute('aria-live', 'polite');
            srAnnouncement.setAttribute('aria-atomic', 'true');
            carousel.appendChild(srAnnouncement);
        }
        srAnnouncement.textContent = announcement;
    }
}

// Benefits Carousel Functionality
function initializeBenefitsCarousel() {
    const carousel = document.querySelector('.benefits-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.benefits-slide');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Initialize carousel
    updateBenefitsCarousel();
    
    // Previous button
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Prevent rapid clicks
        if (prevBtn.disabled) return;
        prevBtn.disabled = true;
        
        console.log('Benefits carousel: Previous clicked, current slide:', currentSlide);
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        updateBenefitsCarousel();
        trackEvent('benefits_carousel_navigation', { direction: 'previous', slide: currentSlide, carousel: 'benefits' });
        
        // Re-enable button after a short delay
        setTimeout(() => {
            prevBtn.disabled = false;
        }, 300);
    });
    
    // Next button
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Prevent rapid clicks
        if (nextBtn.disabled) return;
        nextBtn.disabled = true;
        
        console.log('Benefits carousel: Next clicked, current slide:', currentSlide);
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateBenefitsCarousel();
        trackEvent('benefits_carousel_navigation', { direction: 'next', slide: currentSlide, carousel: 'benefits' });
        
        // Re-enable button after a short delay
        setTimeout(() => {
            nextBtn.disabled = false;
        }, 300);
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateBenefitsCarousel();
            trackEvent('benefits_carousel_navigation', { direction: 'dot', slide: currentSlide });
        });
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    }, { passive: true });
    
    // Mouse drag support for desktop
    let mouseStartX = 0;
    let mouseEndX = 0;
    let isMouseDragging = false;
    
    carousel.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isMouseDragging) return;
        mouseEndX = e.clientX;
    });
    
    document.addEventListener('mouseup', function() {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        carousel.style.cursor = 'grab';
        
        const threshold = 50;
        const diff = mouseStartX - mouseEndX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    });
    
    // Update carousel position and state
    function updateBenefitsCarousel() {
        // Move track
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Add active class to current slide for animations
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update ARIA attributes for accessibility
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== currentSlide);
        });
        
        track.setAttribute('aria-live', 'polite');
        
        // Announce slide change for screen readers
        const slideTitle = slides[currentSlide].querySelector('h4').textContent;
        const announcement = `Slide ${currentSlide + 1} of ${totalSlides}: ${slideTitle}`;
        
        // Create or update screen reader announcement
        let srAnnouncement = document.getElementById('benefits-carousel-sr-announcement');
        if (!srAnnouncement) {
            srAnnouncement = document.createElement('div');
            srAnnouncement.id = 'benefits-carousel-sr-announcement';
            srAnnouncement.className = 'sr-only';
            srAnnouncement.setAttribute('aria-live', 'polite');
            srAnnouncement.setAttribute('aria-atomic', 'true');
            carousel.appendChild(srAnnouncement);
        }
        srAnnouncement.textContent = announcement;
        
        // Trigger bar chart animation when first slide is shown
        if (currentSlide === 0) {
            animateBarChart();
        }
    }
    
    // Animate bar chart
    function animateBarChart() {
        const bars = carousel.querySelectorAll('.vertical-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.animation = 'none';
                bar.offsetHeight; // Trigger reflow
                bar.style.animation = 'verticalBarGrow 1.5s ease-out';
            }, index * 200);
        });
    }
    
    // Intersection Observer for performance
    const benefitsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentSlide === 0) {
                // Trigger bar chart animation when carousel becomes visible
                setTimeout(animateBarChart, 300);
            }
        });
    }, { threshold: 0.3 });
    
    benefitsObserver.observe(carousel);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Analytics placeholder (can be replaced with actual analytics)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track button clicks for analytics
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className
        });
    }
});

// Handle tooltip positioning on window resize
window.addEventListener('resize', debounce(function() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip && tooltip.classList.contains('show')) {
        tooltip.classList.remove('show');
    }
}, 250));

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(function() {
    // Any additional scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Handle mobile navigation (if needed in future)
function initializeMobileNavigation() {
    // This function can be expanded for mobile menu functionality
    // Currently, the CSS handles mobile responsiveness
    const navMenu = document.querySelector('.nav-menu');
    
    // Add mobile menu toggle if needed
    if (window.innerWidth <= 480) {
        // Mobile-specific navigation handling
        console.log('Mobile navigation initialized');
    }
}

// Initialize mobile navigation on resize
window.addEventListener('resize', debounce(initializeMobileNavigation, 250));

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Add keyboard shortcuts for better accessibility
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'c':
                // If focus is on citation box, copy BibTeX
                if (document.activeElement.closest('.citation-box')) {
                    e.preventDefault();
                    copyBibtex();
                }
                break;
        }
    }
});

// Print optimization
window.addEventListener('beforeprint', function() {
    // Expand all sections for printing
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.pageBreakInside = 'avoid';
    });
});

// Error handling for external resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.warn('Failed to load external resource:', e.target.src || e.target.href);
        // Graceful degradation - the site should still work without external resources
    }
});
