// 等待整个DOM内容加载完成后再执行脚本
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

    // 传承承诺按钮逻辑
    const commitButton = document.querySelector('.commit-btn');
    const commitInput = document.querySelector('.commit-input');

    if (commitButton) {
        commitButton.addEventListener('click', function() {
            const content = commitInput.value.trim();
            if (content) {
                showNotification('感谢您的参与！您的承诺已记录。', 'success');
                commitInput.value = '';
                
                // 添加成功动画
                commitButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    commitButton.style.transform = '';
                }, 200);
            } else {
                showNotification('请输入您的承诺内容！', 'warning');
                
                // 输入框震动效果
                commitInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    commitInput.style.animation = '';
                }, 500);
            }
        });

        // 支持回车提交
        commitInput?.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                commitButton.click();
            }
        });
    }

    // 学习心得和红色故事讲述的提交逻辑
    const submitButtons = document.querySelectorAll('.card-submit-btn');

    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.interactive-card');
            const type = this.getAttribute('data-type');
            const textarea = card.querySelector('.card-textarea');
            const content = textarea.value.trim();

            if (!content) {
                showNotification(`请输入您要分享的${type}！`, 'warning');
                
                // 输入框震动效果
                textarea.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    textarea.style.animation = '';
                }, 500);
                return;
            }

            // 检查内容长度
            if (content.length < 10) {
                showNotification(`${type}内容至少需要10个字符！`, 'warning');
                return;
            }

            // 模拟提交成功
            showNotification(`感谢分享！您的${type}已成功提交。`, 'success');
            textarea.value = '';

            // 如果是故事卡片，也清空文件选择
            if (type === '故事') {
                const fileInput = card.querySelector('.file-input');
                const fileNameSpan = card.querySelector('.file-name');
                if (fileInput && fileNameSpan) {
                    fileInput.value = '';
                    fileNameSpan.textContent = '未选择文件';
                }
            }

            // 添加成功动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // 文件选择后显示文件名
    const storyFileInputs = document.querySelectorAll('.file-input');
    
    storyFileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileNameSpan = this.parentElement.querySelector('.file-name');
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                const fileName = file.name;
                const fileSize = (file.size / 1024).toFixed(2) + ' KB';
                
                // 检查文件大小（限制5MB）
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('文件大小不能超过5MB！', 'warning');
                    this.value = '';
                    fileNameSpan.textContent = '未选择文件';
                    return;
                }
                
                fileNameSpan.textContent = `${fileName} (${fileSize})`;
                fileNameSpan.style.color = 'var(--primary-color)';
            } else {
                fileNameSpan.textContent = '未选择文件';
                fileNameSpan.style.color = '#888';
            }
        });
    });

    // 搜索功能逻辑
    const searchBtn = document.querySelector('.search-area button');
    const searchInput = document.querySelector('.search-area input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            if (searchText) {
                showNotification(`正在搜索"${searchText}"，结果将为您展示～`, 'success');
                // 模拟搜索延迟
                setTimeout(() => {
                    showNotification(`找到${Math.floor(Math.random() * 20) + 1}条相关结果`, 'success');
                }, 1500);
            } else {
                showNotification('请输入搜索关键词！', 'warning');
                searchInput.focus();
            }
        });

        // 支持回车搜索
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // 实时搜索建议（可选）
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const value = this.value.trim();
            
            if (value.length > 0) {
                searchTimeout = setTimeout(() => {
                    // 这里可以添加搜索建议逻辑
                    console.log('搜索建议:', value);
                }, 300);
            }
        });
    }

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
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 添加图标
        const icon = type === 'success' ? '✓' : '⚠';
        notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;

        document.body.appendChild(notification);

        // 触发显示动画
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
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

    // 表单验证增强
    function validateForm(input, minLength = 10, maxLength = 500) {
        const value = input.value.trim();
        
        if (value.length < minLength) {
            showNotification(`内容至少需要${minLength}个字符！`, 'warning');
            return false;
        }
        
        if (value.length > maxLength) {
            showNotification(`内容不能超过${maxLength}个字符！`, 'warning');
            return false;
        }
        
        return true;
    }

    // 为所有文本框添加字符计数
    const textareas = document.querySelectorAll('.card-textarea, .commit-input');
    textareas.forEach(textarea => {
        const maxLength = textarea.classList.contains('commit-input') ? 200 : 500;
        
        // 创建字符计数器
        const counter = document.createElement('div');
        counter.style.cssText = `
            font-size: 12px;
            color: #888;
            text-align: right;
            margin-top: 5px;
        `;
        counter.textContent = `0/${maxLength}`;
        textarea.parentNode.appendChild(counter);

        // 更新计数
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength) {
                counter.style.color = 'var(--primary-color)';
                this.value = this.value.substring(0, maxLength);
            } else if (length > maxLength * 0.8) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = '#888';
            }
        });
    });

    // 页面加载完成提示
    console.log('红色传承页面已加载完成');

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
});
