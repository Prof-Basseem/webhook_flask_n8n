/**
 * Main Application JavaScript
 * Handles webhook form functionality and global app features
 */

class WebhookApp {
    constructor() {
        this.webhookForm = document.getElementById('webhookForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.nameInput = document.getElementById('name');
        this.messageInput = document.getElementById('message');
        this.alerts = document.querySelectorAll('.alert');
        
        this.init();
    }

    init() {
        this.setupFormHandling();
        this.setupFormValidation();
        this.setupAlertHandling();
        this.setupKeyboardShortcuts();
        this.setupFormAnimations();
    }

    /**
     * Setup webhook form submission handling
     */
    setupFormHandling() {
        if (this.webhookForm) {
            this.webhookForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(event) {
        // Add loading state immediately
        this.showLoadingState();
        
        // Validate form before submission
        if (!this.validateForm()) {
            event.preventDefault();
            this.hideLoadingState();
            return false;
        }
        
        // Track form submission
        this.trackFormSubmission();
        
        // Form will submit naturally, loading state will persist until page reload
    }

    /**
     * Show loading state on submit button
     */
    showLoadingState() {
        if (this.submitBtn) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.submitBtn.disabled = true;
            
            // Disable form inputs
            this.toggleFormInputs(false);
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.submitBtn) {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-rocket"></i> Send to n8n Workflow';
            this.submitBtn.disabled = false;
            
            // Re-enable form inputs
            this.toggleFormInputs(true);
        }
    }

    /**
     * Toggle form inputs enabled/disabled state
     */
    toggleFormInputs(enabled) {
        const inputs = [this.nameInput, this.messageInput];
        inputs.forEach(input => {
            if (input) {
                input.disabled = !enabled;
            }
        });
    }

    /**
     * Setup real-time form validation
     */
    setupFormValidation() {
        // Real-time validation for name input
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => {
                this.validateField(this.nameInput, 'name');
            });

            this.nameInput.addEventListener('blur', () => {
                this.validateField(this.nameInput, 'name');
            });
        }

        // Real-time validation for message input
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                this.validateField(this.messageInput, 'message');
                this.updateCharacterCount();
            });

            this.messageInput.addEventListener('blur', () => {
                this.validateField(this.messageInput, 'message');
            });
        }
    }

    /**
     * Validate individual form field
     */
    validateField(field, fieldType) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error', 'success');
        this.removeFieldError(field);

        switch (fieldType) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                } else if (value.length > 50) {
                    isValid = false;
                    errorMessage = 'Name must be less than 50 characters';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message must be less than 1000 characters';
                }
                break;
        }

        // Apply styling based on validation result
        if (value) {
            field.classList.add(isValid ? 'success' : 'error');
            
            if (!isValid) {
                this.showFieldError(field, errorMessage);
            }
        }

        return isValid;
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const nameValid = this.validateField(this.nameInput, 'name');
        const messageValid = this.validateField(this.messageInput, 'message');
        
        return nameValid && messageValid;
    }

    /**
     * Show field error message
     */
    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            animation: slideIn 0.3s ease;
        `;
    }

    /**
     * Remove field error message
     */
    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Update character count for message field
     */
    updateCharacterCount() {
        if (!this.messageInput) return;
        
        const currentLength = this.messageInput.value.length;
        const maxLength = 1000;
        
        let countElement = document.querySelector('.char-count');
        
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'char-count';
            this.messageInput.parentNode.appendChild(countElement);
        }
        
        countElement.textContent = `${currentLength}/${maxLength}`;
        countElement.style.cssText = `
            font-size: 12px;
            color: ${currentLength > maxLength * 0.9 ? '#e74c3c' : '#95a5a6'};
            text-align: right;
            margin-top: 5px;
        `;
    }

    /**
     * Setup alert handling (auto-hide flash messages)
     */
    setupAlertHandling() {
        if (this.alerts.length > 0) {
            // Auto-hide alerts after 5 seconds
            setTimeout(() => {
                this.hideAlerts();
            }, 5000);

            // Add close buttons to alerts
            this.addCloseButtonsToAlerts();
        }
    }

    /**
     * Hide all alert messages
     */
    hideAlerts() {
        this.alerts.forEach(alert => {
            alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 500);
        });
    }

    /**
     * Add close buttons to alert messages
     */
    addCloseButtonsToAlerts() {
        this.alerts.forEach(alert => {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.className = 'alert-close';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                font-size: 14px;
                float: right;
                margin-left: 10px;
                padding: 0;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            `;
            
            closeBtn.addEventListener('click', () => {
                this.hideAlert(alert);
            });
            
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
            });
            
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.7';
            });
            
            alert.appendChild(closeBtn);
        });
    }

    /**
     * Hide specific alert
     */
    hideAlert(alert) {
        alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (this.webhookForm) {
                    e.preventDefault();
                    this.webhookForm.requestSubmit();
                }
            }
            
            // Escape to clear form
            if (e.key === 'Escape' && (e.target === this.nameInput || e.target === this.messageInput)) {
                this.clearForm();
            }
        });
    }

    /**
     * Setup form animations
     */
    setupFormAnimations() {
        // Add focus animations to form inputs
        const inputs = [this.nameInput, this.messageInput];
        
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('focus', () => {
                    input.parentNode.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentNode.classList.remove('focused');
                    }
                });
            }
        });
    }

    /**
     * Clear form data
     */
    clearForm() {
        if (this.nameInput) this.nameInput.value = '';
        if (this.messageInput) this.messageInput.value = '';
        
        // Remove validation classes
        document.querySelectorAll('.error, .success').forEach(el => {
            el.classList.remove('error', 'success');
        });
        
        // Remove error messages
        document.querySelectorAll('.field-error').forEach(el => {
            el.remove();
        });
        
        // Update character count
        this.updateCharacterCount();
    }

    /**
     * Track form submission for analytics
     */
    trackFormSubmission() {
        const data = {
            timestamp: new Date().toISOString(),
            nameLength: this.nameInput?.value.length || 0,
            messageLength: this.messageInput?.value.length || 0
        };
        
        console.log('Form submission tracked:', data);
        // Example: gtag('event', 'webhook_form_submit', data);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WebhookApp();
});

// Global utility functions
window.WebhookApp = {
    // Utility function to show notifications
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebhookApp;
}
