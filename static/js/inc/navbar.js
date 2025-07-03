/**
 * Navbar JavaScript Module
 * Handles navigation functionality and mobile menu
 */

class NavbarHandler {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavLinks();
        this.setupScrollEffects();
        this.highlightActiveLink();
    }

    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    /**
     * Toggle mobile menu state
     */
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('is-active');
        this.navMenu.classList.toggle('active');
        
        // Add/remove body scroll lock when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Setup navigation links click handlers
     */
    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close mobile menu when clicking on a link
                this.closeMobileMenu();
                
                // Add click animation
                this.animateNavLink(link);
                
                // Update active state
                this.updateActiveLink(link);
            });
        });
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.mobileMenu?.classList.remove('is-active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Animate navigation link on click
     */
    animateNavLink(link) {
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
    }

    /**
     * Update active navigation link
     */
    updateActiveLink(clickedLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
    }

    /**
     * Highlight active link based on current page
     */
    highlightActiveLink() {
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Setup scroll effects for navbar
     */
    setupScrollEffects() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar?.classList.add('nav-hidden');
            } else {
                // Scrolling up
                navbar?.classList.remove('nav-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Add smooth scroll behavior to anchor links
     */
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Close mobile menu with Escape key
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
            
            // Toggle mobile menu with Enter key when focused
            if (e.key === 'Enter' && document.activeElement === this.mobileMenu) {
                this.toggleMobileMenu();
            }
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavbarHandler();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarHandler;
}
