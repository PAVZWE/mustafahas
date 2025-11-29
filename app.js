// معرّف فريد للمستخدم الحالي
const userId = "user_" + Math.random().toString(36).substr(2, 9);
console.log("🆔 معرّف المستخدم الخاص بك:", userId);

// متغير لحفظ المنشورات
let allPosts = [];

// ========================================
// عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 جاري تحميل الصفحة...");
    loadAllPosts();
    
    // ربط نموذج المنشور بمستمع الحدث
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);
    
    // بدء مراقبة الاتصال بقاعدة البيانات كل 5 ثواني
    monitorDatabaseConnection();
});

// ========================================
// 🔌 مراقبة الاتصال بقاعدة البيانات
// ========================================
async function monitorDatabaseConnection() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    // التحقق الأول فوراً
    await updateConnectionStatus();
    
    // التحقق كل 5 ثواني
    setInterval(async () => {
        await updateConnectionStatus();
    }, 5000);
}

async function updateConnectionStatus() {
    const result = await checkDatabaseConnection();
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (result.connected) {
        // متصل - أخضر
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.classList.remove('disconnected');
        statusText.classList.add('connected');
        statusText.textContent = '✓ متصل بقاعدة البيانات';
    } else {
        // معطل - أحمر
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.classList.remove('connected');
        statusText.classList.add('disconnected');
        statusText.textContent = '✗ معطل - لا يوجد اتصال';
    }
}

// ========================================
// تحميل جميع المنشورات
// ========================================
async function loadAllPosts() {
    const container = document.getElementById('postsContainer');
    
    try {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                جاري تحميل المنشورات...
            </div>
        `;
        
        allPosts = await fetchAllPosts();
        
        if (allPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>📭 لا توجد منشورات حالياً</h2>
                    <p>كن أول من ينشر!</p>
                </div>
            `;
            return;
        }
        
        // عرض كل منشور
        container.innerHTML = allPosts.map((post, index) => createPostHTML(post, index)).join('');
        
        // ربط الأزرار بمستمعي الأحداث
        attachEventListeners();
        
    } catch (error) {
        showError("❌ خطأ في تحميل المنشورات: " + error.message);
        container.innerHTML = '';
    }
}

// ========================================
// إنشاء HTML المنشور
// ========================================
function createPostHTML(post, index) {
    return `
        <div class="post-card" data-post-id="${post.id}" data-index="${index}">
            <!-- رأس المنشور -->
            <div class="post-header">
                <img src="${post.authorAvatar}" alt="${post.authorName}" class="post-avatar">
                <div class="post-author-info">
                    <div class="post-author-name">${escapeHTML(post.authorName)}</div>
                    <div class="post-author-handle">@${escapeHTML(post.authorHandle)}</div>
                </div>
                <div class="post-time">${formatTime(post.createdAt)}</div>
            </div>
            
            <!-- محتوى المنشور -->
            <div class="post-content">
                ${escapeHTML(post.content)}
            </div>
            
            <!-- صورة المنشور (إن وجدت) -->
            ${post.image ? `<img src="${post.image}" alt="صورة المنشور" class="post-image">` : ''}
            
            <!-- إحصائيات المنشور -->
            <div class="post-stats">
                <div class="stat-item">❤️ ${post.likeCount} إعجابات</div>
                <div class="stat-item">💬 ${post.commentCount} تعليقات</div>
            </div>
            
            <!-- أزرار الإجراءات -->
            <div class="post-actions">
                <button class="action-btn like-btn" data-post-id="${post.id}">
                    ❤️ إعجاب
                </button>
                <button class="action-btn comment-toggle-btn" data-post-id="${post.id}">
                    💬 تعليق
                </button>
            </div>
            
            <!-- قسم التعليقات (مخفي بالأساس) -->
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-title">📢 التعليقات</div>
                <div id="comments-list-${post.id}" class="comments-list"></div>
                <div class="add-comment-form">
                    <input type="text" 
                           id="comment-input-${post.id}" 
                           placeholder="أضف تعليق..." 
                           class="comment-input">
                    <button type="button" 
                            class="add-comment-btn" 
                            data-post-id="${post.id}">
                        إرسال
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// ربط مستمعي الأحداث (الأزرار)
// ========================================
function attachEventListeners() {
    // أزرار الإعجاب
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handleLikeClick);
    });
    
    // أزرار التعليق
    document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleCommentToggle);
    });
    
    // أزرار إرسال التعليق
    document.querySelectorAll('.add-comment-btn').forEach(btn => {
        btn.addEventListener('click', handleCommentSubmit);
    });
}

// ========================================
// معالج الإعجاب
// ========================================
async function handleLikeClick(event) {
    const button = event.target.closest('.like-btn');
    const postId = button.getAttribute('data-post-id');
    
    try {
        button.disabled = true;
        button.textContent = "⏳ جاري...";
        
        await togglePostLike(postId, userId);
        
        // إعادة تحميل المنشورات لتحديث العدادات
        await loadAllPosts();
        
    } catch (error) {
        showError("❌ خطأ في الإعجاب: " + error.message);
        button.disabled = false;
        button.textContent = "❤️ إعجاب";
    }
}

// ========================================
// معالج إظهار/إخفاء التعليقات
// ========================================
async function handleCommentToggle(event) {
    const button = event.target.closest('.comment-toggle-btn');
    const postId = button.getAttribute('data-post-id');
    const commentsSection = document.getElementById(`comments-${postId}`);
    
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        await loadComments(postId);
    } else {
        commentsSection.style.display = 'none';
    }
}

// ========================================
// تحميل التعليقات
// ========================================
async function loadComments(postId) {
    try {
        const comments = await fetchPostComments(postId);
        const commentsList = document.getElementById(`comments-list-${postId}`);
        
        if (comments.length === 0) {
            commentsList.innerHTML = `<div class="no-comments">لا توجد تعليقات حالياً</div>`;
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-author">${escapeHTML(comment.author)}</div>
                <div class="comment-text">${escapeHTML(comment.content)}</div>
                <div class="comment-time">${formatTime(comment.createdAt)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error("خطأ:", error);
    }
}

// ========================================
// معالج إرسال التعليق
// ========================================
async function handleCommentSubmit(event) {
    const button = event.target;
    const postId = button.getAttribute('data-post-id');
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    
    if (!content) {
        showError("❌ الرجاء كتابة تعليق");
        return;
    }
    
    try {
        button.disabled = true;
        button.textContent = "⏳ جاري...";
        
        await addNewComment(postId, "زائر", "https://via.placeholder.com/40", content);
        
        input.value = '';
        await loadComments(postId);
        
    } catch (error) {
        showError("❌ خطأ في إضافة التعليق: " + error.message);
    } finally {
        button.disabled = false;
        button.textContent = "إرسال";
    }
}

// ========================================
// معالج إنشاء منشور جديد
// ========================================
async function handlePostSubmit(event) {
    event.preventDefault();
    
    const authorName = document.getElementById('authorName').value;
    const authorHandle = document.getElementById('authorHandle').value;
    const authorAvatar = document.getElementById('authorAvatar').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').value;
    
    try {
        const submitBtn = event.target.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ جاري النشر...";
        
        await createNewPost(authorName, authorHandle, authorAvatar, content, image);
        
        showSuccess("✅ تم نشر المنشور بنجاح!");
        event.target.reset();
        
        setTimeout(() => {
            loadAllPosts();
        }, 1000);
        
    } catch (error) {
        showError("❌ خطأ في النشر: " + error.message);
    } finally {
        const submitBtn = event.target.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.textContent = "✨ نشر الآن";
    }
}

// ========================================
// دوال مساعدة
// ========================================

// حماية من XSS
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// تنسيق الوقت
function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} د`;
    if (diffHours < 24) return `منذ ${diffHours} س`;
    if (diffDays < 7) return `منذ ${diffDays} ي`;
    
    return date.toLocaleDateString('ar-SA');
}

// عرض رسالة خطأ
function showError(message) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="error-message">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}

// عرض رسالة نجاح
function showSuccess(message) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="success-message">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}