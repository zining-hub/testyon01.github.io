// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 2. 导航栏滚动高亮（当前页面保持active状态）
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
        const currentPath = window.location.pathname.replace(/\/$/, '');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // 搜索功能逻辑
    const searchBtn = document.querySelector('.search-area button');
    const searchInput = document.querySelector('.search-area input');

    if (searchBtn && searchInput) {
        // 点击搜索按钮
        searchBtn.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            if (searchText) {
                showNotification(`正在搜索“${searchText}”相关展厅，结果将为您展示～`);
            } else {
                showNotification('请输入搜索关键词（如“烽火印记”“民族先锋”）！', 'warning');
            }
        });

        // 回车触发搜索
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // VR展厅卡片点击统计
    const vrCards = document.querySelectorAll('.vr-card');
    vrCards.forEach(card => {
        card.addEventListener('click', function() {
            const hallName = this.querySelector('h3').textContent;
            console.log(`访问展厅：${hallName}`);
            // 如需埋点统计，可在此添加接口请求
        });
    });

    // 自定义通知组件（确保不被遮挡）
    function showNotification(message, type = 'success') {
        // 移除已存在的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 通知样式（层级最高，避免被导航遮挡）
        Object.assign(notification.style, {
            position: 'fixed',
            top: '120px', // 避开顶部导航（90px+60px）
            right: '20px',
            padding: '15px 25px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#ff9800',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1000', // 高于所有元素
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: 'translateY(-20px)'
        });

        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // 3.5秒后隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3500);
    }
});