/**
 * Footer JavaScript Module
 * Handles footer functionality and interactions
 */

class FooterHandler {
    constructor() {
        this.newsletterBtn = document.querySelector('.newsletter-btn');
        this.newsletterInput = document.querySelector('.newsletter-input');
        this.socialLinks = document.querySelectorAll('.social-link');
        this.footerLinks = document.querySelectorAll('.footer-links a');
        
        this.init();
    }

    init() {
        this.setupNewsletterSubscription();
        this.setupSocialLinks();
        this.setupFooterLinks();
        this.setupScrollToTop();
    }

    /**
     * Setup newsletter subscription functionality
     */
    setupNewsletterSubscription() {
        if (this.newsletterBtn && this.newsletterInput) {
            this.newsletterBtn.addEventListener('click', () => {
                this.handleNewsletterSubscription();
            });

            this.newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleNewsletterSubscription();
                }
            });
        }
    }

    /**
     * Handle newsletter subscription
     */
    handleNewsletterSubscription() {
        const email = this.newsletterInput.value.trim();
        
        if (this.validateEmail(email)) {
            // Simulate subscription (replace with actual implementation)
            this.showNewsletterSuccess();
            this.newsletterInput.value = '';
        } else {
            this.showNewsletterError('Please enter a valid email address');
        }
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show newsletter subscription success
     */
    showNewsletterSuccess() {
        const originalText = this.newsletterBtn.innerHTML;
        this.newsletterBtn.innerHTML = '<i class="fas fa-check"></i>';
        this.newsletterBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            this.newsletterBtn.innerHTML = originalText;
            this.newsletterBtn.style.background = '';
        }, 2000);
    }

    /**
     * Show newsletter subscription error
     */
    showNewsletterError(message) {
        const originalText = this.newsletterBtn.innerHTML;
        this.newsletterBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.newsletterBtn.style.background = '#e74c3c';
        
        setTimeout(() => {
            this.newsletterBtn.innerHTML = originalText;
            this.newsletterBtn.style.background = '';
        }, 2000);
    }

    /**
     * Setup social links with analytics tracking
     */
    setupSocialLinks() {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click animation
                this.animateSocialLink(link);
                
                // Track social link clicks (optional analytics)
                this.trackSocialClick(link);
            });
        });
    }

    /**
     * Animate social link on click
     */
    animateSocialLink(link) {
        link.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
            link.style.transform = '';
        }, 200);
    }

    /**
     * Track social link clicks
     */
    trackSocialClick(link) {
        const platform = this.getSocialPlatform(link);
        console.log(`Social click tracked: ${platform}`);
        
        // Implement actual analytics tracking here
        // Example: gtag('event', 'social_click', { platform: platform });
    }

    /**
     * Get social platform from link
     */
    getSocialPlatform(link) {
        const href = link.href;
        if (href.includes('github')) return 'github';
        if (href.includes('discord')) return 'discord';
        if (href.includes('twitter')) return 'twitter';
        return 'unknown';
    }

    /**
     * Setup footer links with hover effects
     */
    setupFooterLinks() {
        this.footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateFooterLink(link, true);
            });
            
            link.addEventListener('mouseleave', () => {
                this.animateFooterLink(link, false);
            });
        });
    }

    /**
     * Animate footer links
     */
    animateFooterLink(link, isHover) {
        const icon = link.querySelector('i');
        if (icon) {
            if (isHover) {
                icon.style.transform = 'translateX(5px)';
            } else {
                icon.style.transform = '';
            }
        }
    }

    /**
     * Setup scroll to top functionality
     */
    setupScrollToTop() {
        // Create scroll to top button if it doesn't exist
        if (!document.querySelector('.scroll-to-top')) {
            this.createScrollToTopButton();
        }
    }

    /**
     * Create scroll to top button
     */
    createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FooterHandler();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterHandler;
}