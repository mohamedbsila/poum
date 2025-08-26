/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto every page via the 'encore_entry_script_tags()' Twig function.
 */

import './styles/app.css';

// Import any additional JavaScript libraries or modules
console.log('AirPods Pro Store - Application loaded successfully!');

// Global utilities and functions
window.AirPodsStore = {
    // Cart functionality
    updateCartCount: function() {
        fetch('/cart/count')
            .then(response => response.json())
            .then(data => {
                const cartCount = document.getElementById('cartCount');
                if (cartCount) {
                    cartCount.textContent = data.count;
                    cartCount.style.display = data.count > 0 ? 'flex' : 'none';
                }
            })
            .catch(console.error);
    },

    // Notification system
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9500' : '#2196F3'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            backdrop-filter: blur(10px);
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        `;
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    },

    // Add to cart functionality
    addToCart: function(productId, quantity = 1) {
        const addButton = document.querySelector(`[onclick="addToCart(${productId})"]`);
        const originalText = addButton ? addButton.textContent : '';
        
        if (addButton) {
            addButton.textContent = 'Adding...';
            addButton.disabled = true;
        }
        
        fetch(`/cart/add/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ quantity: quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateCartCount();
                this.showNotification('Product added to cart!', 'success');
                
                // Add visual feedback
                if (addButton) {
                    addButton.textContent = 'Added!';
                    addButton.style.background = '#4CAF50';
                    setTimeout(() => {
                        addButton.textContent = originalText;
                        addButton.style.background = '';
                        addButton.disabled = false;
                    }, 2000);
                }
            } else {
                this.showNotification(data.error || 'Error adding product to cart', 'error');
                if (addButton) {
                    addButton.textContent = originalText;
                    addButton.disabled = false;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Error adding product to cart', 'error');
            if (addButton) {
                addButton.textContent = originalText;
                addButton.disabled = false;
            }
        });
    },

    // Initialize the application
    init: function() {
        // Update cart count on load
        this.updateCartCount();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize smooth scrolling for anchor links
        this.initSmoothScrolling();
        
        // Initialize lazy loading for images
        this.initLazyLoading();
    },

    // Set up global event listeners
    setupEventListeners: function() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value.trim());
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value.trim() : '';
                this.performSearch(query);
            });
        }
        
        // Navbar scroll behavior
        this.initNavbarScrollBehavior();
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navToggle && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    },

    // Search functionality
    performSearch: function(query) {
        if (query) {
            window.location.href = `/products?search=${encodeURIComponent(query)}`;
        }
    },

    // Navbar scroll behavior
    initNavbarScrollBehavior: function() {
        let lastScroll = 0;
        const navbar = document.getElementById('navbar');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up', 'scroll-down');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                // Scrolling down
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                // Scrolling up
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    },

    // Smooth scrolling for anchor links
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    // Lazy loading for images
    initLazyLoading: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }
};

// Global functions for backward compatibility
window.addToCart = function(productId, quantity = 1) {
    window.AirPodsStore.addToCart(productId, quantity);
};

window.showNotification = function(message, type = 'info') {
    window.AirPodsStore.showNotification(message, type);
};

window.updateCartCount = function() {
    window.AirPodsStore.updateCartCount();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AirPodsStore.init();
});

// Initialize when page is fully loaded (including images)
window.addEventListener('load', () => {
    // Hide any loading screens
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Handle form submissions with better UX
document.addEventListener('submit', (e) => {
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton && !form.hasAttribute('data-no-loading')) {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Loading...';
        submitButton.disabled = true;
        
        // Re-enable after 5 seconds as fallback
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 5000);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible, refresh cart count
        window.AirPodsStore.updateCartCount();
    }
});

// Export for use in other modules
export default window.AirPodsStore;
