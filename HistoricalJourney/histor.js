// 图片预加载功能
function preloadHistoricalImages() {
    // 预加载历史征程页面的重要图片
    const imagesToPreload = [
        './Himage/p918h03.png',
        './Himage/p128h02.png',
        './Himage/pGWh02.png',
        './Himage/pCZh02.png',
        './Himage/p129h02.png',
        './Himage/xianshibian.png',
        './Himage/NJDTS01.PNG',
        './Himage/LCJZ02.PNG',
        './Himage/CSHZ02.PNG',
        './Himage/BTDZ02.PNG',
        '../images/logo01.png'
    ];

    imagesToPreload.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
    });
}

// 等待DOM完全加载后执行（确保导航栏元素已渲染）
document.addEventListener('DOMContentLoaded', function () {
    // 预加载图片
    preloadHistoricalImages();
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

    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    const timelineItems = document.querySelectorAll('.year-timeline .year-item');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.year-progress-bar');

    function activateYear(year) {
        timelineItems.forEach(i => i.classList.toggle('active', i.getAttribute('data-year') === year));
        if (progressBar) {
            const index = Math.max(0, Math.min(14, parseInt(year, 10) - 1931));
            progressBar.style.width = (index / 14) * 100 + '%';
        }
    }

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const year = item.getAttribute('data-year');
            let targetSlide = null;
            slides.forEach(slide => {
                const h2 = slide.querySelector('h2');
                if (h2 && h2.textContent.includes(year)) targetSlide = slide;
            });
            if (targetSlide) {
                const offset = window.innerWidth <= 768 ? 140 : 100;
                const elementPosition = targetSlide.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                const img = targetSlide.querySelector('.img-box img');
                if (img) {
                    img.classList.add('pulse');
                    setTimeout(() => img.classList.remove('pulse'), 800);
                }
                activateYear(year);
            }
        });
    });

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h2 = entry.target.querySelector('h2');
                if (h2) activateYear(h2.textContent.trim());
            }
        });
    }, { threshold: 0.5 });

    slides.forEach(slide => timelineObserver.observe(slide));

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

    // 文字飘落效果
    class FallingTextEffect {
        constructor() {
            this.container = this.createContainer();
            this.fallingTexts = [];
            this.isAnimating = false;

            // 文字内容配置
            this.texts = {
                传承: [
                    '赵一曼', '杨靖宇', '张自忠', '左权', '佟麟阁',
                    '七七事变', '九一八事变', '淞沪会战', '平型关大捷',
                    '台儿庄战役', '百团大战', '南京保卫战', '武汉会战',
                    '地道战', '地雷战', '游击战', '持久战',
                    '狼牙山五壮士', '八女投江', '东北抗联',
                    '卢沟桥事变', '西安事变', '重庆谈判'
                ],
                发展: [
                    '热血沸腾', '奋勇向前', '砥砺前行', '自强不息',
                    '爱国奉献', '团结奋斗', '艰苦奋斗', '开拓创新',
                    '振兴中华', '民族复兴', '众志成城', '共克时艰',
                    '不忘初心', '牢记使命', '继往开来', '与时俱进',
                    '薪火相传', '红色基因', '民族精神', '家国情怀'
                ],
                未来: [
                    '梦想启航', '青春无悔', '未来可期', '勇往直前',
                    '逐梦前行', '使命在肩', '责任重大', '大有可为',
                    '少年强则国强', '为中华之崛起而读书',
                    '中国梦', '强国梦', '复兴梦',
                    '少年智则国智', '少年富则国富', '少年独立则国独立',
                    '奋斗青春', '不负韶华', '只争朝夕'
                ]
            };

            this.initEventListeners();
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'falling-text-container';
            document.body.appendChild(container);
            return container;
        }

        initEventListeners() {
            const circleTexts = document.querySelectorAll('.circle-text');
            circleTexts.forEach(textElement => {
                textElement.addEventListener('click', () => {
                    const textType = textElement.textContent;
                    if (this.texts[textType]) {
                        this.startFallingEffect(this.texts[textType]);
                    }
                });
            });
        }

        startFallingEffect(textArray) {
            if (this.isAnimating) return;

            this.isAnimating = true;

            // 创建多个文字元素
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const text = this.createFallingText(textArray);
                    this.container.appendChild(text);
                    this.fallingTexts.push(text);

                    // 动画结束后移除元素
                    text.addEventListener('animationend', () => {
                        text.remove();
                        this.fallingTexts = this.fallingTexts.filter(t => t !== text);
                        if (this.fallingTexts.length === 0) {
                            this.isAnimating = false;
                        }
                    });
                }, i * 100);
            }
        }

        createFallingText(textArray) {
            const textElement = document.createElement('div');
            textElement.className = 'falling-text';

            // 随机选择文字
            const randomText = textArray[Math.floor(Math.random() * textArray.length)];
            textElement.textContent = randomText;

            // 随机样式
            textElement.style.left = Math.random() * 100 + '%';
            textElement.style.fontSize = (Math.random() * 24 + 16) + 'px';
            textElement.style.color = this.getRandomColor();
            textElement.style.animationDuration = (Math.random() * 5 + 5) + 's';
            textElement.style.animationDelay = Math.random() * 2 + 's';
            textElement.style.opacity = Math.random() * 0.5 + 0.5;
            textElement.style.zIndex = Math.floor(Math.random() * 100);

            return textElement;
        }

        getRandomColor() {
            const colors = [
                '#C8102E', '#971126', '#FF6B6B', '#FFA5A5',
                '#FF4757', '#FF3742', '#E84118', '#C23616'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }

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

    // 初始化文字飘落效果
    new FallingTextEffect();
});