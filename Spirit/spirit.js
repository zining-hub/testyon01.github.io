// 抗战精神页面JS文件，用于后续功能扩展
// 示例：可添加搜索功能、导航高亮、滚动动画等

// 1. 搜索功能（示例）
document.querySelector('.search-area button').addEventListener('click', function() {
    const searchText = document.querySelector('.search-area input').value.trim();
    if (searchText) {
        alert(`正在搜索关键词：${searchText}，后续可对接搜索接口实现功能`);
    } else {
        alert('请输入搜索内容');
    }
});

// 2. 导航栏滚动高亮（当前页面保持active状态）
const navLinks = document.querySelectorAll('.main-nav a');
const currentPath = window.location.pathname.replace(/\/$/, '');
navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});

// 3. 卡片滚动动画（可选）
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.connotation-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// 页面加载时初始化卡片状态
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.connotation-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    // 触发一次滚动事件，显示可视区域内的卡片
    window.dispatchEvent(new Event('scroll'));
});