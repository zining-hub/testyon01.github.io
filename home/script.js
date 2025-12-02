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

function initCarousel() {
    createDots();
    goToSlide(0);
    startInterval();
    handleScrollTop();
}

initCarousel();