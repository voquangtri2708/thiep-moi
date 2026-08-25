// Cấu hình môi trường Client-side cho Cloudinary CDN & Supabase Database
window.ENV = window.ENV || {
  CLOUDINARY_CLOUD_NAME: "dvr2rr5hj",
  CLOUDINARY_UPLOAD_PRESET: "thiepmoi",
  CLOUDINARY_FOLDER: "album",
  CLOUDINARY_API_KEY: "",
  SUPABASE_URL: "https://chlmoxetjlkpjihzahia.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_TZJcSI8nKC-c-PloNF3cTg_oItKmHuR"
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
