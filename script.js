// script.js
console.log('✅ script.js loaded');
document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth scrolling + auto‐close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });

      // auto-close mobile menu
      const navMenuEl = document.getElementById('nav-menu');
      const toggleEl  = document.getElementById('menu-toggle');
      if (navMenuEl.classList.contains('active')) {
        navMenuEl.classList.remove('active');
        toggleEl.classList.remove('open');
      }
    });
  });

  // 2. Navbar solid on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // 3. Mobile menu toggle
  const mobileToggle = document.getElementById('menu-toggle');
  const mobileMenu   = document.getElementById('nav-menu');
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileToggle.classList.toggle('open');
  });

  // 4. Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const html    = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
  });

  // 5. Parallax hero
  const heroEl = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (heroEl) {
      heroEl.style.backgroundPositionY = window.pageYOffset * 0.5 + 'px';
    }
  });

// Ambil elemen container
const blogContainer = document.getElementById('blog-posts');

// Daftar RSS feed sumber berita
const sources = [
  'https://rss.detik.com/index.php/indeks',
  'https://feeds.kompas.com/kompas-nasional.rss',
  'https://www.cnnindonesia.com/nasional/rss'
];

// Fungsi utama untuk fetch, merge, sort, dan render 6 item teratas
async function loadTop6News() {
  console.log('🚀 loadTop6News() dipanggil');

  // Tampilkan spinner
  blogContainer.innerHTML = '<div class="spinner"></div>';

  try {
    console.log(`🔄 Memulai fetch untuk ${sources.length} sumber`);
    const feedPromises = sources.map(url => {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      console.log('  ➡️ fetching:', apiUrl);

      return fetch(apiUrl, { cache: 'no-cache' })
        .then(res => {
          console.log(`    [${url}] status:`, res.status);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(json => {
          const count = Array.isArray(json.items) ? json.items.length : 0;
          console.log(`    [${url}] items parsed:`, count);
          return json.items || [];
        })
        .catch(err => {
          console.error(`    Error fetching ${url}:`, err);
          return [];
        });
    });

    // Tunggu semua fetch selesai
    const feeds = await Promise.all(feedPromises);
    console.log('✅ Semua fetch selesai:', feeds.map(f => f.length));

    // Flatten, sort by tanggal, ambil 6 pertama
    const allItems = feeds.flat();
    console.log('🔢 Total items sebelum sort:', allItems.length);

    const sorted = allItems.sort((a, b) =>
      new Date(b.pubDate) - new Date(a.pubDate)
    );
    const top6 = sorted.slice(0, 6);
    console.log('🏆 Top6 titles:', top6.map(i => i.title));

    renderPosts(top6);
  }
  catch (err) {
    console.error('❌ Error loading feeds:', err);
    blogContainer.innerHTML =
      '<p class="error">Gagal memuat berita. Silakan coba lagi nanti.</p>';
  }
}

// Fungsi untuk merender array item dari RSS
function renderPosts(items) {
  if (!items.length) {
    console.warn('⚠️ Tidak ada berita untuk ditampilkan');
    blogContainer.innerHTML = '<p class="error">Belum ada berita.</p>';
    return;
  }

  blogContainer.innerHTML = '';
  items.forEach(item => {
    const date = new Date(item.pubDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <h3>${item.title}</h3>
      <time class="post-date" datetime="${item.pubDate}">${date}</time>
      <p>${item.description || ''}</p>
      <a href="${item.link}" target="_blank" rel="noopener">
        Baca selengkapnya →
      </a>
    `;
    blogContainer.appendChild(card);
  });
}

// Panggil loadTop6News sekali saat script selesai dieksekusi
loadTop6News();
// Data label + icon untuk Formal & PLRT
const stepData = {
  formal: [
    { label: "Tahap 1: KTP, KK, Akta, Ijazah, Buku Nikah/Akte Cerai, Paspor (jika ada), Surat Izin Keluarga, Vaksin 1–3, Pengisian Biodata, Medical awal, Tunggu hasil fit", icon: "assets/img/assignment.png" },
    { label: "Tahap 2: Pemasaran job (CPMI) – lanjut jika majikan setuju", icon: "assets/img/bullhorn.png" },
    { label: "Tahap 3: TTD job, ID, Paspor, Full Medical & Stay di PT + Belajar bahasa dasar", icon: "assets/img/contract.png" },
    { label: "Tahap 4: Stay di PT, menunggu SUHAN (boleh pulang Jumat–Minggu)", icon: "assets/img/waiting-room.png" },
    { label: "Tahap 5: SUHAN/JO → TTD Bank, Legalisasi BP2MI, Interview TETO, Pulang 3 hari", icon: "assets/img/payment-check.png" },
    { label: "Tahap 6: Setelah pulang 3 hari, kembali stay di PT hingga keberangkatan", icon: "assets/img/route.png" },
    { label: "", icon: "assets/img/formal7.png" },
    { label: "", icon: "assets/img/formal8.png" }
  ],
  plrt: [
    { label: "Tahap 1: KTP, KK, Akta, Ijazah, Buku Nikah/Akte Cerai, Paspor (jika ada), Surat Izin Keluarga, Vaksin 1–3, Pengisian Biodata, Medical awal, Tunggu hasil fit", icon: "assets/img/assignment.png" },
    { label: "Tahap 2: Medical fit → Belajar & Ujian Bahasa di BLK", icon: "assets/img/classroom.png" },
    { label: "Tahap 3: Lulus ujian bahasa/praktek → Pemasaran job (harus bisa bahasa untuk interview majikan)", icon: "assets/img/bullhorn.png" },
    { label: "Tahap 4: TTD job, ID, Paspor, Full Medical & Stay di PT", icon: "assets/img/contract.png" },
    { label: "Tahap 5: Stay di PT, menunggu SUHAN (boleh pulang Jumat sore–Minggu sore)", icon: "assets/img/waiting-room.png" },
    { label: "Tahap 6: SUHAN/JO → TTD Bank, Legalisasi BP2MI, Interview TETO, Pulang 3 hari", icon: "assets/img/payment-check.png" },
    { label: "Tahap 7: Setelah pulang 3 hari, kembali stay di PT", icon: "assets/img/stay-at-home.png" },
    { label: "Tahap 8: Pelepasan & penerbangan → Salam sukses & sehat selalu", icon: "assets/img/route.png" }
  ]
};

// Render langkah
function renderSteps(type) {
  const cards = document.querySelectorAll('.process-steps li');
  cards.forEach((card, idx) => {
    const step = stepData[type][idx];
    if (step && step.label.trim() !== "") {
      card.querySelector('.label').textContent = step.label;
      card.querySelector('.icon').src = step.icon;
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Event listener toggle
document.querySelectorAll('.process-toggle .toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSteps(btn.dataset.type);
  });
});

// Load default (Formal)
renderSteps('formal');
})
