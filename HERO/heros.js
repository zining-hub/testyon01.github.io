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

// 英雄卡片数据
const heroesData = [
    {
        id: 1,
        name: '彭德怀',
        title: '百战名将',
        image: 'images/pengdehuai.jpg',
        description: '中国人民解放军杰出的军事家、政治家，为新中国建立立下赫赫战功。',
        details: '彭德怀（1898-1974），中华人民共和国开国元帅，中国人民志愿军司令员兼政治委员。在抗美援朝战争中，他指挥中国人民志愿军与美军作战，取得了重大胜利。他一生戎马，战功赫赫，被誉为"百战名将"。',
        period: '1898-1974',
        achievements: '抗美援朝战争总指挥、开国元帅'
    },
    {
        id: 2,
        name: '赵一曼',
        title: '巾帼英雄',
        image: 'images/zhaoyiman.jpg',
        description: '东北抗日联军著名女英雄，为民族解放事业献出宝贵生命。',
        details: '赵一曼（1905-1936），原名李坤泰，四川宜宾人。1935年任东北抗日联军第三军二团政委，在与日寇的斗争中被捕，遭受酷刑坚贞不屈，最终英勇就义，年仅31岁。她的事迹激励了无数后人。',
        period: '1905-1936',
        achievements: '东北抗日联军政委、革命烈士'
    },
    {
        id: 3,
        name: '杨靖宇',
        title: '铁血将军',
        image: 'images/yangjingyu.jpg',
        description: '东北抗日联军总司令，在极端困难条件下坚持抗战到底。',
        details: '杨靖宇（1905-1940），原名马尚德，河南确山人。东北抗日联军创建人和领导人之一。在零下40度的严寒中，他以草根、树皮充饥，坚持战斗，最终壮烈牺牲。日军解剖其遗体时，发现胃里只有枯草、树皮和棉絮，无一粒粮食。',
        period: '1905-1940',
        achievements: '东北抗日联军总司令、民族英雄'
    }
    // 可以添加更多英雄数据
];

// 创建英雄卡片
function createHeroCards() {
    const container = document.querySelector('.heroes-container');
    if (!container) return;

    heroesData.forEach((hero, index) => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${hero.image}" alt="${hero.name}" class="hero-img" loading="lazy">
            <div class="hero-info">
                <h3>${hero.name}</h3>
                <p class="hero-desc">${hero.description}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(hero));
        container.appendChild(card);
    });
}

// 模态框功能
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');

function openModal(hero) {
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="${hero.image}" alt="${hero.name}" class="modal-header-img">
        </div>
        <div class="modal-body">
            <button class="modal-close">&times;</button>
            <h2>${hero.name}</h2>
            <div class="hero-meta">
                <p><strong>称号：</strong>${hero.title}</p>
                <p><strong>生卒年：</strong>${hero.period}</p>
                <p><strong>主要成就：</strong>${hero.achievements}</p>
            </div>
            <div class="hero-detail">
                ${hero.details}
            </div>
            <a href="#" class="related-link">了解更多</a>
        </div>
    `;
    
    // 重新绑定关闭按钮事件
    const newCloseBtn = modalContent.querySelector('.modal-close');
    newCloseBtn.addEventListener('click', closeModal);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // 延迟重置内容，避免动画时闪烁
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';
        }
    }, 300);
}

// 点击模态框外部关闭
modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeModal();
    }
});

// 防止模态框内容点击事件冒泡
modal?.addEventListener('click', (e) => {
    if (e.target.closest('.modal-content')) {
        e.stopPropagation();
    }
});

// 窗口大小变化处理
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // 移动端关闭菜单
    if (isMobile && mainNav.classList.contains('mobile-open')) {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }
}

window.addEventListener('resize', handleResize);

// 图片懒加载优化
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
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

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 页面加载完成后初始化
function initHeroesPage() {
    createHeroCards();
    lazyLoadImages();
    
    // 添加页面加载动画
    document.body.classList.add('loaded');
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroesPage);
} else {
    initHeroesPage();
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (modal?.classList.contains('active')) {
        closeModal();
    }
});
