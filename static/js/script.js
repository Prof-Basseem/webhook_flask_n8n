// Form handling and validation
class WebhookForm {
    constructor() {
        this.form = document.getElementById('webhookForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.nameInput = document.getElementById('name');
        this.messageInput = document.getElementById('message');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.addInputValidation();
        }
    }

    handleSubmit(e) {
        if (!this.validateForm()) {
            e.preventDefault();
            return false;
        }

        // Show loading state
        this.setLoadingState(true);
        
        // Add timestamp for tracking
        const timestamp = new Date().toISOString();
        const timestampInput = document.createElement('input');
        timestampInput.type = 'hidden';
        timestampInput.name = 'timestamp';
        timestampInput.value = timestamp;
        this.form.appendChild(timestampInput);
    }

    validateForm() {
        let isValid = true;
        
        // Clear previous errors
        this.clearErrors();

        // Validate name
        if (!this.nameInput.value.trim()) {
            this.showFieldError(this.nameInput, 'Name is required');
            isValid = false;
        } else if (this.nameInput.value.trim().length < 2) {
            this.showFieldError(this.nameInput, 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate message
        if (!this.messageInput.value.trim()) {
            this.showFieldError(this.messageInput, 'Message is required');
            isValid = false;
        } else if (this.messageInput.value.trim().length < 10) {
            this.showFieldError(this.messageInput, 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert after the field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    clearErrors() {
        // Remove error classes
        [this.nameInput, this.messageInput].forEach(field => {
            field.classList.remove('error');
        });

        // Remove error messages
        document.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }

    addInputValidation() {
        // Real-time validation
        [this.nameInput, this.messageInput].forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                // Clear error on input
                field.classList.remove('error');
                const errorMsg = field.parentNode.querySelector('.field-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }

    validateField(field) {
        if (field === this.nameInput) {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Name is required');
            } else if (field.value.trim().length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters');
            }
        } else if (field === this.messageInput) {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Message is required');
            } else if (field.value.trim().length < 10) {
                this.showFieldError(field, 'Message must be at least 10 characters');
            }
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Sending to n8n...</span>';
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span><i class="fas fa-rocket"></i> Send to n8n Workflow</span>';
            this.submitBtn.classList.remove('loading');
        }
    }
}

// Test webhook connectivity
class WebhookTester {
    static async testConnection() {
        try {
            const response = await fetch('/api/test-webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Webhook connection test successful');
                return true;
            } else {
                console.warn('⚠️ Webhook connection test failed:', result);
                return false;
            }
        } catch (error) {
            console.error('❌ Webhook connection test error:', error);
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handler
    new WebhookForm();
    
    // Test webhook connection on page load
    WebhookTester.testConnection();
    
    // Auto-hide flash messages after 5 seconds
    setTimeout(() => {
        document.querySelectorAll('.alert').forEach(alert => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
    }, 5000);
});