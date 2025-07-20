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
    initializeInteractiveComparison();
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
            const href = this.getAttribute('href');
            
            // Only prevent default for internal anchor links (starting with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For external links (like method.html, index.html), let the browser handle navigation normally
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

// Add loading animation - removed to fix font rendering issues
// window.addEventListener('load', function() {
//     document.body.style.opacity = '0';
//     document.body.style.transition = 'opacity 0.5s ease-in';
//     
//     setTimeout(function() {
//         document.body.style.opacity = '1';
//     }, 100);
// });

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

// Interactive Comparison Chart Functionality
function initializeInteractiveComparison() {
    // Narrative data from the paper - updated with actual data order
    const narrativeData = {
        'pollution-is-choking': {
            title: "Pollution is choking our planet",
            structure: {
                hero: "Environmental Organizations & Activists",
                villain: "Industry Emissions",
                victim: "Animals/Nature/Environment, General Public",
                action: "Prevent Conflict",
                culturalStory: "Egalitarian"
            },
            description: "This narrative emphasizes the immediate harmful effects of pollution on our environment and public health, calling for urgent action to address environmental degradation.",
            source: "Generated from data"
        },
        'win-win': {
            title: "Win-win scenario",
            structure: {
                hero: "Green Technology & Innovation, General Public",
                villain: "Optional",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Individualistic"
            },
            description: "This narrative presents climate action as beneficial for both the economy and environment, emphasizing positive outcomes for all stakeholders.",
            source: "Generated from data"
        },
        'fossil-fuel-solutionism': {
            title: "Fossil fuel solutionism",
            structure: {
                hero: "Industry Emissions, Green Technology & Innovation",
                villain: "Environmental Organizations & Activists",
                victim: "General Public",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "This narrative suggests that fossil fuel industries can provide solutions to climate change through technological innovation, rather than requiring fundamental changes to energy systems.",
            source: "Generated from data"
        },
        'adaptation': {
            title: "Adaptation",
            structure: {
                hero: "Science Experts & Scientific Reports, Governments & Politicians",
                villain: "Climate Change",
                victim: "General Public, Animals/Nature/Environment",
                action: "Fuel Resolution",
                culturalStory: "Hierarchical"
            },
            description: "This narrative focuses on adapting to climate change impacts rather than preventing them, emphasizing resilience and adjustment strategies.",
            source: "Generated from data"
        },
        'no-sticks-carrots': {
            title: "No sticks just carrots",
            structure: {
                hero: "Legislation & Policies",
                villain: "Legislation & Policies",
                victim: "General Public",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Society will only respond to supportive and voluntary policies, restrictive measures will fail and should be abandoned.",
            source: "Lamb et al. (2020)"
        },
        'every-little-helps': {
            title: "Every little helps",
            structure: {
                hero: "General Public",
                villain: "General Public",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Individualistic"
            },
            description: "This narrative presents a society which has transitioned to a sustainable 'green' way of life. Could be by portraying individuals as the protagonists of stories that propose solutions to climate change.",
            source: "Bushell et al. (2017)"
        },
        'victim-blaming': {
            title: "Victim blaming",
            structure: {
                hero: "Optional",
                villain: "General Public",
                victim: "General Public",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Individuals and consumers are ultimately responsible for taking actions to address climate change.",
            source: "Lamb et al. (2020)"
        },
        'collapse-imminent': {
            title: "The collapse is imminent",
            structure: {
                hero: "Environmental Organizations & Activists",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Egalitarian"
            },
            description: "The climate crisis is such that some kind of societal collapse is near inevitable. Due to the inaction of the negligent or complacent politicians the social contract has broken down and it is incumbent upon individuals to engage in non-violent civil disobedience to shock society into urgent action.",
            source: "Bevan (2020)"
        },
        'others-worse': {
            title: "Others are worse than us",
            structure: {
                hero: "Governments & Politicians",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Other countries, cities or industries are worse than ourselves. There is no point for us to implement climate policies, because we only cause a small fraction of the emissions. As long as others emit even more than us, actions won't be effective.",
            source: "Lamb et al. (2020)"
        },
        'carbon-fueled-expansion': {
            title: "Carbon fueled expansion",
            structure: {
                hero: "Optional",
                villain: "Legislation & Policies, Green Technology & Innovation",
                victim: "General Public, Industry Emissions",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "The free market is at the centre of this narrative which presents action on climate change as an obstacle to the freedom and well-being of citizens. The narrative can stress social justice or well-being of individual citizens.",
            source: "Bushell et al. (2017)"
        },
        'technological-optimism': {
            title: "Technological optimism",
            structure: {
                hero: "Green Technology & Innovation",
                villain: "Industry Emissions, Climate Change",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Egalitarian"
            },
            description: "We should focus our efforts on current and future technologies, which will unlock great possibilities for addressing climate change.",
            source: "Lamb et al. (2020)"
        },
        'endangered-species': {
            title: "Endangered species",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians, Legislation & Policies, Industry Emissions",
                victim: "Animals/Nature/Environment",
                action: "Prevent Conflict",
                culturalStory: "Hierarchical"
            },
            description: "Endangered species (like polar bears) are the helpless victims of this narrative, who are seeing their habitat destroyed by the actions of villainous humans.",
            source: "Bushell et al. (2017)"
        },
        'all-talk-action': {
            title: "All talk little action",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Egalitarian"
            },
            description: "This narrative emphasises inconsistency between ambitious climate action targets and actual actions.",
            source: "Lamb et al. (2020)"
        },
        'climate-solutions-wont-work': {
            title: "Climate solutions won't work",
            structure: {
                hero: "Optional",
                villain: "Legislation & Policies, Green Technology & Innovation",
                victim: "General Public, Animals/Nature/Environment",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Climate policies are harmful and a threat to society and the economy. Climate policies are ineffective and too difficult to implement.",
            source: "Lamb et al. (2020)"
        },
        'no-need-to-act': {
            title: "No need to act",
            structure: {
                hero: "Science Experts & Scientific Reports",
                villain: "Environmental Organizations & Activists",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "This narrative questions or ridicules the reality of climate change, suggesting that no action is necessary because the problem is exaggerated or non-existent.",
            source: "Generated from data"
        },
        'gore': {
            title: "Gore",
            structure: {
                hero: "Science Experts & Scientific Reports",
                villain: "Governments & Politicians, General Public, Industry Emissions",
                victim: "Animals/Nature/Environment, Climate Change",
                action: "Fuel Resolution",
                culturalStory: "Hierarchical"
            },
            description: "This is a narrative of scientific discovery which climaxes on the certainty that climate change is unequivocally caused by humans.",
            source: "Bushell et al. (2017)"
        },
        'we-all-going-die': {
            title: "We are all going to die",
            structure: {
                hero: "Optional",
                villain: "Climate Change, Industry Emissions",
                victim: "General Public",
                action: "Prevent Conflict",
                culturalStory: "Egalitarian"
            },
            description: "This narrative shows the current or potential catastrophic impact of climate change on people.",
            source: "Shanahan (2007)"
        },
        'officials-declare-emergency': {
            title: "Officials declare climate emergency",
            structure: {
                hero: "Governments & Politicians",
                villain: "Industry Emissions, Climate Change, Governments & Politicians",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Hierarchical"
            },
            description: "The climate crisis is sufficiently severe that it warrants declaring a climate emergency. This should occur at different levels of government as climate requires action at all levels, from the hyper-local to the global.",
            source: "Bevan (2020)"
        },
        'debate-scam': {
            title: "Debate and scam",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians, Legislation & Policies, Environmental Organizations & Activists, Media & Journalists",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "The heroes of this narrative are sceptical individuals who dare to challenge the false consensus on climate change which is propagated by those with vested interests.",
            source: "Lamb et al. (2020)"
        },
        'youre-destroying-future': {
            title: "You're destroying our future",
            structure: {
                hero: "Environmental Organizations & Activists",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Egalitarian"
            },
            description: "The political stasis around climate change means that we cannot rely on politicians to create the change necessary. With collective action, even the politically weak can make a difference and secure a future for generations to come. This can manifest as anything from protests (school strikes) to non-violent civil disobedience.",
            source: "Bevan (2020)"
        },
        '12-years-save-world': {
            title: "12 Years to Save the World",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians",
                victim: "Animals/Nature/Environment, General Public, Climate Change",
                action: "Prevent Conflict",
                culturalStory: "Hierarchical"
            },
            description: "Past and present human action (or inaction) risks a catastrophic future climatic event unless people change their behaviour to mitigate climate change.",
            source: "Bevan (2020)"
        },
        'technological-optimism': {
            title: "Technological optimism",
            structure: {
                hero: "Green Technology & Innovation",
                villain: "Industry Emissions, Climate Change",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Egalitarian"
            },
            description: "We should focus our efforts on current and future technologies, which will unlock great possibilities for addressing climate change.",
            source: "Lamb et al. (2020)"
        },
        'officials-declare-emergency': {
            title: "Officials declare climate emergency",
            structure: {
                hero: "Governments & Politicians",
                villain: "Industry Emissions, Climate Change, Governments & Politicians",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Hierarchical"
            },
            description: "The climate crisis is sufficiently severe that it warrants declaring a climate emergency. This should occur at different levels of government as climate requires action at all levels, from the hyper-local to the global.",
            source: "Bevan (2020)"
        },
        'every-little-helps': {
            title: "Every little helps",
            structure: {
                hero: "General Public",
                villain: "General Public",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Individualistic"
            },
            description: "This narrative presents a society which has transitioned to a sustainable 'green' way of life. Could be by portraying individuals as the protagonists of stories that propose solutions to climate change.",
            source: "Bushell et al. (2017)"
        },
        '12-years-save-world': {
            title: "12 Years to Save the World",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians",
                victim: "Animals/Nature/Environment, General Public, Climate Change",
                action: "Prevent Conflict",
                culturalStory: "Hierarchical"
            },
            description: "Past and present human action (or inaction) risks a catastrophic future climatic event unless people change their behaviour to mitigate climate change.",
            source: "Bevan (2020)"
        },
        'gore': {
            title: "Gore",
            structure: {
                hero: "Science Experts & Scientific Reports",
                villain: "Governments & Politicians, General Public, Industry Emissions",
                victim: "Animals/Nature/Environment, Climate Change",
                action: "Fuel Resolution",
                culturalStory: "Hierarchical"
            },
            description: "This is a narrative of scientific discovery which climaxes on the certainty that climate change is unequivocally caused by humans.",
            source: "Bushell et al. (2017)"
        },
        'collapse-imminent': {
            title: "The collapse is imminent",
            structure: {
                hero: "Environmental Organizations & Activists",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Fuel Resolution",
                culturalStory: "Egalitarian"
            },
            description: "The climate crisis is such that some kind of societal collapse is near inevitable. Due to the inaction of the negligent or complacent politicians the social contract has broken down and it is incumbent upon individuals to engage in non-violent civil disobedience to shock society into urgent action.",
            source: "Bevan (2020)"
        },
        'climate-solutions-wont-work': {
            title: "Climate solutions won't work",
            structure: {
                hero: "Optional",
                villain: "Legislation & Policies, Green Technology & Innovation",
                victim: "General Public, Animals/Nature/Environment",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Climate policies are harmful and a threat to society and the economy. Climate policies are ineffective and too difficult to implement.",
            source: "Lamb et al. (2020)"
        },
        'no-sticks-carrots': {
            title: "No sticks just carrots",
            structure: {
                hero: "Legislation & Policies",
                villain: "Legislation & Policies",
                victim: "General Public",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Society will only respond to supportive and voluntary policies, restrictive measures will fail and should be abandoned.",
            source: "Lamb et al. (2020)"
        },
        'all-talk-action': {
            title: "All talk little action",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Egalitarian"
            },
            description: "This narrative emphasises inconsistency between ambitious climate action targets and actual actions.",
            source: "Lamb et al. (2020)"
        },
        'victim-blaming': {
            title: "Victim blaming",
            structure: {
                hero: "Optional",
                villain: "General Public",
                victim: "General Public",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Individuals and consumers are ultimately responsible for taking actions to address climate change.",
            source: "Lamb et al. (2020)"
        },
        'debate-scam': {
            title: "Debate and scam",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians, Legislation & Policies, Environmental Organizations & Activists, Media & Journalists",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "The heroes of this narrative are sceptical individuals who dare to challenge the false consensus on climate change which is propagated by those with vested interests.",
            source: "Lamb et al. (2020)"
        },
        'others-worse': {
            title: "Others are worse than us",
            structure: {
                hero: "Governments & Politicians",
                villain: "Governments & Politicians",
                victim: "Optional",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "Other countries, cities or industries are worse than ourselves. There is no point for us to implement climate policies, because we only cause a small fraction of the emissions. As long as others emit even more than us, actions won't be effective.",
            source: "Lamb et al. (2020)"
        },
        'endangered-species': {
            title: "Endangered species",
            structure: {
                hero: "Optional",
                villain: "Governments & Politicians, Legislation & Policies, Industry Emissions",
                victim: "Animals/Nature/Environment",
                action: "Prevent Conflict",
                culturalStory: "Hierarchical"
            },
            description: "Endangered species (like polar bears) are the helpless victims of this narrative, who are seeing their habitat destroyed by the actions of villainous humans.",
            source: "Bushell et al. (2017)"
        },
        'we-all-going-die': {
            title: "We are all going to die",
            structure: {
                hero: "Optional",
                villain: "Climate Change, Industry Emissions",
                victim: "General Public",
                action: "Prevent Conflict",
                culturalStory: "Egalitarian"
            },
            description: "This narrative shows the current or potential catastrophic impact of climate change on people.",
            source: "Shanahan (2007)"
        },
        'carbon-fueled-expansion': {
            title: "Carbon fueled expansion",
            structure: {
                hero: "Optional",
                villain: "Legislation & Policies, Green Technology & Innovation",
                victim: "General Public, Industry Emissions",
                action: "Prevent Resolution",
                culturalStory: "Individualistic"
            },
            description: "The free market is at the centre of this narrative which presents action on climate change as an obstacle to the freedom and well-being of citizens. The narrative can stress social justice or well-being of individual citizens.",
            source: "Bushell et al. (2017)"
        }
    };

    // Get modal elements
    const modal = document.getElementById('narrative-modal');
    const modalTitle = document.getElementById('narrative-title');
    const modalStructure = document.getElementById('narrative-structure-content');
    const modalDescription = document.getElementById('narrative-description-content');
    const modalSource = document.getElementById('narrative-source-content');
    const closeBtn = document.querySelector('.narrative-modal-close');

    // Add click listeners to hotspots
    const hotspots = document.querySelectorAll('.narrative-hotspot');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const narrativeKey = this.getAttribute('data-narrative');
            const narrative = narrativeData[narrativeKey];
            
            if (narrative) {
                showNarrativeModal(narrative);
                trackEvent('narrative_clicked', { narrative: narrativeKey });
            }
        });

        // Add hover effect
        hotspot.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(139, 126, 200, 0.4)';
        });

        hotspot.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(139, 126, 200, 0.1)';
        });
    });

    // Close modal functionality
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function showNarrativeModal(narrative) {
        modalTitle.textContent = narrative.title;
        
        // Build structure content
        modalStructure.innerHTML = `
            <div class="structure-item">
                <span class="structure-label">Hero:</span>
                <span class="structure-value">${narrative.structure.hero}</span>
            </div>
            <div class="structure-item">
                <span class="structure-label">Villain:</span>
                <span class="structure-value">${narrative.structure.villain}</span>
            </div>
            <div class="structure-item">
                <span class="structure-label">Victim:</span>
                <span class="structure-value">${narrative.structure.victim}</span>
            </div>
            <div class="structure-item">
                <span class="structure-label">Action:</span>
                <span class="structure-value">${narrative.structure.action}</span>
            </div>
            <div class="structure-item">
                <span class="structure-label">Cultural Story:</span>
                <span class="structure-value">${narrative.structure.culturalStory}</span>
            </div>
        `;
        
        modalDescription.textContent = narrative.description;
        modalSource.textContent = narrative.source;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        closeBtn.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize dynamic comparison chart
function initializeDynamicComparisonChart() {
    // This function is overridden by the embedded script in index.html
    console.log('Dynamic comparison chart initialization called from script.js');
}

function createComparisonChart(data, sortBy) {
    // Sort data based on selected option
    let sortedData = [...data];
    switch(sortBy) {
        case 'usa':
            sortedData.sort((a, b) => a.USA_Percentage_num - b.USA_Percentage_num);
            break;
        case 'australia':
            sortedData.sort((a, b) => a.Australia_Percentage_num - b.Australia_Percentage_num);
            break;
        case 'difference':
            sortedData.sort((a, b) => a.Difference - b.Difference);
            break;
    }
    
    // Clear existing chart
    d3.select('#dynamic-comparison-chart').selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = {top: 20, right: 80, bottom: 100, left: 200};
    const width = 900 - margin.left - margin.right;
    const height = Math.max(600, sortedData.length * 25) - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select('#dynamic-comparison-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => Math.max(d.USA_Percentage_num, d.Australia_Percentage_num))])
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(sortedData.map(d => d.Narrative))
        .range([0, height])
        .padding(0.1);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d + '%');
    
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
            // Map narrative codes to display names
            const narrativeMapping = {
                'POLLUTION_IS_CHOKING': 'Pollution is choking our planet',
                'WIN_WIN': 'Win-win scenario',
                'FOSSIL_FUEL_SOLUTIOINISM': 'Fossil fuel solutionism',
                'ADAPTATION': 'Adaptation',
                'NO_STICKS': 'No sticks just carrots',
                'EVERY_LITTLE_HELPS': 'Every little helps',
                'VICTIM_BLAMING': 'Victim blaming',
                'COLLAPSE_IS_IMMINENT': 'The collapse is imminent',
                'OTHERS_ARE_WORSE': 'Others are worse than us',
                'CARBON_EXPANSION': 'Carbon fueled expansion',
                'TECHNOLOGICAL_OPTIMISM': 'Technological optimism',
                'ENDANGERED_SPECIES': 'Endangered species',
                'ALL_TALK': 'All talk little action',
                'CLIMATE_SOLUTIONS_WONT_WORK': "Climate solutions won't work",
                'NO_NEED_TO_ACT': 'No need to act',
                'GORE': 'Gore',
                'ALL_GOING_TO_DIE': 'We are all going to die',
                'OFFICIALS_DECLARE_EMERGENCY': 'Officials declare climate emergency',
                'DEBATE_AND_SCAM': 'Debate and scam',
                'YOURE_DESTROYING_OUR_FUTURE': "You're destroying our future",
                '12_YEARS': '12 Years to Save the World'
            };
            return narrativeMapping[d] || d;
        });
    
    // Add axes
    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);
    
    g.append('g')
        .attr('class', 'chart-axis')
        .call(yAxis);
    
    // Add axis labels
    g.append('text')
        .attr('class', 'chart-axis-label')
        .attr('transform', `translate(${width/2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Percentage (%)');
    
    // Create bars for USA
    g.selectAll('.bar-usa')
        .data(sortedData)
        .enter().append('rect')
        .attr('class', 'chart-bar usa')
        .attr('x', 0)
        .attr('y', d => yScale(d.Narrative))
        .attr('width', d => xScale(d.USA_Percentage_num))
        .attr('height', yScale.bandwidth() / 2)
        .on('mouseover', function(event, d) {
            showTooltip(event, `USA: ${d.USA_Percentage_num.toFixed(1)}%`);
        })
        .on('mouseout', hideTooltip);
    
    // Create bars for Australia
    g.selectAll('.bar-australia')
        .data(sortedData)
        .enter().append('rect')
        .attr('class', 'chart-bar australia')
        .attr('x', 0)
        .attr('y', d => yScale(d.Narrative) + yScale.bandwidth() / 2)
        .attr('width', d => xScale(d.Australia_Percentage_num))
        .attr('height', yScale.bandwidth() / 2)
        .on('mouseover', function(event, d) {
            showTooltip(event, `Australia: ${d.Australia_Percentage_num.toFixed(1)}%`);
        })
        .on('mouseout', hideTooltip);
    
    // Add percentage labels
    g.selectAll('.label-usa')
        .data(sortedData)
        .enter().append('text')
        .attr('class', 'chart-axis')
        .attr('x', d => xScale(d.USA_Percentage_num) + 5)
        .attr('y', d => yScale(d.Narrative) + yScale.bandwidth() / 4)
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .text(d => d.USA_Percentage_num > 0 ? `${d.USA_Percentage_num.toFixed(1)}%` : '');
    
    g.selectAll('.label-australia')
        .data(sortedData)
        .enter().append('text')
        .attr('class', 'chart-axis')
        .attr('x', d => xScale(d.Australia_Percentage_num) + 5)
        .attr('y', d => yScale(d.Narrative) + 3 * yScale.bandwidth() / 4)
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .text(d => d.Australia_Percentage_num > 0 ? `${d.Australia_Percentage_num.toFixed(1)}%` : '');
    
    // Add legend
    const legend = g.append('g')
        .attr('class', 'chart-legend')
        .attr('transform', `translate(${width - 100}, 20)`);
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#1f77b4');
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text('USA');
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#ff7f0e');
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 37)
        .text('Australia');
    
    // Make narrative labels clickable
    g.selectAll('.tick text')
        .style('cursor', 'pointer')
        .attr('class', 'chart-narrative-label')
        .on('click', function(event, d) {
            // Convert display name back to narrative key
            const reverseMapping = {
                'Pollution is choking our planet': 'pollution-is-choking',
                'Win-win scenario': 'win-win',
                'Fossil fuel solutionism': 'fossil-fuel-solutionism',
                'Adaptation': 'adaptation',
                'No sticks just carrots': 'no-sticks-carrots',
                'Every little helps': 'every-little-helps',
                'Victim blaming': 'victim-blaming',
                'The collapse is imminent': 'collapse-imminent',
                'Others are worse than us': 'others-worse',
                'Carbon fueled expansion': 'carbon-fueled-expansion',
                'Technological optimism': 'technological-optimism',
                'Endangered species': 'endangered-species',
                'All talk little action': 'all-talk-action',
                "Climate solutions won't work": 'climate-solutions-wont-work',
                'No need to act': 'no-need-to-act',
                'Gore': 'gore',
                'We are all going to die': 'we-all-going-die',
                'Officials declare climate emergency': 'officials-declare-emergency',
                'Debate and scam': 'debate-scam',
                "You're destroying our future": 'youre-destroying-future',
                '12 Years to Save the World': '12-years-save-world'
            };
            
            const narrativeKey = reverseMapping[d];
            if (narrativeKey && narrativeData[narrativeKey]) {
                showNarrativeModal(narrativeData[narrativeKey]);
                trackEvent('narrative_clicked', { narrative: narrativeKey });
            }
        });
    
    // Create tooltip
    if (!document.getElementById('chart-tooltip')) {
        const tooltip = d3.select('body').append('div')
            .attr('id', 'chart-tooltip')
            .attr('class', 'chart-tooltip');
    }
    
    function showTooltip(event, text) {
        const tooltip = d3.select('#chart-tooltip');
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(text)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
            .classed('show', true);
    }
    
    function hideTooltip() {
        const tooltip = d3.select('#chart-tooltip');
        tooltip.transition().duration(500).style('opacity', 0)
            .classed('show', false);
    }
}

// Initialize interactive comparison when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add to existing initialization
    initializeInteractiveComparison();
    initializeDynamicComparisonChart();
});
