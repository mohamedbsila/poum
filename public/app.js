// E-Commerce Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCart();
    initAnimations();
    initSearch();
    initProductGallery();
    initQuantityControls();
    initFormValidation();
});

// Cart Management
function initCart() {
    // Add to cart functionality
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const productId = formData.get('product_id');
            const quantity = formData.get('quantity') || 1;
            
            addToCart(productId, quantity);
        });
    });
    
    // Update cart quantity
    const quantityInputs = document.querySelectorAll('.cart-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const quantity = this.value;
            
            updateCartQuantity(productId, quantity);
        });
    });
    
    // Remove from cart
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromCart(productId);
        });
    });
}

function addToCart(productId, quantity) {
    // Show loading state
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Adding...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update cart count in navbar
        updateCartCount();
        
        // Show success message
        showNotification('Product added to cart successfully!', 'success');
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1000);
}

function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    // Update cart via AJAX
    fetch(`/cart/update/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCartTotal(data.total);
            showNotification('Cart updated successfully!', 'success');
        }
    })
    .catch(error => {
        showNotification('Error updating cart', 'error');
    });
}

function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        fetch(`/cart/remove/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove item from DOM
                const cartItem = document.querySelector(`[data-cart-item="${productId}"]`);
                if (cartItem) {
                    cartItem.remove();
                }
                
                updateCartCount();
                updateCartTotal(data.total);
                showNotification('Item removed from cart', 'success');
            }
        })
        .catch(error => {
            showNotification('Error removing item', 'error');
        });
    }
}

function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        // Get current count and increment
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        
        // Add animation
        cartBadge.classList.add('pulse');
        setTimeout(() => {
            cartBadge.classList.remove('pulse');
        }, 1000);
    }
}

function updateCartTotal(total) {
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
        totalElement.textContent = `${total.toFixed(2)} DT`;
    }
}

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .feature-icon, .hero-section');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 500);
            }
        });
    }
}

function performSearch(query) {
    // Show loading state
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.innerHTML = '<div class="text-center"><span class="loading"></span> Searching...</div>';
    }
    
    // Perform search via AJAX
    fetch(`/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        displaySearchResults(data.results);
    })
    .catch(error => {
        showNotification('Search error', 'error');
    });
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="text-center text-muted">No products found</div>';
        return;
    }
    
    const html = results.map(product => `
        <div class="search-result-item">
            <img src="/images/products/${product.image}" alt="${product.name}" class="search-result-image">
            <div class="search-result-content">
                <h6>${product.name}</h6>
                <p class="text-muted">${product.price} DT</p>
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = html;
}

// Product Gallery
function initProductGallery() {
    const productImages = document.querySelectorAll('.product-image');
    const mainImage = document.querySelector('.main-product-image');
    
    if (productImages.length && mainImage) {
        productImages.forEach(img => {
            img.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                
                // Update active state
                productImages.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Quantity Controls
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.quantity-minus');
        const plusBtn = control.querySelector('.quantity-plus');
        const input = control.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value) || 1;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value) || 1;
                input.value = currentValue + 1;
                input.dispatchEvent(new Event('change'));
            });
        }
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification-toast`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    const container = document.querySelector('.notifications-container') || document.body;
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Language Switcher
function changeLanguage(locale) {
    // Store preference
    localStorage.setItem('preferred-locale', locale);
    
    // Redirect to change locale
    window.location.href = `/change-locale/${locale}`;
}

// Theme Switcher (if needed)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

// Export functions for global use
window.EcommerceApp = {
    addToCart,
    updateCartQuantity,
    removeFromCart,
    showNotification,
    formatPrice,
    changeLanguage,
    toggleTheme
};