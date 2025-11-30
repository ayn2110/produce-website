/**
 * 蔬果線上型錄 - 互動功能
 * 提供平滑滾動、動畫效果等功能
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 平滑滾動導航
    // ==========================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新active狀態
                updateActiveNavLink(this);
            }
        });
    });
    
    // ==========================================
    // 滾動時更新導航狀態
    // ==========================================
    window.addEventListener('scroll', function() {
        updateNavigationOnScroll();
        addScrollEffects();
    });
    
    function updateNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (correspondingNavLink) {
                    updateActiveNavLink(correspondingNavLink);
                }
            }
        });
    }
    
    function updateActiveNavLink(activeLink) {
        // 移除所有active狀態
        navLinks.forEach(link => link.classList.remove('active'));
        // 添加新的active狀態
        activeLink.classList.add('active');
    }
    
    // ==========================================
    // 滾動效果
    // ==========================================
    function addScrollEffects() {
        const navbar = document.querySelector('.navbar');
        
        // 導航欄滾動效果
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            navbar.style.backdropFilter = 'none';
        }
    }
    
    // ==========================================
    // 動畫觀察器（Intersection Observer）
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 觀察需要動畫的元素
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .stat-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ==========================================
    // 產品卡片互動效果
    // ==========================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ==========================================
    // 特色卡片動畫
    // ==========================================
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.animationPlayState = 'paused';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.color = 'var(--warm-yellow)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.animationPlayState = 'running';
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = '';
            }
        });
    });
    
    // ==========================================
    // 電子報表單處理
    // ==========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = newsletterForm?.querySelector('input[type="email"]');
    const subscribeBtn = newsletterForm?.querySelector('.btn');
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput?.value;
            
            if (email && isValidEmail(email)) {
                // 模擬訂閱成功
                showNotification('訂閱成功！感謝您的訂閱。', 'success');
                emailInput.value = '';
            } else {
                showNotification('請輸入有效的電子信箱地址。', 'error');
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ==========================================
    // 通知系統
    // ==========================================
    function showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'warning'} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-2" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // 自動移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // ==========================================
    // 回到頂部按鈕
    // ==========================================
    function createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.className = 'btn btn-primary position-fixed';
        backToTopBtn.id = 'backToTop';
        backToTopBtn.style.cssText = `
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: none;
            box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(backToTopBtn);
        
        // 滾動顯示/隱藏按鈕
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
                setTimeout(() => {
                    backToTopBtn.style.opacity = '1';
                    backToTopBtn.style.transform = 'scale(1)';
                }, 100);
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    backToTopBtn.style.display = 'none';
                }, 300);
            }
        });
        
        // 點擊回到頂部
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 懸停效果
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = 'var(--soft-green)';
        });
        
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'var(--primary-green)';
        });
    }
    
    createBackToTopButton();
    
    // ==========================================
    // 載入動畫
    // ==========================================
    function addLoadingAnimations() {
        const elements = document.querySelectorAll('.hero-content, .feature-card, .product-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 頁面載入完成後執行動畫
    addLoadingAnimations();
    
    // ==========================================
    // 社群媒體分享功能
    // ==========================================
    function addShareFunctionality() {
        const socialLinks = document.querySelectorAll('.social-links a');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const icon = this.querySelector('i');
                if (icon?.classList.contains('fa-facebook-f')) {
                    shareToFacebook();
                } else if (icon?.classList.contains('fa-line')) {
                    shareToLine();
                } else if (icon?.classList.contains('fa-instagram')) {
                    // Instagram 通常不支援直接分享，可以顯示提示
                    showNotification('請在Instagram上搜尋我們的帳號！', 'info');
                }
            });
        });
    }
    
    function shareToFacebook() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
    }
    
    function shareToLine() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('看看這個很棒的蔬果型錄網站！');
        window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank');
    }
    
    addShareFunctionality();
    
    // ==========================================
    // 響應式圖片載入優化
    // ==========================================
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YzZjNmMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
            });
            
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '0';
        });
    }
    
    optimizeImages();
});

// ==========================================
// CSS 動畫增強
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(300px);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    #backToTop {
        opacity: 0;
        transform: scale(0.8);
    }
`;
document.head.appendChild(style);