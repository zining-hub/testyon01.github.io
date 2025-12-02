// 导航栏功能
const navLinks = document.querySelectorAll('.main-nav a');
const currentPath = window.location.pathname.replace(/\/$/, '');

// 导航栏激活状态
navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
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

// 轮播图功能
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.prev-arrow');
const nextBtn = document.querySelector('.next-arrow');
const carouselContainer = document.querySelector('.carousel-container');
const dotContainer = document.querySelector('.carousel-dots');
const scrollTopBtn = document.querySelector('.scroll-top');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentIndex = 0;
const itemCount = items.length;
let interval;
let dots = [];
let touchStartX = 0;
let touchEndX = 0;
let isTransitioning = false;

// 克隆首张用于无缝衔接
const firstItemClone = items[0].cloneNode(true);
carousel.appendChild(firstItemClone);

function createDots() {
    if (!dotContainer) return;
    dotContainer.innerHTML = '';
    dots = [];
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `查看第 ${index + 1} 张图片`);
        dot.addEventListener('click', () => {
            if (!isTransitioning) {
                stopInterval();
                goToSlide(index);
                startInterval();
            }
        });
        dotContainer.appendChild(dot);
        dots.push(dot);
    });
    setActiveDot(0);
}

function setActiveDot(index) {
    if (!dots.length) return;
    const normalizedIndex = index % itemCount;
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === normalizedIndex);
    });
}

function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIndex = index;
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
    setActiveDot(currentIndex);

    if (currentIndex === itemCount) {
        setTimeout(() => {
            carousel.style.transition = 'none';
            currentIndex = 0;
            carousel.style.transform = 'translateX(0)';
            requestAnimationFrame(() => {
                carousel.style.transition = 'transform 0.5s ease';
                setActiveDot(currentIndex);
                isTransitioning = false;
            });
        }, 500);
    } else {
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
}

function nextSlide() {
    if (currentIndex < itemCount) {
        goToSlide(currentIndex + 1);
    }
}

function prevSlide() {
    if (currentIndex === 0) {
        carousel.style.transition = 'transform 0.5s ease';
        goToSlide(itemCount);
        setTimeout(() => {
            goToSlide(itemCount - 1);
        }, 50);
    } else {
        goToSlide(currentIndex - 1);
    }
}

function startInterval() {
    if (prefersReducedMotion) return;
    interval = setInterval(nextSlide, 4000);
}

function stopInterval() {
    clearInterval(interval);
}

// 触摸滑动支持
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (!touchStartX || !touchEndX) return;
    
    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
            // 向左滑动 - 下一张
            stopInterval();
            nextSlide();
            startInterval();
        } else {
            // 向右滑动 - 上一张
            stopInterval();
            prevSlide();
            startInterval();
        }
    }
    
    touchStartX = 0;
    touchEndX = 0;
}

// 事件监听器
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopInterval();
        prevSlide();
        startInterval();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopInterval();
        nextSlide();
        startInterval();
    });
}

// 触摸事件
if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    carouselContainer.addEventListener('touchend', handleTouchEnd);
    
    carouselContainer.addEventListener('mouseenter', stopInterval);
    carouselContainer.addEventListener('mouseleave', startInterval);
}

// 页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopInterval();
    } else {
        startInterval();
    }
});

// 返回顶部功能
function handleScrollTop() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 320) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('scroll', handleScrollTop);

// 窗口大小变化处理
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // 移动端关闭菜单
    if (isMobile && mainNav.classList.contains('mobile-open')) {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }
    
    // 重新计算轮播图
    if (carousel) {
        goToSlide(currentIndex);
    }
}

window.addEventListener('resize', handleResize);

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        stopInterval();
        prevSlide();
        startInterval();
    } else if (e.key === 'ArrowRight') {
        stopInterval();
        nextSlide();
        startInterval();
    }
});

// 初始化
function initCarousel() {
    createDots();
    goToSlide(0);
    startInterval();
    handleScrollTop();
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
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

// 应用防抖到滚动事件
window.addEventListener('scroll', debounce(handleScrollTop, 100));
