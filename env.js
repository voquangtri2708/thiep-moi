// Cấu hình môi trường Client-side công khai cho Cloudinary CDN (Hỗ trợ upload đa thiết bị)
window.ENV = window.ENV || {
  CLOUDINARY_CLOUD_NAME: "dvr2rr5hj",
  CLOUDINARY_UPLOAD_PRESET: "thiepmoi",
  CLOUDINARY_FOLDER: "album",
  CLOUDINARY_API_KEY: ""
};

// Khôi phục cấu hình môi trường tùy chỉnh đã lưu trong trình duyệt nếu có
(function () {
  try {
    const savedEnv = localStorage.getItem('partyinvi_env_config');
    if (savedEnv) {
      const parsed = JSON.parse(savedEnv);
      window.ENV = { ...window.ENV, ...parsed };
    }
  } catch (e) {
    console.warn("Lỗi đọc env config:", e);
  }
})();
