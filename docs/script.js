// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    // Auto-close mobile menu
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('menu-toggle');
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('open');
    }
  });
});

// Navbar: transparent → solid on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu    = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const html    = document.documentElement;
  const current = html.getAttribute('data-theme') || 'light';
  const next    = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
});

// Parallax hero background (zoom effect)
const heroImg = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  const offset = window.pageYOffset;
  heroImg.style.backgroundPositionY = offset * 0.5 + 'px';
});

// Dynamic Blog via rss2json.com
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('blog-posts');
  const apiUrl =
    'https://api.rss2json.com/v1/api.json?rss_url=https://rss.kompas.com/konten.xml&count=6&media=true';

  try {
    const res  = await fetch(apiUrl);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items.length) {
      container.innerHTML = '<p>Belum ada update berita.</p>';
      return;
    }
    container.innerHTML = data.items.map(item => {
      const imgUrl  = item.thumbnail || item.enclosure?.link || 'assets/img/placeholder.jpg';
      const dateStr = new Date(item.pubDate).toLocaleDateString('id-ID', {
        day:'2-digit', month:'long', year:'numeric'
      });
      const summary = (item.description || '')
        .replace(/<[^>]+>/g, '')
        .slice(0, 120) + '…';
      return `
        <article class="blog-post">
          <img src="${imgUrl}" alt="${item.title}" class="blog-post-img"/>
          <h3>${item.title}</h3>
          <p class="date">${dateStr}</p>
          <p>${summary}</p>
          <a href="${item.link}" class="read-more" target="_blank">
            Baca Selengkapnya →
          </a>
        </article>
      `;
    }).join('');
  } catch (err) {
    console.error('Error memuat blog:', err);
    container.innerHTML = '<p>Gagal memuat berita.</p>';
  }
});