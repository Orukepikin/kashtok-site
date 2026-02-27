// ── Navbar scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
  const btn = document.getElementById('back-top');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

// ── Active nav link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href')?.split('/').pop();
  if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
});

// ── Mobile hamburger
function toggleMobile() {
  const menu = document.getElementById('mobile-menu');
  const ham = document.getElementById('hamburger');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  ham?.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

// ── Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.remove('open');
    document.getElementById('hamburger')?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const body = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.classList.remove('open');
      b.closest('.faq-item')?.querySelector('.faq-a')?.classList.remove('open');
    });
    // Open if wasn't open
    if (!isOpen) { btn.classList.add('open'); body?.classList.add('open'); }
  });
});

// ── Scroll animations
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ── Cookie banner
function closeCookies() {
  const b = document.getElementById('cookie-banner');
  if (b) { b.style.opacity = '0'; b.style.transform = 'translate(-50%, 20px)'; setTimeout(() => b.remove(), 400); }
  try { localStorage.setItem('kt_cookies', '1'); } catch(e){}
}
try { if (localStorage.getItem('kt_cookies')) document.getElementById('cookie-banner')?.remove(); } catch(e){}

// ── Waitlist forms
document.querySelectorAll('.waitlist-form, #waitlist-form-main').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input?.value) return;
    const orig = btn.textContent;
    btn.textContent = '🎉 You\'re in!';
    btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
    btn.disabled = true;
    input.value = '';
    input.placeholder = 'Check your inbox!';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      input.placeholder = 'Enter your email';
    }, 4000);
  });
});

// ── Stat counter animation
function animateCount(el, target, suffix = '', duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCount(el, +el.dataset.target, el.dataset.suffix || '');
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-band, .stats-inner').forEach(el => statsObs.observe(el));

// ── Staggered hero text animation
document.querySelectorAll('.hero-inner > div > *').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.1}s`;
  el.style.opacity = '0';
  el.style.animation = `hero-in 0.7s ease forwards ${i * 0.12}s`;
});
const style = document.createElement('style');
style.textContent = `@keyframes hero-in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`;
document.head.appendChild(style);
