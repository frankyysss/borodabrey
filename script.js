
const services = window.BORODABREY_SERVICES || [];
const meta = window.BORODABREY_META || {};

const modal = document.getElementById('servicesModal');
const modalClose = document.getElementById('modalClose');
const categoryList = document.getElementById('categoryList');
const serviceGrid = document.getElementById('serviceGrid');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const currentCategoryDesc = document.getElementById('currentCategoryDesc');
const backTo = document.getElementById('backTo');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const modalToTop = document.getElementById('modalToTop');

const categoryOrder = services.map(s => s.id);
let activeCategoryId = categoryOrder[0];
let menuOpen = false;

function buildTelegramLink(text) {
  const base = meta.telegram || 'https://t.me/+79610271840';
  return base;
}

function buildWhatsappLink(serviceName) {
  const msg = `Обращение с сайта BORODABREY\nЗдравствуйте! Меня заинтересовала услуга: ${serviceName}`;
  return `https://wa.me/+79610271840?text=${encodeURIComponent(msg)}`;
}

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  const header = document.querySelector('.topbar');
  const offset = (header?.offsetHeight || 86) + 14;
  const top = window.scrollY + target.getBoundingClientRect().top - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const selector = btn.getAttribute('data-scroll');
    scrollToTarget(selector);
    closeMenu();
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(href);
    closeMenu();
  });
});

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    openModal(btn.getAttribute('data-modal'));
  });
});

function renderCategoryList() {
  categoryList.innerHTML = services.map(cat => {
    const count = cat.services.length;
    const isActive = cat.id === activeCategoryId ? 'is-active' : '';
    return `
      <button class="category-btn ${isActive}" data-category="${cat.id}">
        <strong>${cat.section} // ${cat.master}</strong>
        <small>${count} услуг${count === 1 ? 'а' : ''}</small>
      </button>
    `;
  }).join('');
  categoryList.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => openCategory(btn.dataset.category));
  });
}

function renderCategory(catId) {
  const cat = services.find(s => s.id === catId) || services[0];
  activeCategoryId = cat.id;
  currentCategoryTitle.textContent = `${cat.section} // ${cat.master}`;
  currentCategoryDesc.textContent = `Премиальные услуги категории «${cat.section}» для уровня ${cat.master.toLowerCase()}.`;
  serviceGrid.innerHTML = cat.services.map((item, index) => `
    <article class="service-item">
      <div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
      <div class="service-item__bottom">
        <div class="service-item__price">${item.price}</div>
        <button class="service-item__btn" data-book="${encodeURIComponent(item.title)}">Записаться</button>
      </div>
    </article>
  `).join('');
  serviceGrid.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = decodeURIComponent(btn.getAttribute('data-book'));
      window.open(buildWhatsappLink(name), '_blank', 'noopener,noreferrer');
    });
  });
  renderCategoryList();
}

function openCategory(catId) {
  activeCategoryId = catId;
  renderCategory(catId);
  openModal();
}

function openModal(catId) {
  if (catId) activeCategoryId = catId;
  renderCategory(activeCategoryId);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
modalClose.addEventListener('click', closeModal);
modalToTop.addEventListener('click', () => {
  closeModal();
  scrollToTarget('#top');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeMenu();
  }
});

function updateBackButton() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight;
  const nearBottom = scrollY + window.innerHeight >= docHeight - 520;
  if (scrollY > 260) {
    backTo.classList.add('is-visible');
    backTo.textContent = nearBottom ? '↑' : '↓';
    backTo.title = nearBottom ? 'Вверх' : 'Вниз';
  } else {
    backTo.classList.remove('is-visible');
  }
}

backTo.addEventListener('click', () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight;
  const nearBottom = scrollY + window.innerHeight >= docHeight - 520;
  if (nearBottom) {
    scrollToTarget('#top');
  } else {
    scrollToTarget('#contacts');
  }
});

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('is-open');
}

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('is-open', menuOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => closeMenu());
});

window.addEventListener('scroll', updateBackButton, { passive: true });
window.addEventListener('resize', updateBackButton);

renderCategory(activeCategoryId);
updateBackButton();

const revealTargets = document.querySelectorAll('.hero__copy, .hero__visual, .stat, .service-card, .story__img, .story__copy, .barber-card, .gallery__item, .footer__panel, .footer__brand');
revealTargets.forEach((el, index) => {
  el.classList.add('reveal');
  el.style.setProperty('--reveal-delay', `${Math.min(index, 10) * 80}ms`);
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.16 });
revealTargets.forEach(el => revealObserver.observe(el));

