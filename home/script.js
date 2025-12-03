// 顶部导航激活态（忽略结尾的 / 差异）
const navLinks = document.querySelectorAll('.main-nav a');
const currentPath = window.location.pathname.replace(/\/$/, '');
navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});

// 移动端菜单切换（统一使用顶部的汉堡按钮）
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
        // 这里不需要锁定 body 滚动，因为导航是内联展开的，不会遮挡整屏
    });

    // 点击导航链接后关闭菜单
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
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
            stopInterval();
            goToSlide(index);
            startInterval();
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
            });
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

nextBtn.addEventListener('click', () => {
    stopInterval();
    nextSlide();
    startInterval();
});

prevBtn.addEventListener('click', () => {
    stopInterval();
    prevSlide();
    startInterval();
});

carouselContainer.addEventListener('mouseenter', stopInterval);
carouselContainer.addEventListener('mouseleave', startInterval);

// 触摸滑动事件
carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopInterval();
});

carouselContainer.addEventListener('touchmove', (e) => {
    touchEndX = e.changedTouches[0].screenX;
});

carouselContainer.addEventListener('touchend', () => {
    const diff = touchStartX - touchEndX;
    // 左右滑动阈值
    if (diff > 50) {
        // 向左滑动
        nextSlide();
    } else if (diff < -50) {
        // 向右滑动
        prevSlide();
    }
    startInterval();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopInterval();
    } else {
        startInterval();
    }
});

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

// 图片预加载功能
function preloadImages() {
    // 预加载轮播图和重要图片
    const imagesToPreload = [
        '../images/index01.jpg',
        '../images/index02.png',
        '../images/index03.jpg',
        '../images/logo01.png',
        '../images/BT.jpg',
        '../images/langyashan.png',
        '../images/zhangzizhong.png',
        '../images/pengdehuai.png'
    ];

    imagesToPreload.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
    });
}

// 初始化轮播图
function initCarousel() {
    if (carousel && carouselContainer) {
        createDots();
        startInterval();
    }
}

// 粒子背景效果
class ParticleBackground {
    constructor(containerId, particleCount = 50) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.particleCount = particleCount;
        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机大小
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机动画延迟和持续时间
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        // 随机颜色
        const colors = ['#C8102E', '#971126', '#FF6B6B', '#FFD700'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // 定期重置粒子
        setTimeout(() => {
            this.resetParticle(particle);
        }, 8000);
    }

    resetParticle(particle) {
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.animationDelay = '0s';
        
        setTimeout(() => {
            this.resetParticle(particle);
        }, 8000);
    }
}

// 数字增长动画效果
function animateNumbers() {
    const numberCards = document.querySelectorAll('.legacy-kicker');
    
    numberCards.forEach(card => {
        const targetNumber = parseFloat(card.textContent.replace(/[^\d.]/g, ''));
        const suffix = card.textContent.replace(/[\d.]/g, '');
        let currentNumber = 0;
        const duration = 2000;
        const increment = targetNumber / (duration / 16);
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                card.textContent = targetNumber + suffix;
                clearInterval(timer);
            } else {
                card.textContent = Math.floor(currentNumber) + suffix;
            }
        }, 16);
    });
}

// 页面滚动时的元素渐显效果
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为所有需要渐显的元素添加观察
    const animatedElements = document.querySelectorAll('.journey-card, .legacy-card, .quote-section, .intro-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 增强的导航栏滚动效果
function initEnhancedNavigation() {
    const header = document.querySelector('.top-header');
    const nav = document.querySelector('.main-nav');
    
    if (header && nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                nav.style.backgroundColor = 'rgba(200, 16, 46, 0.95)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                header.style.boxShadow = 'none';
                nav.style.backgroundColor = 'rgba(200, 16, 46, 1)';
            }
        });
    }
}

// 页面加载完成后初始化所有功能
window.addEventListener('load', () => {
    initCarousel();
    preloadImages();
    
    // 初始化粒子背景
    new ParticleBackground('particles', 60);
    
    // 初始化数字增长动画
    setTimeout(animateNumbers, 500);
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化增强的导航栏效果
    initEnhancedNavigation();
});