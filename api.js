const API_URL = "https://YOUR-APP-NAME.replit.app"; // غيّره برابط موقعك

async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`);
  return response.json();
}

async function toggleLike(postId, userId) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return response.json();
}
// غيّر هذا الرابط برابط موقعك بعد النشر
const API_URL = "https://YOUR-APP-NAME.replit.app";

// جلب جميع المنشورات مع عدد الإعجابات والتعليقات
async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`);
  return response.json();
}

// إضافة/إزالة إعجاب
async function toggleLike(postId, userId) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return response.json(); // يرجع { liked: true/false }
}

// جلب تعليقات منشور
async function getComments(postId) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`);
  return response.json();
}

// إضافة تعليق جديد
async function addComment(postId, author, avatar, content) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, avatar, content })
  });
  return response.json();
}

// إضافة منشور جديد
async function createPost(authorName, authorHandle, authorAvatar, content, image) {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorName, authorHandle, authorAvatar, content, image })
  });
  return response.json();
}
const API_URL = "https://your-app-name.replit.app";

// جلب جميع المنشورات
async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`);
  const posts = await response.json();
  return posts;
}
async function toggleLike(postId, userId) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId })
  });
  return response.json();
}
async function addComment(postId, author, content) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: author,
      avatar: "https://example.com/avatar.png",
      content: content
    })
  });
  return response.json();
}
async function getComments(postId) {
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`);
  return response.json();
}
