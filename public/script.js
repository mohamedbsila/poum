class AirPodsController {
    constructor() {
        this.airpodsBox = document.getElementById('airpodsBox');
        this.airpods = document.getElementById('airpods');
        this.caseLid = document.querySelector('.case-lid');
        this.rotateBtn = document.getElementById('rotateBtn');
        this.openBtn = document.getElementById('openBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.isRotated = false;
        this.isOpened = false;
        this.isAnimating = false;
        
        this.initializeEventListeners();
        this.addHoverEffects();
    }
    
    initializeEventListeners() {
        this.rotateBtn.addEventListener('click', () => this.rotateBox());
        this.openBtn.addEventListener('click', () => this.toggleOpen());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Add drag functionality for rotation
        this.addDragRotation();
        
        // Add keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    rotateBox() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isRotated = !this.isRotated;
        
        if (this.isRotated) {
            this.airpodsBox.classList.add('rotated');
            this.rotateBtn.textContent = 'Rotate Back';
        } else {
            this.airpodsBox.classList.remove('rotated');
            this.rotateBtn.textContent = 'Rotate Box';
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    toggleOpen() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpened = !this.isOpened;
        
        if (this.isOpened) {
            this.openCase();
            this.openBtn.textContent = 'Close Box';
        } else {
            this.closeCase();
            this.openBtn.textContent = 'Open Box';
        }
    }
    
    openCase() {
        // Open the lid
        this.caseLid.classList.add('opened');
        
        // Raise the AirPods after a short delay
        setTimeout(() => {
            this.airpods.classList.add('raised');
        }, 300);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 900);
    }
    
    closeCase() {
        // Lower the AirPods first
        this.airpods.classList.remove('raised');
        
        // Close the lid after AirPods are lowered
        setTimeout(() => {
            this.caseLid.classList.remove('opened');
        }, 300);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 900);
    }
    
    reset() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isRotated = false;
        this.isOpened = false;
        
        // Reset all animations
        this.airpodsBox.classList.remove('rotated');
        this.caseLid.classList.remove('opened');
        this.airpods.classList.remove('raised');
        
        // Reset button text
        this.rotateBtn.textContent = 'Rotate Box';
        this.openBtn.textContent = 'Open Box';
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    addDragRotation() {
        let isDragging = false;
        let startX = 0;
        let currentRotation = 0;
        
        const container = document.querySelector('.airpods-container');
        
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            container.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const rotationSpeed = 0.5;
            currentRotation = deltaX * rotationSpeed;
            
            // Apply rotation with limits
            const limitedRotation = Math.max(-180, Math.min(180, currentRotation));
            this.airpodsBox.style.transform = `rotateY(${limitedRotation}deg)`;
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            container.style.cursor = 'grab';
            
            // Snap to nearest 180-degree position
            const snapRotation = Math.round(currentRotation / 180) * 180;
            this.airpodsBox.style.transition = 'transform 0.3s ease';
            this.airpodsBox.style.transform = `rotateY(${snapRotation}deg)`;
            
            // Update state
            this.isRotated = Math.abs(snapRotation) > 90;
            this.rotateBtn.textContent = this.isRotated ? 'Rotate Back' : 'Rotate Box';
            
            // Remove inline style after animation
            setTimeout(() => {
                this.airpodsBox.style.transition = '';
                this.airpodsBox.style.transform = '';
                if (this.isRotated) {
                    this.airpodsBox.classList.add('rotated');
                } else {
                    this.airpodsBox.classList.remove('rotated');
                }
            }, 300);
        });
        
        // Add touch support for mobile
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const rotationSpeed = 0.5;
            currentRotation = deltaX * rotationSpeed;
            
            const limitedRotation = Math.max(-180, Math.min(180, currentRotation));
            this.airpodsBox.style.transform = `rotateY(${limitedRotation}deg)`;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            isDragging = false;
            
            const snapRotation = Math.round(currentRotation / 180) * 180;
            this.airpodsBox.style.transition = 'transform 0.3s ease';
            this.airpodsBox.style.transform = `rotateY(${snapRotation}deg)`;
            
            this.isRotated = Math.abs(snapRotation) > 90;
            this.rotateBtn.textContent = this.isRotated ? 'Rotate Back' : 'Rotate Box';
            
            setTimeout(() => {
                this.airpodsBox.style.transition = '';
                this.airpodsBox.style.transform = '';
                if (this.isRotated) {
                    this.airpodsBox.classList.add('rotated');
                } else {
                    this.airpodsBox.classList.remove('rotated');
                }
            }, 300);
        });
    }
    
    addHoverEffects() {
        const container = document.querySelector('.airpods-container');
        
        container.addEventListener('mouseenter', () => {
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.cursor = 'default';
        });
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'r':
            case 'R':
                this.rotateBox();
                break;
            case 'o':
            case 'O':
                this.toggleOpen();
                break;
            case 'Escape':
                this.reset();
                break;
        }
    }
}

// Add smooth scrolling and additional animations
class PageAnimations {
    constructor() {
        this.initializeAnimations();
        this.addScrollEffects();
    }
    
    initializeAnimations() {
        // Animate features on scroll
        const features = document.querySelectorAll('.feature');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
            feature.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(feature);
        });
    }
    
    addScrollEffects() {
        // Add parallax effect to the main title
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const title = document.querySelector('.main-title');
            const rate = scrolled * -0.5;
            title.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Add loading animation
class LoadingAnimation {
    constructor() {
        this.createLoadingScreen();
    }
    
    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-airpods">
                    <div class="loading-case"></div>
                    <div class="loading-airpod left"></div>
                    <div class="loading-airpod right"></div>
                </div>
                <p>Loading AirPods Experience...</p>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loading-content {
                text-align: center;
                color: #333;
            }
            
            .loading-airpods {
                position: relative;
                width: 80px;
                height: 60px;
                margin: 0 auto 20px;
            }
            
            .loading-case {
                width: 60px;
                height: 40px;
                background: linear-gradient(145deg, #ffffff, #f0f0f0);
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                margin: 0 auto;
                animation: pulse 1.5s infinite;
            }
            
            .loading-airpod {
                position: absolute;
                width: 12px;
                height: 18px;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 50%;
                top: 10px;
                animation: bounce 1s infinite;
            }
            
            .loading-airpod.left {
                left: 15px;
                animation-delay: 0.2s;
            }
            
            .loading-airpod.right {
                right: 15px;
                animation-delay: 0.4s;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove loading screen after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1500);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingAnimation();
    new AirPodsController();
    new PageAnimations();
    
    // Add some ambient animations
    const ledIndicator = document.querySelector('.led-indicator');
    if (ledIndicator) {
        setInterval(() => {
            ledIndicator.style.background = Math.random() > 0.5 ? '#00ff00' : '#ff0000';
        }, 3000);
    }
});

// Add some ambient background animation
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ambient-glow {
            0%, 100% { 
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            50% { 
                background: linear-gradient(135deg, #e8ecf4 0%, #b8c6d9 100%);
            }
        }
        
        body {
            animation: ambient-glow 10s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
});