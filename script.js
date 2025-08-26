// AirPods 3D Animation Controller
class AirPodsAnimation {
    constructor() {
        this.airpodsBox = document.getElementById('airpodsBox');
        this.boxLid = document.getElementById('boxLid');
        this.airpods = document.getElementById('airpods');
        this.rotateBtn = document.getElementById('rotateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.isOpen = false;
        this.isAnimating = false;
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.animationProgress = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMouseDrag();
        this.setupKeyboardControls();
        this.setupAutoRotation();
        this.setupParallaxEffects();
        this.setupScrollAnimations();
        this.setupPerformanceOptimizations();
    }
    
    setupEventListeners() {
        // Rotate button
        this.rotateBtn.addEventListener('click', () => {
            this.toggleBox();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.resetAnimation();
        });
        
        // Touch events for mobile
        this.airpodsBox.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        });
        
        this.airpodsBox.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });
        
        this.airpodsBox.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });
        
        // Hover effects
        this.airpodsBox.addEventListener('mouseenter', () => {
            this.addHoverEffect();
        });
        
        this.airpodsBox.addEventListener('mouseleave', () => {
            this.removeHoverEffect();
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    setupMouseDrag() {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let lastX = 0;
        let lastY = 0;
        
        this.airpodsBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lastX = e.clientX;
            lastY = e.clientY;
            this.airpodsBox.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            
            this.rotateBox(deltaX * 0.5, deltaY * 0.3);
            
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.airpodsBox.style.cursor = 'grab';
                this.snapToNearestPosition();
            }
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.toggleBox();
                    break;
                case 'r':
                case 'R':
                    this.resetAnimation();
                    break;
                case 'ArrowLeft':
                    this.rotateBox(-10, 0);
                    break;
                case 'ArrowRight':
                    this.rotateBox(10, 0);
                    break;
                case 'ArrowUp':
                    this.rotateBox(0, -10);
                    break;
                case 'ArrowDown':
                    this.rotateBox(0, 10);
                    break;
            }
        });
    }
    
    setupAutoRotation() {
        // Subtle auto-rotation when not interacting
        let autoRotateInterval;
        
        const startAutoRotate = () => {
            autoRotateInterval = setInterval(() => {
                if (!this.isAnimating && !this.isOpen) {
                    this.rotateBox(0.5, 0);
                }
            }, 50);
        };
        
        const stopAutoRotate = () => {
            clearInterval(autoRotateInterval);
        };
        
        this.airpodsBox.addEventListener('mouseenter', stopAutoRotate);
        this.airpodsBox.addEventListener('mouseleave', startAutoRotate);
        
        // Start auto-rotation after 3 seconds
        setTimeout(startAutoRotate, 3000);
    }
    
    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        const airpodsContainer = document.querySelector('.airpods-container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (airpodsContainer) {
                airpodsContainer.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
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
        
        // Observe feature cards and detail sections
        document.querySelectorAll('.feature-card, .detail-section').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupPerformanceOptimizations() {
        // Use requestAnimationFrame for smooth animations
        this.animationFrame = null;
        
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    toggleBox() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.openBox();
        } else {
            this.closeBox();
        }
        
        // Update button text
        this.rotateBtn.querySelector('.control-text').textContent = 
            this.isOpen ? 'Close Box' : 'Rotate & Open';
    }
    
    openBox() {
        const timeline = [
            { time: 0, rotation: 0, lidAngle: 0, airpodsY: 0 },
            { time: 0.3, rotation: 90, lidAngle: 0, airpodsY: 0 },
            { time: 0.6, rotation: 180, lidAngle: 110, airpodsY: -20 },
            { time: 1.0, rotation: 180, lidAngle: 110, airpodsY: -20 }
        ];
        
        this.animateTimeline(timeline, () => {
            this.isAnimating = false;
            this.addOpenStateEffects();
        });
    }
    
    closeBox() {
        const timeline = [
            { time: 0, rotation: 180, lidAngle: 110, airpodsY: -20 },
            { time: 0.4, rotation: 180, lidAngle: 0, airpodsY: -20 },
            { time: 0.7, rotation: 90, lidAngle: 0, airpodsY: 0 },
            { time: 1.0, rotation: 0, lidAngle: 0, airpodsY: 0 }
        ];
        
        this.animateTimeline(timeline, () => {
            this.isAnimating = false;
            this.removeOpenStateEffects();
        });
    }
    
    animateTimeline(timeline, onComplete) {
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Find current keyframe
            let currentKeyframe = timeline[0];
            let nextKeyframe = timeline[1];
            
            for (let i = 0; i < timeline.length - 1; i++) {
                if (progress >= timeline[i].time && progress <= timeline[i + 1].time) {
                    currentKeyframe = timeline[i];
                    nextKeyframe = timeline[i + 1];
                    break;
                }
            }
            
            // Interpolate between keyframes
            const keyframeProgress = (progress - currentKeyframe.time) / 
                                   (nextKeyframe.time - currentKeyframe.time);
            const easedProgress = this.easeInOutCubic(keyframeProgress);
            
            const rotation = this.lerp(currentKeyframe.rotation, nextKeyframe.rotation, easedProgress);
            const lidAngle = this.lerp(currentKeyframe.lidAngle, nextKeyframe.lidAngle, easedProgress);
            const airpodsY = this.lerp(currentKeyframe.airpodsY, nextKeyframe.airpodsY, easedProgress);
            
            this.applyTransforms(rotation, lidAngle, airpodsY);
            
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    applyTransforms(rotation, lidAngle, airpodsY) {
        // Apply box rotation
        this.airpodsBox.style.transform = `rotateY(${rotation}deg)`;
        
        // Apply lid rotation
        this.boxLid.style.transform = `rotateX(${-lidAngle}deg)`;
        
        // Apply AirPods movement
        this.airpods.style.transform = `translateY(${airpodsY}px) rotateY(${rotation}deg)`;
        
        // Apply individual AirPod movements
        const airpods = this.airpods.querySelectorAll('.airpod');
        airpods.forEach(airpod => {
            const individualY = airpodsY * 0.5;
            airpod.style.transform = `translateY(${individualY}px)`;
        });
    }
    
    rotateBox(deltaX, deltaY) {
        this.currentRotation += deltaX;
        this.currentRotation = this.currentRotation % 360;
        
        const rotationY = this.currentRotation;
        const rotationX = Math.max(-30, Math.min(30, deltaY));
        
        this.airpodsBox.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
    }
    
    snapToNearestPosition() {
        const snapAngles = [0, 90, 180, 270];
        let closestAngle = 0;
        let minDistance = 360;
        
        snapAngles.forEach(angle => {
            const distance = Math.abs(this.currentRotation - angle);
            if (distance < minDistance) {
                minDistance = distance;
                closestAngle = angle;
            }
        });
        
        this.currentRotation = closestAngle;
        this.airpodsBox.style.transform = `rotateY(${closestAngle}deg)`;
    }
    
    resetAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        this.currentRotation = 0;
        
        const timeline = [
            { time: 0, rotation: this.currentRotation, lidAngle: this.isOpen ? 110 : 0, airpodsY: this.isOpen ? -20 : 0 },
            { time: 1.0, rotation: 0, lidAngle: 0, airpodsY: 0 }
        ];
        
        this.animateTimeline(timeline, () => {
            this.isAnimating = false;
            this.removeOpenStateEffects();
            this.rotateBtn.querySelector('.control-text').textContent = 'Rotate & Open';
        });
    }
    
    addOpenStateEffects() {
        this.airpodsBox.classList.add('opened');
        
        // Add glow effect to LED
        const led = document.querySelector('.led-indicator');
        if (led) {
            led.style.animation = 'pulse 1s infinite';
        }
        
        // Add particle effects
        this.createParticleEffect();
    }
    
    removeOpenStateEffects() {
        this.airpodsBox.classList.remove('opened');
        
        // Remove glow effect
        const led = document.querySelector('.led-indicator');
        if (led) {
            led.style.animation = 'pulse 2s infinite';
        }
    }
    
    createParticleEffect() {
        const particleCount = 20;
        const container = this.airpodsBox.parentElement;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #007aff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = this.airpodsBox.offsetLeft + this.airpodsBox.offsetWidth / 2;
            const startY = this.airpodsBox.offsetTop + this.airpodsBox.offsetHeight / 2;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            container.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 50;
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    addHoverEffect() {
        this.airpodsBox.style.transform += ' scale(1.05)';
        this.airpodsBox.style.cursor = 'grab';
    }
    
    removeHoverEffect() {
        this.airpodsBox.style.transform = this.airpodsBox.style.transform.replace(' scale(1.05)', '');
        this.airpodsBox.style.cursor = 'default';
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.touchStartX) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        
        this.rotateBox(deltaX * 0.3, deltaY * 0.2);
    }
    
    handleTouchEnd(e) {
        if (!this.touchStartTime) return;
        
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        
        // If it's a quick tap, toggle the box
        if (touchDuration < 300) {
            this.toggleBox();
        }
        
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchStartTime = null;
    }
    
    handleResize() {
        // Adjust 3D perspective for different screen sizes
        const width = window.innerWidth;
        const perspective = width < 768 ? 800 : 1000;
        
        const airpodsContainer = document.querySelector('.airpods-container');
        if (airpodsContainer) {
            airpodsContainer.style.perspective = `${perspective}px`;
        }
    }
    
    // Utility functions
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
}

// Additional UI Enhancements
class UIEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupLoadingScreen();
        this.setupProgressIndicators();
        this.setupTooltips();
        this.setupAccessibility();
    }
    
    setupSmoothScrolling() {
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
    
    setupLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading AirPods Experience...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Remove loader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }
    
    setupProgressIndicators() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
    
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                e.target.tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target.tooltip) {
                    e.target.tooltip.remove();
                    e.target.tooltip = null;
                }
            });
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels
        this.rotateBtn.setAttribute('aria-label', 'Toggle AirPods box open/close');
        this.resetBtn.setAttribute('aria-label', 'Reset AirPods box to initial position');
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        this.monitor();
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Log performance if FPS drops
            if (this.fps < 30) {
                console.warn(`Low FPS detected: ${this.fps}`);
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation
    const airpodsAnimation = new AirPodsAnimation();
    
    // Initialize UI enhancements
    const uiEnhancements = new UIEnhancements();
    
    // Initialize performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    
    // Add CSS for additional elements
    const additionalStyles = `
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #007aff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #007aff, #34c759);
            z-index: 1001;
            transition: width 0.3s ease;
        }
        
        .tooltip {
            position: absolute;
            background: #1d1d1f;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
            animation: slideInUp 0.8s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid #007aff;
            outline-offset: 2px;
        }
        
        .particle {
            position: absolute;
            pointer-events: none;
            z-index: 1000;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // Add data attributes for tooltips
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.setAttribute('data-tooltip', btn.querySelector('.control-text').textContent);
    });
    
    console.log('🚀 AirPods 3D Experience loaded successfully!');
    console.log('📱 Interactive features: Click/drag to rotate, Space/Enter to toggle, R to reset');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AirPodsAnimation, UIEnhancements, PerformanceMonitor };
}