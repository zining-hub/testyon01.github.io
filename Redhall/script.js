// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
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

    // 搜索功能逻辑
    const searchBtn = document.querySelector('.search-area button');
    const searchInput = document.querySelector('.search-area input');

    if (searchBtn && searchInput) {
        // 点击搜索按钮
        searchBtn.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            if (searchText) {
                showNotification(`正在搜索"${searchText}"相关展厅，结果将为您展示～`, 'success');
                
                // 模拟搜索延迟
                setTimeout(() => {
                    const results = Math.floor(Math.random() * 8) + 1;
                    showNotification(`找到${results}个相关展厅`, 'success');
                }, 1500);
            } else {
                showNotification('请输入搜索关键词（如"烽火印记""民族先锋"）！', 'warning');
                searchInput.focus();
                
                // 输入框震动效果
                searchInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    searchInput.style.animation = '';
                }, 500);
            }
        });

        // 回车触发搜索
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // 实时搜索建议
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const value = this.value.trim();
            
            if (value.length > 0) {
                searchTimeout = setTimeout(() => {
                    console.log('搜索建议:', value);
                    // 这里可以添加搜索建议逻辑
                }, 300);
            }
        });
    }

    // VR展厅卡片点击统计和交互
    const vrCards = document.querySelectorAll('.vr-card');
    
    vrCards.forEach(card => {
        // 鼠标进入效果
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1.1)';
            }
        });

        // 鼠标离开效果
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1)';
            }
        });

        // 点击事件
        card.addEventListener('click', function(e) {
            // 如果是更多展厅卡片，特殊处理
            if (this.classList.contains('vr-card-more')) {
                e.preventDefault();
                showNotification('更多展厅功能正在开发中，敬请期待！', 'success');
                return;
            }

            const hallName = this.querySelector('h3').textContent;
            const hallDesc = this.querySelector('p').textContent;
            
            console.log(`访问展厅：${hallName}`);
            console.log(`展厅描述：${hallDesc}`);
            
            // 模拟进入展厅
            showNotification(`正在进入"${hallName}"展厅...`, 'success');
            
            // 添加点击动画
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 如需埋点统计，可在此添加接口请求
            // analytics.track('vr_hall_visit', { hall_name: hallName });
        });

        // 键盘支持
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // 添加震动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // 显示通知消息
    function showNotification(message, type = 'success') {
        // 移除已存在的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // 添加图标
        const icon = type === 'success' ? '✓' : '⚠';
        notification.innerHTML = `<span style="margin-right: 8px; font-size: 18px;">${icon}</span>${message}`;

        document.body.appendChild(notification);

        // 触发显示动画
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // 3.5秒后隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3500);
    }

    // 窗口大小变化处理
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // 移动端关闭菜单
        if (isMobile && mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
        
        // 重新计算卡片布局
        if (vrCards.length > 0) {
            // 触发重新布局
            const container = document.querySelector('.vr-cards-container');
            if (container) {
                container.style.display = 'none';
                requestAnimationFrame(() => {
                    container.style.display = '';
                });
            }
        }
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
        // ESC键关闭移动菜单
        if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
        
        // Ctrl+K 聚焦搜索框
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
    });

    // 页面滚动效果
    let lastScrollTop = 0;
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.top-header');
        const nav = document.querySelector('.main-nav');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动 - 隐藏头部
            header.style.transform = 'translateY(-100%)';
            nav.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动 - 显示头部
            header.style.transform = 'translateY(0)';
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }

    // 移动端不应用滚动隐藏
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', debounce(handleScroll, 50));
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
            console.log(`纪念展馆页面加载时间: ${loadTime}ms`);
            
            // 如果加载时间过长，显示提示
            if (loadTime > 3000) {
                setTimeout(() => {
                    showNotification('页面加载较慢，建议检查网络连接', 'warning');
                }, 2000);
            }
        }
    }

    window.addEventListener('load', logPerformance);

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('页面错误:', e.error);
        showNotification('页面出现错误，请刷新重试', 'warning');
    });

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (mainNav.classList.contains('mobile-open')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
    });

    // 页面可见性变化处理
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停动画等
            console.log('页面已隐藏');
        } else {
            // 页面显示时恢复
            console.log('页面已显示');
        }
    });

    // 初始化完成提示
    console.log('纪念展馆页面已加载完成');
});
