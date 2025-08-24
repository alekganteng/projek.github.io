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

// 5. Parallax hero (versi transform)
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const offset = scrollY * 0.3;
  const bgEl = document.querySelector('.hero-bg');
  if (bgEl) {
    bgEl.style.transform = `translateY(${offset}px)`;
  }
});
//6 berita
const container = document.getElementById("blog-container");

async function fetchBerita() {
  try {
    const response = await fetch("data/blog.json");
    const data = await response.json();

    if (!data || data.length === 0) {
      container.innerHTML = "<p>Tidak ada berita tersedia saat ini.</p>";
      return;
    }

    renderBerita(data);
  } catch (error) {
    console.error("Gagal ambil berita:", error);
    container.innerHTML = "<p>Berita gagal dimuat. Coba lagi nanti.</p>";
  }
}

function renderBerita(articles) {
  container.innerHTML = "";

  articles.forEach(item => {
    const card = document.createElement("div");
    card.className = "post-card compact";

    card.innerHTML = `
      <img src="${item.thumbnail || 'images/default.jpg'}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p class="post-date">${new Date(item.pubDate).toLocaleDateString('id-ID')}</p>
      <p>${item.description || "Tidak ada deskripsi."}</p>
      <a href="${item.link}" target="_blank">Baca selengkapnya</a>
    `;

    container.appendChild(card);
  });
}

fetchBerita();
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
function createStepElement(step, index, isLast) {
  const li = document.createElement('li');
  li.style.setProperty('--step-index', index);

  const img = document.createElement('img');
  img.className = 'icon';
  img.src = step.icon;
  img.alt = `Step ${index + 1} Icon`;

  const label = document.createElement('p');
  label.className = 'label';
  label.textContent = step.label;

  if (isLast && step.label.trim() !== '') {
    const gesture = document.createElement('span');
    gesture.className = 'gesture';
    gesture.textContent = '💛 Ur wish almost granted!';
    label.appendChild(gesture);
  }

  li.appendChild(img);
  li.appendChild(label);
  return li;
}

function renderSteps(type) {
  const container = document.querySelector('.process-steps');
  container.innerHTML = '';
  const steps = stepData[type];
  steps.forEach((step, idx) => {
    if (step.label.trim() !== '') {
      const isLast = idx === steps.length - 1;
      const stepEl = createStepElement(step, idx, isLast);
      container.appendChild(stepEl);
    }
  });
}

document.querySelectorAll('.process-toggle .toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSteps(btn.dataset.type);
  });
});
// kontak
renderSteps('formal');
})
const form = document.querySelector(".contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const destination = form.destination.value;

  if (!name || !email || !phone || !destination) {
    alert("Mohon lengkapi semua data sebelum mengirim.");
    return;
  }

  const message = `Halo Admin, saya ${name} ingin konsultasi.\nEmail: ${email}\nTelepon: ${phone}\nNegara Tujuan: ${destination}`;
  const encoded = encodeURIComponent(message);

  // Ganti nomor WA admin di sini (format: 62xxxxxxxxxx)
  const adminNumber = "6282240410477";
  const waLink = `https://wa.me/${adminNumber}?text=${encoded}`;

  window.open(waLink, "_blank");
});
