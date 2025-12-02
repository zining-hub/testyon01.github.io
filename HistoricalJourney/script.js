// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function () {
    // 导航栏功能
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname.replace(/\/$/, '');

    // 导航栏激活状态
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
        if (linkPath.toLowerCase() === currentPath.toLowerCase()) {
            link.classList.add('active');
        }
    });

    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('mobile-open');
            
            // 防止背景滚动
            if (mainNav.classList.contains('mobile-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 点击导航链接后关闭菜单
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });
        });

        // 点击菜单外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('mobile-open');
                document.body.style.overflow = '';
            }
        });
    }

    // 滚动淡入淡出动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('active');
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // 初始化所有slide的动画状态
    document.querySelectorAll('.slide').forEach(slide => {
        slideObserver.observe(slide);
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = window.innerWidth <= 768 ? 140 : 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ 
                    top: offsetPosition, 
                    behavior: 'smooth' 
                });
            }
        });
    });

    // 年份时间轴功能
    const timelineItems = document.querySelectorAll('.year-timeline .year-item');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.year-progress-bar');

    function activateYear(year) {
        timelineItems.forEach(i => i.classList.toggle('active', i.getAttribute('data-year') === year));
        if (progressBar) {
            const yearNum = parseInt(year, 10);
            const index = Math.max(0, Math.min(14, yearNum - 1931));
            progressBar.style.width = (index / 14) * 100 + '%';
        }
    }

    // 年份点击事件
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const year = item.getAttribute('data-year');
            let targetSlide = null;
            
            slides.forEach(slide => {
                const h2 = slide.querySelector('h2');
                if (h2 && h2.textContent.includes(year)) {
                    targetSlide = slide;
                }
            });
            
            if (targetSlide) {
                const offset = window.innerWidth <= 768 ? 140 : 100;
                const elementPosition = targetSlide.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({ 
                    top: offsetPosition, 
                    behavior: 'smooth' 
                });
                
                // 添加脉冲动画
                const img = targetSlide.querySelector('.img-box img');
                if (img) {
                    img.classList.add('pulse');
                    setTimeout(() => img.classList.remove('pulse'), 800);
                }
                
                activateYear(year);
            }
        });
    });

    // 滚动监听年份变化
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h2 = entry.target.querySelector('h2');
                if (h2) {
                    const yearText = h2.textContent.trim();
                    // 提取年份（假设年份是4位数字）
                    const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
                    if (yearMatch) {
                        activateYear(yearMatch[0]);
                    }
                }
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '-100px 0px'
    });

    slides.forEach(slide => timelineObserver.observe(slide));

    // 返回顶部功能
    const scrollTopBtn = document.querySelector('.scroll-top');

    function handleScrollTop() {
        if (!scrollTopBtn) return;
        if (window.scrollY > 320) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', handleScrollTop);
    handleScrollTop(); // 初始化检查

    // 窗口大小变化处理
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // 移动端关闭菜单
        if (isMobile && mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
        
        // 重新观察slide元素
        slides.forEach(slide => {
            slideObserver.unobserve(slide);
            slideObserver.observe(slide);
        });
    }

    // 性能优化：防抖函数
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

    // 应用防抖到窗口大小变化事件
    window.addEventListener('resize', debounce(handleResize, 100));

    // 键盘导航支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
    });

    // 触摸滑动支持（移动端）
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // 可以在这里添加垂直滑动的处理逻辑
            // 例如：快速滑动到下一个/上一个slide
        }
    }

    // 图片懒加载优化
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // 初始化懒加载
    lazyLoadImages();

    // 性能监控
    function logPerformance() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        }
    }

    window.addEventListener('load', logPerformance);

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('页面错误:', e.error);
    });

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
    });
});
