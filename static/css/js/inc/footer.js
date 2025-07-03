/**
 * Footer JavaScript Module
 * Handles footer functionality including newsletter and animations
 */

class FooterHandler {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter');
        this.newsletterInput = document.querySelector('.newsletter-input');
        this.newsletterBtn = document.querySelector('.newsletter-btn');
        this.socialLinks = document.querySelectorAll('.social-link');
        this.footerLinks = document.querySelectorAll('.footer-links a');
        
        this.init();
    }

    init() {
        this.setupNewsletter();
        this.setupSocialLinks();
        this.setupFooterLinks();
        this.setupScrollAnimations();
        this.setupTooltips();
    }

    /**
     * Setup newsletter subscription functionality
     */
    setupNewsletter() {
        if (this.newsletterBtn && this.newsletterInput) {
            // Handle newsletter button click
            this.newsletterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription();
            });

            // Handle Enter key in newsletter input
            this.newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNewsletterSubscription();
                }
            });

            // Add input validation styling
            this.newsletterInput.addEventListener('input', () => {
                this.validateEmailInput();
            });
        }
    }

    /**
     * Handle newsletter subscription
     */
    handleNewsletterSubscription() {
        const email = this.newsletterInput.value.trim();
        
        if (!email) {
            this.showNewsletterMessage('Please enter your email address', 'error');
            this.shakeNewsletterInput();
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNewsletterMessage('Please enter a valid email address', 'error');
            this.shakeNewsletterInput();
            return;
        }

        // Show loading state
        this.showNewsletterLoading();
        
        // Simulate API call (replace with actual newsletter subscription)
        setTimeout(() => {
            this.handleNewsletterSuccess(email);
        }, 1500);
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate email input in real-time
     */
    validateEmailInput() {
        const email = this.newsletterInput.value.trim();
        
        if (email && !this.isValidEmail(email)) {
            this.newsletterInput.style.borderColor = '#e74c3c';
        } else {
            this.newsletterInput.style.borderColor = '';
        }
    }

    /**
     * Show newsletter loading state
     */
    showNewsletterLoading() {
        const originalContent = this.newsletterBtn.innerHTML;
        this.newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.newsletterBtn.disabled = true;
        this.newsletterInput.disabled = true;
        
        // Store original content for restoration
        this.newsletterBtn.dataset.originalContent = originalContent;
    }

    /**
     * Handle successful newsletter subscription
     */
    handleNewsletterSuccess(email) {
        this.showNewsletterMessage('Thank you for subscribing!', 'success');
        this.newsletterInput.value = '';
        this.resetNewsletterButton();
        
        // Add success animation
        this.animateNewsletterSuccess();
        
        // Track subscription (analytics)
        this.trackNewsletterSubscription(email);
    }

    /**
     * Show newsletter message
     */
    showNewsletterMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.newsletter-message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'newsletter-message';
            this.newsletterForm.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `newsletter-message ${type}`;
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
        
        // Auto-hide message after 3 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-10px)';
        }, 3000);
    }

    /**
     * Reset newsletter button to original state
     */
    resetNewsletterButton() {
        const originalContent = this.newsletterBtn.dataset.originalContent;
        this.newsletterBtn.innerHTML = originalContent || '<i class="fas fa-paper-plane"></i>';
        this.newsletterBtn.disabled = false;
        this.newsletterInput.disabled = false;
    }

    /**
     * Shake newsletter input for error feedback
     */
    shakeNewsletterInput() {
        this.newsletterInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.newsletterInput.style.animation = '';
        }, 500);
    }

    /**
     * Animate newsletter success
     */
    animateNewsletterSuccess() {
        this.newsletterForm.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            this.newsletterForm.style.animation = '';
        }, 600);
    }

    /**
     * Setup social links interactions
     */
    setupSocialLinks() {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click animation
                link.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
                
                // Track social link clicks (analytics)
                this.trackSocialClick(link.href);
            });
        });
    }

    /**
     * Setup footer links interactions
     */
    setupFooterLinks() {
        this.footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add ripple effect
                this.createRippleEffect(link, e);
                
                // Track footer link clicks (analytics)
                this.trackFooterLinkClick(link.href);
            });
        });
    }

    /**
     * Create ripple effect on click
     */
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Setup scroll animations for footer elements
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe footer sections
        document.querySelectorAll('.footer-section').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Setup tooltips for social links
     */
    setupTooltips() {
        this.socialLinks.forEach(link => {
            const tooltip = this.createTooltip(this.getSocialPlatformName(link));
            link.appendChild(tooltip);
            
            link.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(-100%) translateX(-50%) scale(1)';
            });
            
            link.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-100%) translateX(-50%) scale(0.8)';
            });
        });
    }

    /**
     * Create tooltip element
     */
    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'social-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateY(-100%) translateX(-50%) scale(0.8);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 1000;
        `;
        return tooltip;
    }

    /**
     * Get social platform name from URL
     */
    getSocialPlatformName(link) {
        const href = link.href.toLowerCase();
        if (href.includes('github')) return 'GitHub';
        if (href.includes('discord')) return 'Discord';
        if (href.includes('twitter')) return 'Twitter';
        if (href.includes('linkedin')) return 'LinkedIn';
        return 'Social Link';
    }

    /**
     * Analytics tracking methods
     */
    trackNewsletterSubscription(email) {
        // Implement analytics tracking
        console.log('Newsletter subscription:', email);
        // Example: gtag('event', 'newsletter_signup', { email: email });
    }

    trackSocialClick(url) {
        console.log('Social link clicked:', url);
        // Example: gtag('event', 'social_click', { url: url });
    }

    trackFooterLinkClick(url) {
        console.log('Footer link clicked:', url);
        // Example: gtag('event', 'footer_link_click', { url: url });
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
