// Base page JavaScript - Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter subscription
    const newsletterBtn = document.querySelector('.newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const email = document.querySelector('.newsletter-input').value;
            if (email) {
                alert('Thank you for subscribing!');
                document.querySelector('.newsletter-input').value = '';
            }
        });
    }
});
