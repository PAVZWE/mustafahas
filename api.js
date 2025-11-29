// 🔑 رابط قاعدة البيانات
const API_URL = "https://7044dc0f-77b4-4117-9da4-981caa0db8d8-00-wymzxwzs0vmn.spock.replit.dev";
// بعد النشر: const API_URL = "https://your-app-name.replit.app";

// ========================================
// 🔌 دالة التحقق من الاتصال بقاعدة البيانات
// ========================================
async function checkDatabaseConnection() {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // انتظر 5 ثواني فقط
    });
    
    if (response.ok) {
      console.log("✅ الاتصال بقاعدة البيانات: متصل");
      return { connected: true, message: 'متصل ✓' };
    } else {
      console.log("❌ الاتصال بقاعدة البيانات: معطل");
      return { connected: false, message: 'معطل ✗' };
    }
  } catch (error) {
    console.error("❌ خطأ في الاتصال:", error.message);
    return { connected: false, message: 'معطل ✗' };
  }
}

// ========================================
// 1️⃣ جلب جميع المنشورات من قاعدة البيانات
// ========================================
async function fetchAllPosts() {
  try {
    console.log("📥 جاري جلب المنشورات من قاعدة البيانات...");
    const response = await fetch(`${API_URL}/api/posts`);
    
    if (!response.ok) {
      throw new Error(`خطأ من السيرفر: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log("✅ تم جلب المنشورات بنجاح:", posts);
    return posts;
  } catch (error) {
    console.error("❌ خطأ في جلب المنشورات:", error);
    throw error;
  }
}

// ========================================
// 2️⃣ إنشاء منشور جديد وحفظه في قاعدة البيانات
// ========================================
async function createNewPost(authorName, authorHandle, authorAvatar, content, image) {
  try {
    console.log("📤 جاري إرسال منشور جديد إلى قاعدة البيانات...");
    
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authorName: authorName,
        authorHandle: authorHandle,
        authorAvatar: authorAvatar || "https://via.placeholder.com/60",
        content: content,
        image: image || null
      })
    });
    
    if (!response.ok) {
      throw new Error(`خطأ: ${response.status}`);
    }
    
    const newPost = await response.json();
    console.log("✅ تم إنشاء المنشور بنجاح:", newPost);
    return newPost;
  } catch (error) {
    console.error("❌ خطأ في إنشاء المنشور:", error);
    throw error;
  }
}

// ========================================
// 3️⃣ إضافة/إزالة إعجاب من قاعدة البيانات
// ========================================
async function togglePostLike(postId, userId) {
  try {
    console.log("❤️ جاري معالجة الإعجاب للمنشور:", postId);
    
    const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId
      })
    });
    
    if (!response.ok) {
      throw new Error(`خطأ: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("✅ تم تحديث الإعجاب:", result);
    return result;
  } catch (error) {
    console.error("❌ خطأ في الإعجاب:", error);
    throw error;
  }
}

// ========================================
// 4️⃣ جلب كل التعليقات لمنشور معين
// ========================================
async function fetchPostComments(postId) {
  try {
    console.log("💬 جاري جلب التعليقات للمنشور:", postId);
    
    const response = await fetch(`${API_URL}/api/posts/${postId}/comments`);
    
    if (!response.ok) {
      throw new Error(`خطأ: ${response.status}`);
    }
    
    const comments = await response.json();
    console.log("✅ تم جلب التعليقات:", comments);
    return comments;
  } catch (error) {
    console.error("❌ خطأ في جلب التعليقات:", error);
    throw error;
  }
}

// ========================================
// 5️⃣ إضافة تعليق جديد إلى قاعدة البيانات
// ========================================
async function addNewComment(postId, author, avatar, content) {
  try {
    console.log("📝 جاري إضافة تعليق جديد...");
    
    const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author: author,
        avatar: avatar || "https://via.placeholder.com/40",
        content: content
      })
    });
    
    if (!response.ok) {
      throw new Error(`خطأ: ${response.status}`);
    }
    
    const newComment = await response.json();
    console.log("✅ تم إضافة التعليق:", newComment);
    return newComment;
  } catch (error) {
    console.error("❌ خطأ في إضافة التعليق:", error);
    throw error;
  }
}