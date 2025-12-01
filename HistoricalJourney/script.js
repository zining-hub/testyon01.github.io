// 等待DOM完全加载后执行（确保导航栏元素已渲染）
document.addEventListener('DOMContentLoaded', function () {
    // 1. 滚动淡入淡出动画：上下滚动都能触发（进入视口淡入，离开视口淡出）
    const observerOptions = {
        root: null, // 基于视口观察
        rootMargin: '0px',
        threshold: 0.2 // 当slide有20%进入视口时触发淡入，离开时触发淡出
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入视口：淡入（opacity 1 + 取消偏移）
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // 离开视口：淡出（恢复初始透明+下移）
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
            }
        });
    }, observerOptions);

    // 初始化所有slide的动画状态，并开始持续观察
    document.querySelectorAll('.slide').forEach(slide => {
        slideObserver.observe(slide); // 保持持续观察
    });

    // 2. 平滑滚动（保持页面滚动流畅）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. 导航栏当前页面高亮（核心修改：优化URL匹配逻辑）
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname; // 获取当前页面路径（如：/HistoricalJourney/index.html）

    navLinks.forEach(link => {
        // 获取导航链接的路径部分（忽略域名）
        const linkPath = new URL(link.href).pathname;

        // 比较路径是否一致（忽略大小写和斜杠差异）
        if (linkPath.toLowerCase().replace(/\/$/, '') === currentPath.toLowerCase().replace(/\/$/, '')) {
            link.classList.add('active'); // 匹配成功，添加金色active样式
        }
    });

    // 4. 返回顶部功能
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
});