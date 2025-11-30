/**
 * 蔬果線上型錄 - 後台管理系統 JavaScript
 * 提供側邊欄切換、模態框控制、表格操作等功能
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 全域變數
    // ==========================================
    let currentModal = null;
    let currentChart = null;
    
    // ==========================================
    // 側邊欄控制
    // ==========================================
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // 保存狀態到 localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    // 恢復側邊欄狀態
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
        sidebar?.classList.add('collapsed');
        mainContent?.classList.add('expanded');
    }
    
    // 移動端側邊欄控制
    function setupMobileSidebar() {
        if (window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                display: none;
            `;
            document.body.appendChild(overlay);
            
            sidebarToggle?.addEventListener('click', function() {
                sidebar?.classList.toggle('show');
                overlay.style.display = sidebar?.classList.contains('show') ? 'block' : 'none';
            });
            
            overlay.addEventListener('click', function() {
                sidebar?.classList.remove('show');
                overlay.style.display = 'none';
            });
        }
    }
    
    setupMobileSidebar();
    window.addEventListener('resize', setupMobileSidebar);
    
    // ==========================================
    // 導航激活狀態
    // ==========================================
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavigation();
    
    // ==========================================
    // 模態框控制
    // ==========================================
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('fade-in');
            currentModal = modal;
            document.body.style.overflow = 'hidden';
        }
    }
    
    function hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('fade-in');
            currentModal = null;
            document.body.style.overflow = 'auto';
        }
    }
    
    // 綁定模態框控制事件
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal-target');
            showModal(modalId);
        });
    });
    
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(currentModal);
            }
        });
    });
    
    // ESC 鍵關閉模態框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            hideModal(currentModal);
        }
    });
    
    // ==========================================
    // 表格操作
    // ==========================================
    
    // 全選功能
    const selectAllCheckbox = document.querySelector('#selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllState();
            updateBulkActions();
        });
    });
    
    function updateSelectAllState() {
        if (selectAllCheckbox) {
            const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
            const totalCount = rowCheckboxes.length;
            
            selectAllCheckbox.checked = checkedCount === totalCount && totalCount > 0;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
        }
    }
    
    function updateBulkActions() {
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
        const bulkActions = document.querySelector('.bulk-actions');
        
        if (bulkActions) {
            bulkActions.style.display = checkedCount > 0 ? 'block' : 'none';
        }
    }
    
    // 刪除確認
    document.querySelectorAll('[data-action="delete"]').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemName = this.getAttribute('data-item-name') || '此項目';
            const confirmMessage = `確定要刪除 "${itemName}" 嗎？此操作無法復原。`;
            
            if (confirm(confirmMessage)) {
                // 這裡添加實際的刪除邏輯
                showNotification('項目已成功刪除', 'success');
                
                // 模擬刪除行為（移除表格行）
                const row = this.closest('tr');
                if (row) {
                    row.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    });
    
    // ==========================================
    // 搜尋功能
    // ==========================================
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
    }
    
    function performSearch(query) {
        // 這裡實現搜尋邏輯
        console.log('搜尋:', query);
        
        if (query.length > 0) {
            // 模擬搜尋結果
            showNotification(`搜尋 "${query}" 中...`, 'info');
        }
    }
    
    // ==========================================
    // 通知系統
    // ==========================================
    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} slide-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)} notification-icon"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1100;
            min-width: 300px;
            background: white;
            border-left: 4px solid ${getNotificationColor(type)};
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 1rem;
            margin-bottom: 0.5rem;
        `;
        
        document.body.appendChild(notification);
        
        // 自動移除
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
    
    // ==========================================
    // 表單驗證
    // ==========================================
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, '此欄位為必填');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#dc3545';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // 綁定表單提交事件
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('請填寫所有必填欄位', 'error');
            }
        });
    });
    
    // ==========================================
    // 圖片上傳預覽
    // ==========================================
    document.querySelectorAll('input[type="file"]').forEach(fileInput => {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewContainer = this.parentNode.querySelector('.image-preview') || 
                                   this.nextElementSibling?.classList.contains('image-preview') ? 
                                   this.nextElementSibling : null;
            
            if (file && previewContainer) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.innerHTML = `
                        <img src="${e.target.result}" alt="預覽圖片" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                        <button type="button" class="btn-admin btn-sm btn-danger" onclick="clearImagePreview(this)">
                            <i class="fas fa-trash"></i> 移除
                        </button>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    });
    
    // ==========================================
    // 排序功能
    // ==========================================
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            const currentSort = this.getAttribute('data-sort') || 'none';
            let newSort;
            
            // 重設所有排序指示器
            document.querySelectorAll('.sortable-header').forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // 設定新排序方向
            if (currentSort === 'none' || currentSort === 'desc') {
                newSort = 'asc';
                this.classList.add('sort-asc');
            } else {
                newSort = 'desc';
                this.classList.add('sort-desc');
            }
            
            this.setAttribute('data-sort', newSort);
            
            // 執行排序（這裡需要根據實際需求實現）
            sortTable(column, newSort);
        });
    });
    
    function sortTable(column, direction) {
        // 這裡實現表格排序邏輯
        console.log(`排序欄位: ${column}, 方向: ${direction}`);
        showNotification(`按 ${column} ${direction === 'asc' ? '升序' : '降序'} 排序`, 'info', 1500);
    }
    
    // ==========================================
    // 頁面載入效果
    // ==========================================
    function addLoadingEffects() {
        const elements = document.querySelectorAll('.admin-card, .stat-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    addLoadingEffects();
    
    // ==========================================
    // 圖表初始化（如果有 Chart.js）
    // ==========================================
    function initializeCharts() {
        const chartElements = document.querySelectorAll('.chart-container canvas');
        
        chartElements.forEach(canvas => {
            const chartType = canvas.getAttribute('data-chart-type') || 'line';
            const chartData = JSON.parse(canvas.getAttribute('data-chart-data') || '{}');
            
            // 這裡可以初始化圖表庫（如 Chart.js）
            console.log(`初始化 ${chartType} 圖表`, chartData);
        });
    }
    
    // ==========================================
    // 導出功能
    // ==========================================
    document.querySelectorAll('[data-action="export"]').forEach(exportBtn => {
        exportBtn.addEventListener('click', function() {
            const format = this.getAttribute('data-format') || 'csv';
            const tableName = this.getAttribute('data-table') || 'data';
            
            showNotification(`正在導出 ${format.toUpperCase()} 格式...`, 'info');
            
            // 模擬導出延遲
            setTimeout(() => {
                showNotification(`${tableName} 已成功導出為 ${format.toUpperCase()} 格式`, 'success');
            }, 2000);
        });
    });
    
    // ==========================================
    // 自動保存功能
    // ==========================================
    let autoSaveTimeout;
    
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            
            autoSaveTimeout = setTimeout(() => {
                autoSave();
            }, 2000);
        });
    });
    
    function autoSave() {
        // 這裡實現自動保存邏輯
        const statusIndicator = document.querySelector('.auto-save-status');
        if (statusIndicator) {
            statusIndicator.textContent = '已自動保存';
            statusIndicator.style.color = '#28a745';
            
            setTimeout(() => {
                statusIndicator.textContent = '';
            }, 3000);
        }
    }
    
    // ==========================================
    // 鍵盤快捷鍵
    // ==========================================
    document.addEventListener('keydown', function(e) {
        // Ctrl + S 保存
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.querySelector('[data-action="save"]');
            if (saveBtn) {
                saveBtn.click();
            }
        }
        
        // Ctrl + N 新增
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            const addBtn = document.querySelector('[data-action="add"]');
            if (addBtn) {
                addBtn.click();
            }
        }
    });
});

// ==========================================
// 全域功能函數
// ==========================================

function clearImagePreview(button) {
    const previewContainer = button.parentNode;
    const fileInput = previewContainer.parentNode.querySelector('input[type="file"]');
    
    previewContainer.innerHTML = '';
    if (fileInput) {
        fileInput.value = '';
    }
}

function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

function formatNumber(number, options = {}) {
    return new Intl.NumberFormat('zh-TW', options).format(number);
}

function formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('zh-TW', options).format(new Date(date));
}

// ==========================================
// 動畫樣式
// ==========================================
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        flex-shrink: 0;
    }
    
    .notification-message {
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 2px;
        transition: all 0.3s ease;
    }
    
    .notification-close:hover {
        color: #333;
        background: rgba(0, 0, 0, 0.05);
    }
    
    .sortable-header {
        cursor: pointer;
        position: relative;
        user-select: none;
        transition: background-color 0.3s ease;
    }
    
    .sortable-header:hover {
        background-color: rgba(45, 80, 22, 0.05);
    }
    
    .sortable-header::after {
        content: '';
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        border: 4px solid transparent;
        border-bottom-color: #ccc;
    }
    
    .sortable-header.sort-asc::after {
        border-bottom-color: var(--primary-green);
        border-top-color: transparent;
    }
    
    .sortable-header.sort-desc::after {
        border-top-color: var(--primary-green);
        border-bottom-color: transparent;
    }
    
    .auto-save-status {
        font-size: 0.875rem;
        margin-left: 1rem;
        transition: color 0.3s ease;
    }
    
    .sidebar-overlay {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .sidebar-overlay.show {
        opacity: 1;
    }
`;
document.head.appendChild(additionalStyles);