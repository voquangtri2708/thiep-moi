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
  coverUrls: [
    "https://lh3.googleusercontent.com/d/1rlLfnpyWB7Znq4QPGxyt7LjPFWEmCmig"
  ],
  galleryUrls: [
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

// Global state
let config = JSON.parse(localStorage.getItem('birthday_invitation_config')) || DEFAULT_CONFIG;
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

  const fileDMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  const idParamMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  return url;
}

function renderInvitationCard() {
  // Cover
  document.getElementById('coverHostTitle').innerText = config.eventTitle || "Mừng Sinh Nhật";
  document.getElementById('coverHostSub').innerText = config.hostName;

  // Main Card
  document.getElementById('cardAvatar').src = convertGoogleDriveUrl(config.avatarUrl || DEFAULT_CONFIG.avatarUrl);
  document.getElementById('cardHostName').innerText = config.hostName;
  document.getElementById('cardEventTitle').innerText = config.eventTitle;
  document.getElementById('cardEventDateShort').innerText = config.eventDateText;
  document.getElementById('cardGreetingQuote').innerText = `"${config.greetingQuote}"`;
  const invMsgEl = document.getElementById('cardInvitationMessage');
  if (invMsgEl) {
    invMsgEl.innerText = config.invitationMessage || DEFAULT_CONFIG.invitationMessage || "Tới tham dự bữa tiệc sinh nhật thân mật cùng mình nhé!";
  }
  document.getElementById('cardDateText').innerText = config.eventDateText;
  document.getElementById('cardLunarDateText').innerText = config.lunarDateText || "";
  document.getElementById('cardLocationName').innerText = config.locationName;
  document.getElementById('cardLocationAddress').innerText = config.locationAddress;
  document.getElementById('cardMapsBtn').href = config.googleMapsUrl || "#";

  // Audio
  document.getElementById('bgAudio').src = config.musicUrl || DEFAULT_CONFIG.musicUrl;

  // Album ảnh
  const galleryBox = document.getElementById('galleryContainer');
  const gallery = (config.galleryUrls && config.galleryUrls.length > 0 ? config.galleryUrls : DEFAULT_CONFIG.galleryUrls).map(convertGoogleDriveUrl);
  const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];
  galleryBox.innerHTML = gallery.map((url, index) => `
    <div class="bg-white p-2 rounded-2xl shadow-xs border border-stone-100 ${rotations[index % 4]} hover:rotate-0 transition-transform duration-300">
      <img src="${url}" class="w-full h-36 object-cover rounded-xl" alt="Gallery Photo ${index + 1}" onerror="this.parentElement.remove()" />
    </div>
  `).join('');

  // VietQR Modal Setup
  setupQrModal();

  // Guest Name
  initGuestName();
  renderWishes();

  // Tự động quét & nạp ảnh mới nhất từ Google Drive (nếu có thêm ảnh mới)
  autoFetchDriveFolders();
}

async function autoFetchDriveFolders() {
  try {
    await syncAllDriveFolders(true);
  } catch (e) {
    console.warn("Tự động đồng bộ Drive ngầm:", e);
  }
}

async function syncAllDriveFolders(isSilent = false) {
  if (!isSilent) {
    showToast("Đang đồng bộ từ Google Drive...", "info");
  }

  const coverFolderId = "1OWYzYN19tzXOa_vyjI-l78BH5NzuwUhm";
  const galleryFolderId = "1yfsn0yVuerDDRzyQmmEyytwQNGIrmPx-";

  // Quét 2 thư mục Bìa & Album SONG SONG cùng 1 lúc!
  const [coverFiles, galleryFiles] = await Promise.all([
    fetchDriveFolderFileIds(coverFolderId),
    fetchDriveFolderFileIds(galleryFolderId)
  ]);

  // 1. Quét Thư mục Ảnh Bìa
  if (coverFiles && coverFiles.length > 0) {
    const coverUrls = coverFiles.map(id => `https://lh3.googleusercontent.com/d/${id}`);
    currentCoverUrls = coverUrls;
    config.coverUrls = coverUrls;
    if (!config.avatarUrl || !coverUrls.includes(config.avatarUrl)) {
      config.avatarUrl = coverUrls[0];
    }

    const cardAvatar = document.getElementById('cardAvatar');
    if (cardAvatar) cardAvatar.src = config.avatarUrl;

    renderAvatarEditPreview();
  }

  // 2. Quét Thư mục Album Kỷ Niệm
  if (galleryFiles && galleryFiles.length > 0) {
    const galleryUrls = galleryFiles.map(id => `https://lh3.googleusercontent.com/d/${id}`);
    config.galleryUrls = galleryUrls;
    currentGalleryUrls = [...galleryUrls];

    const galleryBox = document.getElementById('galleryContainer');
    if (galleryBox) {
      const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];
      galleryBox.innerHTML = galleryUrls.map((url, index) => `
        <div class="bg-white p-2 rounded-2xl shadow-xs border border-stone-100 ${rotations[index % 4]} hover:rotate-0 transition-transform duration-300">
          <img src="${url}" class="w-full h-36 object-cover rounded-xl" alt="Gallery Photo ${index + 1}" onerror="this.parentElement.remove()" />
        </div>
      `).join('');
    }

    renderGalleryEditPreview();
  }

  await saveConfigToStorage(config);
  if (!isSilent) {
    showToast("⚡ Đã đồng bộ Ảnh Bìa & Album! 🎉", "success");
  }
}

async function saveConfigToStorage(configObj) {
  try {
    localStorage.setItem('birthday_invitation_config', JSON.stringify(configObj));
  } catch (err) {
    console.warn("Storage write error:", err);
  }
}

async function fetchDriveFolderFileIds(folderId) {
  const targetUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
  const timestamp = Date.now();
  const proxyUrls = [
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&_t=${timestamp}`
  ];

  const fetchPromises = proxyUrls.map(pUrl =>
    fetch(pUrl)
      .then(async res => {
        if (!res.ok) throw new Error("Proxy error " + res.status);
        const rawText = await res.text();
        let html = rawText;
        try {
          const json = JSON.parse(rawText);
          html = json.contents || json;
        } catch (e) { }

        if (html && typeof html === 'string' && html.includes('drive.google.com/file/d/')) {
          return html;
        }
        throw new Error("No file links found");
      })
  );

  let htmlContent = "";
  try {
    if (Promise.any) {
      htmlContent = await Promise.any(fetchPromises);
    } else {
      htmlContent = await Promise.race(fetchPromises);
    }
  } catch (err) {
    console.warn("Proxy parallel fetch fallback:", err);
  }

  const matches = [];
  if (htmlContent && typeof htmlContent === 'string') {
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/g;
    let m;
    while ((m = regex.exec(htmlContent)) !== null) {
      if (!matches.includes(m[1])) {
        matches.push(m[1]);
      }
    }
  }
  return matches;
}

function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  if (guestName) {
    const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    document.getElementById('guestNameCover').innerText = decodedName;
    document.getElementById('guestNameMain').innerText = decodedName;
    document.getElementById('wishAuthor').value = decodedName;
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
let currentCoverUrls = [];
let currentGalleryUrls = [];

function populateBankSelect() {
  const select = document.getElementById('inputBankId');
  select.innerHTML = VIETNAM_BANKS.map(b => `<option value="${b.bin}">${b.name}</option>`).join('');
}

function populateEditForm() {
  populateBankSelect();

  document.getElementById('inputHostName').value = config.hostName || "";
  document.getElementById('inputEventTitle').value = config.eventTitle || "";
  document.getElementById('inputGreetingQuote').value = config.greetingQuote || "";
  document.getElementById('inputInvitationMessage').value = config.invitationMessage || DEFAULT_CONFIG.invitationMessage || "";
  document.getElementById('inputEventDateISO').value = config.eventDateISO || "";
  document.getElementById('inputEventDateText').value = config.eventDateText || "";
  document.getElementById('inputLunarDateText').value = config.lunarDateText || "";
  document.getElementById('inputLocationName').value = config.locationName || "";
  document.getElementById('inputLocationAddress').value = config.locationAddress || "";
  document.getElementById('inputGoogleMapsUrl').value = config.googleMapsUrl || "";

  // Avatar preview setup (Dạng grid giống Album)
  const activeAvatarUrl = config.avatarUrl || DEFAULT_CONFIG.avatarUrl;
  currentCoverUrls = (config.coverUrls && config.coverUrls.length > 0)
    ? [...config.coverUrls]
    : [activeAvatarUrl];

  if (!currentCoverUrls.includes(activeAvatarUrl)) {
    currentCoverUrls.unshift(activeAvatarUrl);
  }

  renderAvatarEditPreview();

  // Gallery album setup
  currentGalleryUrls = [...(config.galleryUrls && config.galleryUrls.length > 0 ? config.galleryUrls : DEFAULT_CONFIG.galleryUrls)];
  renderGalleryEditPreview();

  const qr = config.qr || DEFAULT_CONFIG.qr;
  document.getElementById('inputBankId').value = qr.bankId || "970422";
  document.getElementById('inputAccountNo').value = qr.accountNo || "";
  document.getElementById('inputAccountName').value = qr.accountName || "";
  document.getElementById('inputAddInfo').value = qr.addInfo || "";
  document.getElementById('inputAmount').value = qr.amount || "";

  updateQrPreview();
}

function renderAvatarEditPreview() {
  const grid = document.getElementById('avatarEditPreviewGrid');
  if (!grid) return;

  if (!currentCoverUrls || currentCoverUrls.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center py-4 text-xs text-rose-500 font-medium bg-rose-50 rounded-xl border border-rose-200">Chưa có ảnh bìa! Vui lòng bấm Cập Nhật Ảnh Bìa từ Drive.</div>`;
    document.getElementById('inputAvatarUrl').value = '';
    return;
  }

  const activeUrl = config.avatarUrl || currentCoverUrls[0];

  grid.innerHTML = currentCoverUrls.map((url, idx) => {
    const isSelected = (url === activeUrl) || (!currentCoverUrls.includes(activeUrl) && idx === 0);
    return `
      <div onclick="selectCoverPhoto(${idx})"
        class="relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isSelected ? 'border-2 border-pink-500 ring-2 ring-pink-200 shadow-md scale-[1.02] bg-white' : 'border border-stone-200 opacity-60 hover:opacity-100 hover:border-pink-300 bg-stone-50'}">
        <img src="${url}" class="w-full h-24 object-cover" alt="Cover Candidate ${idx + 1}" />
        ${isSelected ? `
          <span class="absolute top-1.5 left-1.5 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <i class="fa-solid fa-circle-check"></i> Ảnh Bìa
          </span>
          <div class="absolute top-1.5 right-1.5 bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm">
            <i class="fa-solid fa-check"></i>
          </div>
        ` : `
          <button type="button" onclick="removeCoverUrlAtIndex(event, ${idx})"
            class="absolute top-1.5 right-1.5 bg-stone-700/70 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs transition" title="Xóa bức ảnh này">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `}
      </div>
    `;
  }).join('');

  document.getElementById('inputAvatarUrl').value = activeUrl;
}

function selectCoverPhoto(index) {
  if (!currentCoverUrls || !currentCoverUrls[index]) return;

  const selectedUrl = currentCoverUrls[index];
  config.avatarUrl = selectedUrl;

  const cardAvatar = document.getElementById('cardAvatar');
  if (cardAvatar) cardAvatar.src = selectedUrl;

  document.getElementById('inputAvatarUrl').value = selectedUrl;
  renderAvatarEditPreview();
  showToast("Đã chọn làm Ảnh Bìa Thiệp! 🌸", "success");
}

function removeCoverUrlAtIndex(event, index) {
  event.stopPropagation();
  currentCoverUrls.splice(index, 1);
  if (currentCoverUrls.length > 0) {
    if (!currentCoverUrls.includes(config.avatarUrl)) {
      config.avatarUrl = currentCoverUrls[0];
      const cardAvatar = document.getElementById('cardAvatar');
      if (cardAvatar) cardAvatar.src = currentCoverUrls[0];
    }
    showToast("Đã xóa ảnh khỏi danh sách.", "info");
  } else {
    showToast("Vui lòng giữ lại ít nhất 1 ảnh làm Ảnh Bìa!", "warning");
  }
  renderAvatarEditPreview();
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
  await syncAllDriveFolders();
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
    showToast("Đang xử lý & nén ảnh...", "info");
    const compressedUrl = await compressImage(file, 800, 800, 0.75);
    document.getElementById('inputAvatarUrl').value = compressedUrl;
    document.getElementById('avatarPreviewEdit').src = compressedUrl;
    showToast("Đã tải ảnh đại diện thành công!", "success");
  } catch (err) {
    showToast("Lỗi khi xử lý file ảnh!", "warning");
  }
}

async function handleGalleryUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  showToast(`Đang nén ${files.length} ảnh...`, "info");
  for (const file of files) {
    try {
      const compressedUrl = await compressImage(file, 800, 800, 0.75);
      currentGalleryUrls.push(compressedUrl);
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
    }
  }
  renderGalleryEditPreview();
  showToast(`Đã thêm ${files.length} ảnh vào album!`, "success");
}

function removeGalleryItem(index) {
  currentGalleryUrls.splice(index, 1);
  renderGalleryEditPreview();
  showToast("Đã xóa ảnh khỏi album", "info");
}

function renderGalleryEditPreview() {
  const grid = document.getElementById('galleryEditPreviewGrid');
  if (!grid) return;

  if (currentGalleryUrls.length === 0) {
    grid.innerHTML = `<p class="col-span-3 text-[11px] text-stone-400 italic text-center py-3">Chưa có ảnh nào trong album</p>`;
    return;
  }

  grid.innerHTML = currentGalleryUrls.map((url, idx) => `
    <div class="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-24">
      <img src="${url}" class="w-full h-full object-cover" alt="Album photo ${idx + 1}" />
      <button type="button" onclick="removeGalleryItem(${idx})" title="Xóa ảnh này" 
              class="absolute top-1.5 right-1.5 bg-rose-600/90 hover:bg-rose-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-md transition">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

function updateQrPreview() {
  const bankId = document.getElementById('inputBankId').value;
  const accountNo = document.getElementById('inputAccountNo').value.trim();
  const accountName = document.getElementById('inputAccountName').value.trim();
  const addInfo = document.getElementById('inputAddInfo').value.trim();
  const amount = document.getElementById('inputAmount').value;

  document.getElementById('qrPreviewImg').src = buildVietQrUrl(bankId, accountNo, accountName, amount, addInfo);
}

function saveConfig(e) {
  e.preventDefault();

  if (!currentCoverUrls || currentCoverUrls.length === 0) {
    showToast("Vui lòng giữ lại ít nhất 1 ảnh để làm Ảnh Đại Diện (Bìa)!", "warning");
    return;
  }

  const chosenAvatarUrl = (config.avatarUrl && currentCoverUrls.includes(config.avatarUrl))
    ? config.avatarUrl
    : currentCoverUrls[0];

  const bankId = document.getElementById('inputBankId').value;
  const bankObj = VIETNAM_BANKS.find(b => b.bin === bankId);

  config = {
    hostName: document.getElementById('inputHostName').value.trim(),
    eventTitle: document.getElementById('inputEventTitle').value.trim(),
    greetingQuote: document.getElementById('inputGreetingQuote').value.trim(),
    invitationMessage: document.getElementById('inputInvitationMessage').value.trim(),
    eventDateISO: document.getElementById('inputEventDateISO').value,
    eventDateText: document.getElementById('inputEventDateText').value.trim(),
    lunarDateText: document.getElementById('inputLunarDateText').value.trim(),
    locationName: document.getElementById('inputLocationName').value.trim(),
    locationAddress: document.getElementById('inputLocationAddress').value.trim(),
    googleMapsUrl: document.getElementById('inputGoogleMapsUrl').value.trim(),
    avatarUrl: chosenAvatarUrl,
    coverUrls: currentCoverUrls,
    galleryUrls: currentGalleryUrls,
    musicUrl: config.musicUrl || "",
    qr: {
      bankId: bankId,
      bankName: bankObj ? bankObj.name : "",
      accountNo: document.getElementById('inputAccountNo').value.trim(),
      accountName: document.getElementById('inputAccountName').value.trim().toUpperCase(),
      addInfo: document.getElementById('inputAddInfo').value.trim(),
      amount: document.getElementById('inputAmount').value
    }
  };

  try {
    saveConfigToStorage(config);
    showToast("Đã lưu tất cả thay đổi thành công! 🎉", "success");
    setTimeout(() => switchRoute('/'), 800);
  } catch (err) {
    showToast("Dung lượng ảnh quá lớn không thể lưu vào trình duyệt!", "warning");
  }
}

function resetToDefaultConfig() {
  if (confirm("Bạn có chắc chắn muốn khôi phục cấu hình mặc định ban đầu?")) {
    config = DEFAULT_CONFIG;
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
