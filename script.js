// 1. DANH SÁCH NGÂN HÀNG VIỆT NAM CHUẨN VIETQR
const VIETNAM_BANKS = [
  { bin: "970422", name: "MBBank (Ngân hàng Quân Đội)" },
  { bin: "970436", name: "Vietcombank (VCB)" },
  { bin: "970407", name: "Techcombank (TCB)" },
  { bin: "970432", name: "VPBank" },
  { bin: "970416", name: "ACB (Ngân hàng Á Châu)" },
  { bin: "970418", name: "BIDV" },
  { bin: "970405", name: "Agribank" },
  { bin: "970415", name: "VietinBank" },
  { bin: "970423", name: "TPBank" },
  { bin: "970403", name: "Sacombank" },
  { bin: "970437", name: "HDBank" },
  { bin: "970448", name: "OCB (Phương Đông)" },
  { bin: "970426", name: "MSB (Hàng Hải)" },
  { bin: "970441", name: "VIB (Quốc Tế)" },
  { bin: "970443", name: "SHB" },
  { bin: "970431", name: "Eximbank" },
  { bin: "970440", name: "SeABank" },
  { bin: "970428", name: "Nam A Bank" }
];

// 2. CONFIG MẶC ĐỊNH MỪNG SINH NHẬT
const DEFAULT_CONFIG = {
  hostName: "Bảo Uyên",
  eventTitle: "Mừng Tiệc Sinh Nhật 2 Tuổi",
  greetingQuote: "Bước sang tuổi mới, chúc em luôn khỏe mạnh, ngoan ngoãn, hay ăn chóng lớn và luôn nhận được thật nhiều tình yêu thương từ mọi người xung quanh nhé!",
  invitationMessage: "Tới tham dự bữa tiệc sinh nhật thân mật cùng mình nhé!",
  eventDateISO: "2026-08-30T18:00",
  eventDateText: "18:00 • Chủ Nhật, 30/08/2026",
  lunarDateText: "(Nhằm ngày 25 tháng 7 năm Bính Ngọ)",
  locationName: "Tư gia",
  locationAddress: "Phước Bình - Bình Phước",
  avatarUrl: "https://lh3.googleusercontent.com/d/1rlLfnpyWB7Znq4QPGxyt7LjPFWEmCmig",
  galleryUrls: [
    "https://lh3.googleusercontent.com/d/1rlLfnpyWB7Znq4QPGxyt7LjPFWEmCmig",
    "https://lh3.googleusercontent.com/d/1aTFx1zM9MefWdewMk7QSWWwRYrD99eM3",
    "https://lh3.googleusercontent.com/d/1Tpn9gJce_AtRcXEoVROsNalhK8jGlCWI",
    "https://lh3.googleusercontent.com/d/1wmhtMbtQ9gju0KK8E4mhd3N458iNwj2G",
    "https://lh3.googleusercontent.com/d/1mhFXiBqlbwGN5wsHIN76i7-AH2wfUI1h",
    "https://lh3.googleusercontent.com/d/1xj7_mxoon1njBUFFNkydLGcCPxrfqRkr",
    "https://lh3.googleusercontent.com/d/1FYjdutDAArMH3clXba6Ku8PpHlcRqNLv"
  ],
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=acoustic-guitars-ambient-uplifting-112191.mp3",
  qr: {
    bankId: "970422",
    bankName: "MBBank",
    accountNo: "0347830406",
    accountName: "VO QUANG TRI",
    amount: "",
    addInfo: "Mung sinh nhat Bao Uyen"
  }
};

function loadStoredConfig() {
  try {
    const raw = localStorage.getItem('birthday_invitation_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        qr: {
          ...DEFAULT_CONFIG.qr,
          ...(parsed.qr || {})
        }
      };
    }
  } catch (e) {
    console.warn("Lỗi đọc config từ localStorage:", e);
  }
  return { ...DEFAULT_CONFIG };
}

// Global state
let config = loadStoredConfig();
let wishes = (JSON.parse(localStorage.getItem('birthday_wishes')) || [])
  .filter(w => w.name !== "Bạn Minh" && w.name !== "Chị Thảo");
let invitedGuests = JSON.parse(localStorage.getItem('invited_guests_list')) || [];

// 3. BẢO MẬT & ROUTER CLIENT-SIDE (Mật khẩu pass=2003)
function isPasscodeValid() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('pass') === '2003') {
    sessionStorage.setItem('partyinvi_pass', '2003');
    return true;
  }
  return sessionStorage.getItem('partyinvi_pass') === '2003';
}

function updateAuthUI() {
  const isAuth = isPasscodeValid();
  const btnSend = document.getElementById('navBtn-send');
  const btnEdit = document.getElementById('navBtn-edit');

  if (isAuth) {
    btnSend.classList.remove('hidden');
    btnEdit.classList.remove('hidden');
  } else {
    btnSend.classList.add('hidden');
    btnEdit.classList.add('hidden');
  }
}

function promptForPasscode() {
  const inputPass = prompt("🔒 Vui lòng nhập mật khẩu để quản lí thiệp");
  if (inputPass === '2003') {
    sessionStorage.setItem('partyinvi_pass', '2003');
    showToast("Xác thực quản trị thành công! 🎉", "success");
    updateAuthUI();
    return true;
  } else if (inputPass !== null) {
    showToast("Mật khẩu không chính xác!", "warning");
  }
  return false;
}

function getCurrentRoute() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');

  if (hash === '#/edit' || pageParam === 'edit' || path.endsWith('/edit') || path.endsWith('/edit.html')) return '/edit';
  if (hash === '#/send' || pageParam === 'send' || path.endsWith('/send') || path.endsWith('/send.html')) return '/send';
  return '/';
}

function switchRoute(route) {
  if (route === '/edit') window.location.hash = '#/edit';
  else if (route === '/send') window.location.hash = '#/send';
  else window.location.hash = '#/';

  renderView();
}

function renderView() {
  updateAuthUI();

  const route = getCurrentRoute();
  const viewHome = document.getElementById('view-home');
  const viewEdit = document.getElementById('view-edit');
  const viewSend = document.getElementById('view-send');

  const btnHome = document.getElementById('navBtn-home');
  const btnSend = document.getElementById('navBtn-send');
  const btnEdit = document.getElementById('navBtn-edit');

  // Kiểm tra mật khẩu quản trị cho các route bảo mật
  if ((route === '/edit' || route === '/send') && !isPasscodeValid()) {
    const authenticated = promptForPasscode();
    if (!authenticated) {
      window.location.hash = '#/';
      return renderView();
    }
  }

  // Reset styles
  [btnHome, btnSend, btnEdit].forEach(btn => {
    btn.classList.remove('bg-pink-500', 'text-white', 'shadow-xs');
    btn.classList.add('text-stone-600');
  });

  viewHome.classList.add('hidden');
  viewEdit.classList.add('hidden');
  viewSend.classList.add('hidden');

  if (route === '/edit') {
    viewEdit.classList.remove('hidden');
    btnEdit.classList.add('bg-pink-500', 'text-white', 'shadow-xs');
    btnEdit.classList.remove('text-stone-600');
    populateEditForm();
  } else if (route === '/send') {
    viewSend.classList.remove('hidden');
    btnSend.classList.add('bg-pink-500', 'text-white', 'shadow-xs');
    btnSend.classList.remove('text-stone-600');
    generateInviteLink();
    renderInvitedGuests();
  } else {
    viewHome.classList.remove('hidden');
    btnHome.classList.add('bg-pink-500', 'text-white', 'shadow-xs');
    btnHome.classList.remove('text-stone-600');
    renderInvitationCard();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. RENDER GIAO DIỆN THIỆP CHÍNH (VIEW HOME)
function convertGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return url;
  url = url.trim();

  // 1. Google Drive URL Conversion
  const fileDMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  const idParamMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  // 2. Cloudinary Auto-Format CDN (Tự động chuyển đổi định dạng HEIC/PNG sang JPG/WebP tương thích trình duyệt)
  if (url.includes('res.cloudinary.com')) {
    let optUrl = url;
    if (optUrl.includes('/upload/') && !optUrl.includes('/f_auto,q_auto/')) {
      optUrl = optUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    if (optUrl.toLowerCase().endsWith('.heic')) {
      optUrl = optUrl.substring(0, optUrl.length - 5) + '.jpg';
    }
    return optUrl;
  }

  return url;
}

function renderInvitationCard() {
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.innerText = txt || "";
  };

  setTxt('coverHostTitle', config.eventTitle || "Mừng Sinh Nhật");
  setTxt('coverHostSub', config.hostName || "");

  const cardAvatar = document.getElementById('cardAvatar');
  if (cardAvatar) {
    cardAvatar.src = convertGoogleDriveUrl(config.avatarUrl || DEFAULT_CONFIG.avatarUrl);
  }

  setTxt('cardHostName', config.hostName);
  setTxt('cardEventTitle', config.eventTitle);
  setTxt('cardEventDateShort', config.eventDateText);
  setTxt('cardGreetingQuote', `"${config.greetingQuote || ""}"`);
  setTxt('cardInvitationMessage', config.invitationMessage || DEFAULT_CONFIG.invitationMessage || "Tới tham dự bữa tiệc sinh nhật thân mật cùng mình nhé!");
  setTxt('cardDateText', config.eventDateText);
  setTxt('cardLunarDateText', config.lunarDateText || "");
  setTxt('cardLocationName', config.locationName);
  setTxt('cardLocationAddress', config.locationAddress);

  const mapsBtn = document.getElementById('cardMapsBtn');
  if (mapsBtn) mapsBtn.href = config.googleMapsUrl || "#";

  const audioEl = document.getElementById('bgAudio');
  if (audioEl) audioEl.src = config.musicUrl || DEFAULT_CONFIG.musicUrl;

  // Album ảnh
  const galleryBox = document.getElementById('galleryContainer');
  if (galleryBox) {
    const gallery = (config.galleryUrls && config.galleryUrls.length > 0 ? config.galleryUrls : DEFAULT_CONFIG.galleryUrls).map(convertGoogleDriveUrl);
    const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];
    galleryBox.innerHTML = gallery.map((url, index) => `
      <div class="bg-white p-2 rounded-2xl shadow-xs border border-stone-100 ${rotations[index % 4]} hover:rotate-0 transition-transform duration-300">
        <img src="${url}" class="w-full h-36 object-cover rounded-xl" alt="Gallery Photo ${index + 1}" loading="lazy" />
      </div>
    `).join('');
  }

  // VietQR Modal Setup
  setupQrModal();

  // Guest Name & Wishes
  initGuestName();
  renderWishes();
}

function getCloudinaryConfig() {
  const inputCloudName = document.getElementById('inputCloudName')?.value.trim();
  const inputUploadPreset = document.getElementById('inputUploadPreset')?.value.trim();
  const inputFolder = document.getElementById('inputCloudinaryFolder')?.value.trim();

  const env = window.ENV || {};
  return {
    cloudName: (inputCloudName || env.CLOUDINARY_CLOUD_NAME || "").trim(),
    uploadPreset: (inputUploadPreset || env.CLOUDINARY_UPLOAD_PRESET || "").trim(),
    folder: (inputFolder || env.CLOUDINARY_FOLDER || "birthday_invitation").trim()
  };
}

function saveCloudinaryEnvSettings() {
  const cloudName = document.getElementById('inputCloudName')?.value.trim() || "";
  const uploadPreset = document.getElementById('inputUploadPreset')?.value.trim() || "";
  const folder = document.getElementById('inputCloudinaryFolder')?.value.trim() || "";

  if (cloudName || uploadPreset || folder) {
    window.ENV = {
      ...window.ENV,
      CLOUDINARY_CLOUD_NAME: cloudName || window.ENV.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: uploadPreset || window.ENV.CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_FOLDER: folder || window.ENV.CLOUDINARY_FOLDER
    };
    try {
      localStorage.setItem('partyinvi_env_config', JSON.stringify(window.ENV));
      showToast("Đã lưu cài đặt Cloudinary!", "success");
    } catch (e) {}
  }
}

async function uploadToCloudinary(file) {
  const { cloudName, uploadPreset, folder } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name_here') {
    throw new Error("Vui lòng điền Cloud Name và Upload Preset trong tệp .env hoặc phần Cấu Hình!");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Lỗi tải ảnh Cloudinary (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url || data.url;
}

async function saveConfigToStorage(configObj) {
  try {
    localStorage.setItem('birthday_invitation_config', JSON.stringify(configObj));
  } catch (err) {
    console.warn("Storage write error:", err);
  }
}

function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  if (guestName) {
    const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const gCover = document.getElementById('guestNameCover');
    if (gCover) gCover.innerText = decodedName;
    const gMain = document.getElementById('guestNameMain');
    if (gMain) gMain.innerText = decodedName;
    const wishAuth = document.getElementById('wishAuthor');
    if (wishAuth) wishAuth.value = decodedName;
  }
}

// MỞ PHONG BÌ & PHÁO HOA CONFETTI
function openInvitation() {
  const envelope = document.getElementById('envelopeSection');
  const card = document.getElementById('cardContent');

  envelope.classList.add('transition-all', 'duration-500', 'opacity-0', 'scale-95');
  setTimeout(() => {
    envelope.classList.add('hidden');
    card.classList.remove('hidden');
    setTimeout(() => {
      card.classList.remove('opacity-0');
    }, 50);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Bắn Pháo Hoa Confetti Mừng Sinh Nhật
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, 500);
}

// NHẠC NỀN (Tạm thời ẩn)
const audio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
if (musicBtn && audio) {
  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      musicIcon.classList.add('animate-spin');
    } else {
      audio.pause();
      musicIcon.classList.remove('animate-spin');
    }
  });
}

// COUNTDOWN TIMER
function updateCountdown() {
  const eventTime = new Date(config.eventDateISO || "2026-09-15T18:00").getTime();
  const now = new Date().getTime();
  const diff = eventTime - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
  }
}
setInterval(updateCountdown, 1000);

// 5. VIETQR GENERATOR API & MODAL & QUICK BANK ACTIONS
const BANK_BIN_TO_SLUG = {
  "970422": "mb",      // MBBank
  "970436": "vcb",     // Vietcombank
  "970407": "tcb",     // Techcombank
  "970432": "vpb",     // VPBank
  "970416": "acb",     // ACB
  "970418": "bidv",    // BIDV
  "970405": "varb",    // Agribank
  "970415": "ctg",     // VietinBank
  "970423": "tpb",     // TPBank
  "970403": "stb",     // Sacombank
  "970437": "hdb",     // HDBank
  "970448": "ocb",     // OCB
  "970426": "msb",     // MSB
  "970441": "vib",     // VIB
  "970443": "shb",     // SHB
  "970431": "eib",     // Eximbank
  "970440": "seab",    // SeABank
  "970428": "nab"      // Nam A Bank
};

function buildVietQrUrl(bankBin, accountNo, accountName, amount, addInfo) {
  const encName = encodeURIComponent(accountName || "");
  const encInfo = encodeURIComponent(addInfo || "");
  const amt = amount ? Number(amount) : 0;
  return `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${amt}&addInfo=${encInfo}&accountName=${encName}`;
}

function copyAccountNo() {
  const qrData = config.qr || DEFAULT_CONFIG.qr;
  if (!qrData.accountNo) return;
  navigator.clipboard.writeText(qrData.accountNo).then(() => {
    showToast("Đã sao chép Số Tài Khoản: " + qrData.accountNo, "success");
  }).catch(() => {
    showToast("Đã sao chép Số Tài Khoản!", "success");
  });
}

function downloadQrImage() {
  const qrImg = document.getElementById('modalQrImg');
  if (!qrImg || !qrImg.src) return;

  const link = document.createElement('a');
  link.href = qrImg.src;
  link.download = `VietQR-${config.hostName || 'Birthday'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Đang tải ảnh VietQR...", "info");
}

function setupQrModal() {
  const qrData = config.qr || DEFAULT_CONFIG.qr;
  const bankObj = VIETNAM_BANKS.find(b => b.bin === qrData.bankId) || { name: qrData.bankName || "Ngân hàng" };

  document.getElementById('modalBankName').innerText = bankObj.name;
  document.getElementById('modalAccountNo').innerText = qrData.accountNo;
  document.getElementById('modalAccountName').innerText = qrData.accountName;
  document.getElementById('modalQrImg').src = buildVietQrUrl(qrData.bankId, qrData.accountNo, qrData.accountName, qrData.amount, qrData.addInfo);

  const bankSlug = BANK_BIN_TO_SLUG[qrData.bankId] || "mb";

  // Cấu trúc ba: [bankId]@[accountNo] (ví dụ: 970422@0347830406 hoặc mb@0347830406)
  const bankAccountParam = `${qrData.bankId || bankSlug}@${qrData.accountNo}`;
  const transferNote = encodeURIComponent(qrData.addInfo || '');
  const amount = qrData.amount || 0;

  // Link mở Cổng VietQR Deep Link chính thức
  const payUrl = `https://dl.vietqr.io/pay?app=${bankSlug}&ba=${bankAccountParam}&am=${amount}&tn=${transferNote}`;

  const universalBtn = document.getElementById('modalUniversalQrBtn');
  if (universalBtn) {
    universalBtn.href = payUrl;
    universalBtn.onclick = function () {
      copyAccountNo();
    };
  }
}

function toggleGiftModal(show) {
  const modal = document.getElementById('giftModal');
  if (show) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// TỰ ĐỘNG CHUYỂN ĐỔI NGÀY GIỜ ISO SANG DÒNG THỜI GIAN HIỂN THỊ
function autoFormatDateText() {
  const isoVal = document.getElementById('inputEventDateISO').value;
  if (!isoVal) return;

  const dateObj = new Date(isoVal);
  if (isNaN(dateObj.getTime())) return;

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayName = daysOfWeek[dateObj.getDay()];

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  // Định dạng chuẩn: "18:00 • Thứ Ba, 15/09/2026"
  const formattedText = `${hours}:${minutes} • ${dayName}, ${day}/${month}/${year}`;
  document.getElementById('inputEventDateText').value = formattedText;
}

// 6. POPULATE FORM & SAVE CONFIG (VIEW EDIT)
let currentGalleryUrls = [];

function populateBankSelect() {
  const select = document.getElementById('inputBankId');
  if (select) {
    select.innerHTML = VIETNAM_BANKS.map(b => `<option value="${b.bin}">${b.name}</option>`).join('');
  }
}

function populateEditForm() {
  populateBankSelect();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setVal('inputHostName', config.hostName);
  setVal('inputEventTitle', config.eventTitle);
  setVal('inputGreetingQuote', config.greetingQuote);
  setVal('inputInvitationMessage', config.invitationMessage || DEFAULT_CONFIG.invitationMessage);
  setVal('inputEventDateISO', config.eventDateISO);
  setVal('inputEventDateText', config.eventDateText);
  setVal('inputLunarDateText', config.lunarDateText);
  setVal('inputLocationName', config.locationName);
  setVal('inputLocationAddress', config.locationAddress);
  setVal('inputGoogleMapsUrl', config.googleMapsUrl);

  const env = window.ENV || {};
  setVal('inputCloudName', env.CLOUDINARY_CLOUD_NAME || "");
  setVal('inputUploadPreset', env.CLOUDINARY_UPLOAD_PRESET || "");
  setVal('inputCloudinaryFolder', env.CLOUDINARY_FOLDER || "");

  currentGalleryUrls = [...(config.galleryUrls && config.galleryUrls.length > 0 ? config.galleryUrls : DEFAULT_CONFIG.galleryUrls)];

  if (!config.avatarUrl || (!currentGalleryUrls.includes(config.avatarUrl) && !config.avatarUrl.startsWith('data:'))) {
    config.avatarUrl = currentGalleryUrls[0] || DEFAULT_CONFIG.avatarUrl;
  }
  setVal('inputAvatarUrl', config.avatarUrl);

  renderGalleryEditPreview();

  const qr = config.qr || DEFAULT_CONFIG.qr;
  setVal('inputBankId', qr.bankId || "970422");
  setVal('inputAccountNo', qr.accountNo);
  setVal('inputAccountName', qr.accountName);
  setVal('inputAddInfo', qr.addInfo);
  setVal('inputAmount', qr.amount);

  updateQrPreview();
}

function renderGalleryEditPreview() {
  const grid = document.getElementById('galleryEditPreviewGrid');
  if (!grid) return;

  if (!currentGalleryUrls || currentGalleryUrls.length === 0) {
    grid.innerHTML = `<p class="col-span-3 text-[11px] text-stone-400 italic text-center py-3">Chưa có ảnh nào trong album</p>`;
    const avatarInput = document.getElementById('inputAvatarUrl');
    if (avatarInput) avatarInput.value = '';
    return;
  }

  const activeAvatar = config.avatarUrl || currentGalleryUrls[0];
  const avatarInput = document.getElementById('inputAvatarUrl');
  if (avatarInput) avatarInput.value = activeAvatar;

  grid.innerHTML = currentGalleryUrls.map((url, idx) => {
    const isCover = (url === activeAvatar) || (!currentGalleryUrls.includes(activeAvatar) && idx === 0);
    return `
      <div onclick="selectCoverPhotoByUrl('${url}')"
        class="relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 h-28 bg-stone-100 ${isCover ? 'border-2 border-pink-500 ring-2 ring-pink-300 shadow-md scale-[1.02]' : 'border border-stone-200 opacity-80 hover:opacity-100 hover:border-pink-300'}">
        <img src="${convertGoogleDriveUrl(url)}" class="w-full h-full object-cover" alt="Album Photo ${idx + 1}" loading="lazy" />
        
        ${isCover ? `
          <span class="absolute top-1.5 left-1.5 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <i class="fa-solid fa-star text-amber-300"></i> Ảnh Bìa Thiệp
          </span>
          <div class="absolute top-1.5 right-1.5 bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm">
            <i class="fa-solid fa-check"></i>
          </div>
        ` : `
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              <i class="fa-solid fa-hand-pointer text-pink-500"></i> Chọn làm Ảnh Bìa
            </span>
          </div>
          <button type="button" onclick="removeGalleryItem(event, ${idx})" title="Xóa ảnh này" 
            class="absolute top-1.5 right-1.5 bg-stone-800/70 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs transition">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `}
      </div>
    `;
  }).join('');
}

function selectCoverPhotoByUrl(url) {
  if (!url) return;
  config.avatarUrl = url;

  const avatarInput = document.getElementById('inputAvatarUrl');
  if (avatarInput) avatarInput.value = url;

  const cardAvatar = document.getElementById('cardAvatar');
  if (cardAvatar) cardAvatar.src = convertGoogleDriveUrl(url);

  renderGalleryEditPreview();
  showToast("Đã chọn tấm ảnh này làm Ảnh Bìa Thiệp! 🌸", "success");
}

function selectCoverPhoto(index) {
  if (currentGalleryUrls && currentGalleryUrls[index]) {
    selectCoverPhotoByUrl(currentGalleryUrls[index]);
  }
}

function removeGalleryItem(event, index) {
  if (event) event.stopPropagation();
  const removedUrl = currentGalleryUrls[index];
  currentGalleryUrls.splice(index, 1);

  if (currentGalleryUrls.length > 0) {
    if (config.avatarUrl === removedUrl) {
      config.avatarUrl = currentGalleryUrls[0];
      const cardAvatar = document.getElementById('cardAvatar');
      if (cardAvatar) cardAvatar.src = convertGoogleDriveUrl(currentGalleryUrls[0]);
    }
    showToast("Đã xóa ảnh khỏi album.", "info");
  } else {
    showToast("Đã xóa ảnh. Album đang trống!", "warning");
  }
  renderGalleryEditPreview();
}

function addGalleryUrlFromPrompt() {
  const rawUrl = prompt("Dán link ảnh (Hỗ trợ link Google Drive hoặc link Web):");
  if (rawUrl && rawUrl.trim()) {
    const convertedUrl = convertGoogleDriveUrl(rawUrl.trim());
    currentGalleryUrls.push(convertedUrl);
    renderGalleryEditPreview();
    showToast("Đã thêm ảnh vào album!", "success");
  }
}

async function syncGoogleDriveFolder(folderType = 'gallery') {
  await syncDriveFolder();
}

function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxHeight) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    showToast("Đang tải ảnh lên Cloudinary CDN...", "info");
    const cloudinaryUrl = await uploadToCloudinary(file);
    config.avatarUrl = cloudinaryUrl;
    if (!currentGalleryUrls.includes(cloudinaryUrl)) {
      currentGalleryUrls.unshift(cloudinaryUrl);
    }
    const avatarInput = document.getElementById('inputAvatarUrl');
    if (avatarInput) avatarInput.value = cloudinaryUrl;
    renderGalleryEditPreview();
    showToast("Đã tải & chọn Ảnh Bìa Cloudinary thành công! 🎉", "success");
  } catch (err) {
    showToast(err.message || "Lỗi khi tải ảnh lên Cloudinary!", "warning");
  }
}

async function handleGalleryUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  showToast(`Đang tải ${files.length} ảnh lên Cloudinary CDN...`, "info");
  let successCount = 0;

  for (const file of files) {
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      currentGalleryUrls.unshift(cloudinaryUrl);
      successCount++;
    } catch (err) {
      console.error("Lỗi upload Cloudinary:", err);
      showToast(err.message || "Lỗi khi tải ảnh lên Cloudinary!", "warning");
    }
  }

  if (successCount > 0) {
    config.galleryUrls = currentGalleryUrls;
    if (!config.avatarUrl || !currentGalleryUrls.includes(config.avatarUrl)) {
      config.avatarUrl = currentGalleryUrls[0];
    }
    saveConfigToStorage(config);
    renderGalleryEditPreview();
    showToast(`⚡ Đã tải ${successCount} ảnh lên Cloudinary thành công! 🎉`, "success");
  }
}

function updateQrPreview() {
  const bankIdEl = document.getElementById('inputBankId');
  const accountNoEl = document.getElementById('inputAccountNo');
  const accountNameEl = document.getElementById('inputAccountName');
  const addInfoEl = document.getElementById('inputAddInfo');
  const amountEl = document.getElementById('inputAmount');

  const bankId = bankIdEl ? bankIdEl.value : "970422";
  const accountNo = accountNoEl ? accountNoEl.value.trim() : "";
  const accountName = accountNameEl ? accountNameEl.value.trim() : "";
  const addInfo = addInfoEl ? addInfoEl.value.trim() : "";
  const amount = amountEl ? amountEl.value : "";

  const previewImg = document.getElementById('qrPreviewImg');
  if (previewImg) {
    previewImg.src = buildVietQrUrl(bankId, accountNo, accountName, amount, addInfo);
  }
}

function saveConfig(e) {
  e.preventDefault();

  saveCloudinaryEnvSettings();

  if (!currentGalleryUrls || currentGalleryUrls.length === 0) {
    showToast("Vui lòng giữ lại ít nhất 1 ảnh trong album!", "warning");
    return;
  }

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  const bankId = getVal('inputBankId') || "970422";
  const bankObj = VIETNAM_BANKS.find(b => b.bin === bankId);

  const chosenAvatarUrl = getVal('inputAvatarUrl') || config.avatarUrl || currentGalleryUrls[0];

  config = {
    hostName: getVal('inputHostName'),
    eventTitle: getVal('inputEventTitle'),
    greetingQuote: getVal('inputGreetingQuote'),
    invitationMessage: getVal('inputInvitationMessage'),
    eventDateISO: getVal('inputEventDateISO'),
    eventDateText: getVal('inputEventDateText'),
    lunarDateText: getVal('inputLunarDateText'),
    locationName: getVal('inputLocationName'),
    locationAddress: getVal('inputLocationAddress'),
    googleMapsUrl: getVal('inputGoogleMapsUrl'),
    avatarUrl: chosenAvatarUrl,
    galleryUrls: currentGalleryUrls,
    musicUrl: config.musicUrl || DEFAULT_CONFIG.musicUrl,
    qr: {
      bankId: bankId,
      bankName: bankObj ? bankObj.name : "",
      accountNo: getVal('inputAccountNo'),
      accountName: getVal('inputAccountName').toUpperCase(),
      addInfo: getVal('inputAddInfo'),
      amount: getVal('inputAmount')
    }
  };

  try {
    saveConfigToStorage(config);
    showToast("Đã lưu tất cả thay đổi thành công! 🎉", "success");
    setTimeout(() => switchRoute('/'), 800);
  } catch (err) {
    showToast("Có lỗi khi lưu thông tin!", "warning");
  }
}

function resetToDefaultConfig() {
  if (confirm("Bạn có chắc chắn muốn khôi phục cấu hình mặc định ban đầu?")) {
    config = { ...DEFAULT_CONFIG };
    localStorage.removeItem('birthday_invitation_config');
    populateEditForm();
    showToast("Đã khôi phục dữ liệu mặc định", "info");
  }
}

// 7. GỬI MỜI & TẠO LINK (VIEW SEND)
function getBaseUrl() {
  const loc = window.location;
  const url = new URL(loc.href);
  url.searchParams.delete('pass');
  url.hash = '';
  return url.origin + url.pathname;
}

function generateInviteLink() {
  const guestInput = document.getElementById('sendGuestInput').value.trim();
  const baseUrl = getBaseUrl();
  const generatedField = document.getElementById('sendGeneratedUrl');

  if (guestInput) {
    generatedField.value = `${baseUrl}?to=${encodeURIComponent(guestInput)}`;
  } else {
    generatedField.value = baseUrl;
  }
}

function copyGeneratedLink() {
  const urlField = document.getElementById('sendGeneratedUrl');
  urlField.select();
  navigator.clipboard.writeText(urlField.value).then(() => {
    showToast("Đã sao chép đường link mời thành công!", "success");
  }).catch(() => {
    document.execCommand('copy');
    showToast("Đã sao chép đường link!", "success");
  });
}

function previewGuestCard() {
  const link = document.getElementById('sendGeneratedUrl').value;
  window.open(link, '_blank');
}

function saveAndCopyGuestLink() {
  const name = document.getElementById('sendGuestInput').value.trim();
  const link = document.getElementById('sendGeneratedUrl').value;
  if (!name) {
    showToast("Vui lòng nhập tên khách mời!", "warning");
    return;
  }

  copyGeneratedLink();

  // Lưu lịch sử
  const existing = invitedGuests.find(g => g.name === name);
  if (!existing) {
    invitedGuests.unshift({ name, link, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) });
    localStorage.setItem('invited_guests_list', JSON.stringify(invitedGuests));
    renderInvitedGuests();
  }
}

function renderInvitedGuests() {
  const container = document.getElementById('invitedGuestsList');
  if (invitedGuests.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 text-center py-4 italic">Chưa có link mời nào được lưu</p>`;
    return;
  }

  container.innerHTML = invitedGuests.map((g, idx) => `
    <div class="p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs flex items-center justify-between gap-2">
      <div class="truncate">
        <p class="text-xs font-bold text-stone-800">${g.name}</p>
        <p class="text-[10px] text-pink-600 font-mono truncate">${g.link}</p>
      </div>
      <div class="flex items-center gap-1">
        <button onclick="copySpecificLink('${g.link}')" title="Sao chép link" class="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 flex items-center justify-center text-xs">
          <i class="fa-solid fa-copy"></i>
        </button>
        <button onclick="removeGuest(${idx})" title="Xóa" class="w-7 h-7 rounded-lg bg-stone-100 text-stone-400 hover:text-rose-600 flex items-center justify-center text-xs">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function copySpecificLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    showToast("Đã sao chép link mời!", "success");
  });
}

function removeGuest(idx) {
  invitedGuests.splice(idx, 1);
  localStorage.setItem('invited_guests_list', JSON.stringify(invitedGuests));
  renderInvitedGuests();
}

function clearInvitedGuests() {
  if (confirm("Bạn muốn xóa toàn bộ danh sách link mời đã lưu?")) {
    invitedGuests = [];
    localStorage.removeItem('invited_guests_list');
    renderInvitedGuests();
  }
}

// SHARE ACTIONS
function shareViaZalo() {
  const link = document.getElementById('sendGeneratedUrl').value;
  window.open(`https://zalo.me/share?url=${encodeURIComponent(link)}`, '_blank');
}
function shareViaMessenger() {
  const link = document.getElementById('sendGeneratedUrl').value;
  window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(link)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(link)}`, '_blank');
}
function shareViaSMS() {
  const name = document.getElementById('sendGuestInput').value.trim();
  const link = document.getElementById('sendGeneratedUrl').value;
  const text = `Thân mời ${name || 'bạn'} tới dự tiệc sinh nhật của mình tại: ${link}`;
  window.open(`sms:?body=${encodeURIComponent(text)}`);
}

// 8. SỔ LƯU BÚT
function renderWishes() {
  const container = document.getElementById('wishesList');
  if (!wishes || wishes.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 text-center py-4 italic">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc mừng sinh nhật! 💕</p>`;
    return;
  }

  container.innerHTML = wishes.map(w => `
    <div class="p-3 bg-white rounded-xl border border-pink-100 text-xs shadow-2xs">
      <div class="flex justify-between items-center text-stone-400 mb-1">
        <span class="font-bold text-pink-600">${w.name}</span>
        <span class="text-[10px]">${w.time}</span>
      </div>
      <p class="text-stone-700 leading-relaxed">${w.text}</p>
    </div>
  `).join('');
}

function submitWish(e) {
  e.preventDefault();
  const author = document.getElementById('wishAuthor').value.trim();
  const msg = document.getElementById('wishMessage').value.trim();
  if (!author || !msg) return;

  wishes.unshift({ name: author, text: msg, time: "Vừa xong" });
  localStorage.setItem('birthday_wishes', JSON.stringify(wishes));
  renderWishes();
  document.getElementById('wishMessage').value = '';
  showToast("Cảm ơn lời chúc ngọt ngào của bạn! 💕", "success");
}

// 9. TOAST NOTIFICATION UTILITY
function showToast(message, type = "success") {
  const toast = document.getElementById('toastNotification');
  const msgSpan = document.getElementById('toastMessage');
  const icon = document.getElementById('toastIcon');

  msgSpan.innerText = message;
  if (type === "success") icon.className = "fa-solid fa-circle-check text-emerald-400";
  else if (type === "warning") icon.className = "fa-solid fa-triangle-exclamation text-amber-400";
  else icon.className = "fa-solid fa-circle-info text-blue-400";

  toast.classList.remove('hidden');
  toast.classList.add('flex', 'animate-toast');

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex', 'animate-toast');
  }, 2800);
}

// 10. LISTEN ROUTE CHANGES & INITIALIZE
window.addEventListener('hashchange', renderView);
window.addEventListener('DOMContentLoaded', () => {
  renderView();
});
