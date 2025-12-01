// 等待整个DOM内容加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', function() {

    // --- 原有的“传承承诺”按钮逻辑 ---
    const commitButton = document.querySelector('.commit-btn');
    const commitInput = document.querySelector('.commit-input');

    if (commitButton) {
        commitButton.addEventListener('click', function() {
            if (commitInput.value.trim()) {
                showNotification('感谢您的参与！您的承诺已记录。');
                commitInput.value = '';
            } else {
                showNotification('请输入您的承诺内容！', 'warning');
            }
        });
    }

    // --- 新增：学习心得和红色故事讲述的提交逻辑 ---
    const submitButtons = document.querySelectorAll('.card-submit-btn');

    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 找到按钮所在的卡片
            const card = this.closest('.interactive-card');
            const type = this.getAttribute('data-type'); // 获取是“心得”还是“故事”

            // 找到卡片内的文本框
            const textarea = card.querySelector('.card-textarea');
            const content = textarea.value.trim();

            if (!content) {
                showNotification(`请输入您要分享的${type}！`, 'warning');
                return;
            }

            // 模拟提交成功
            showNotification(`感谢分享！您的${type}已成功提交。`);
            textarea.value = ''; // 清空文本框

            // 如果是故事卡片，也清空文件选择
            if (type === '故事') {
                const fileInput = card.querySelector('.file-input');
                const fileNameSpan = card.querySelector('.file-name');
                fileInput.value = ''; // 清空文件路径
                fileNameSpan.textContent = '未选择文件'; // 恢复默认文字
            }
        });
    });

    // --- 新增：文件选择后显示文件名 ---
    const storyFileInput = document.getElementById('story-file');
    const fileNameSpan = storyFileInput.nextElementSibling; // 获取显示文件名的span

    storyFileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameSpan.textContent = this.files[0].name;
        } else {
            fileNameSpan.textContent = '未选择文件';
        }
    });

    // --- 新增：搜索功能逻辑（适配头部搜索框） ---
    const searchBtn = document.querySelector('.search-area button');
    const searchInput = document.querySelector('.search-area input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            if (searchText) {
                showNotification(`正在搜索“${searchText}”，结果将为您展示～`);
                // 后续可对接后端搜索接口，此处为模拟逻辑
            } else {
                showNotification('请输入搜索关键词！', 'warning');
            }
        });
        // 支持回车搜索
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    /**
     * 显示一个自定义的通知消息
     * @param {string} message - 要显示的消息
     * @param {string} type - 消息类型 ('success' 或 'warning')
     */
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#ff9800',
            color: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '1000',
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.5s ease-in-out'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});