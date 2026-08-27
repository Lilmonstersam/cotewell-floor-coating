(function () {
  var header = document.querySelector('[data-header]');
  var sectionNav = document.querySelector('[data-section-nav]');
  var sectionNavTrack = sectionNav ? sectionNav.querySelector('.section-nav__links') : null;
  var sectionNavLinks = sectionNav ? Array.prototype.slice.call(sectionNav.querySelectorAll('a[href^="#"]')) : [];
  var sectionTargets = sectionNavLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);
  var hero = document.querySelector('.hero');
  var stickyCta = document.querySelector('[data-sticky-cta]');
  var activeSectionId = 'overview';
  var lastY = 0;
  var ticking = false;

  function updateHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty('--site-header-height', header.offsetHeight + 'px');
  }

  function updateSectionNav() {
    if (!sectionTargets.length) return;
    var headerOffset = header ? header.offsetHeight : 0;
    var marker = headerOffset + (sectionNav ? sectionNav.offsetHeight : 0) + 32;
    var current = sectionTargets[0];

    sectionTargets.forEach(function (section) {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });

    if (!current || current.id === activeSectionId) return;
    activeSectionId = current.id;
    sectionNavLinks.forEach(function (link) {
      var isCurrent = link.getAttribute('href') === '#' + activeSectionId;
      if (isCurrent) {
        link.setAttribute('aria-current', 'true');
        if (sectionNavTrack) {
          sectionNavTrack.scrollTo({
            left: link.offsetLeft - ((sectionNavTrack.clientWidth - link.offsetWidth) / 2),
            behavior: 'smooth'
          });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateStickyCta() {
    if (!hero || !stickyCta) return;
    var show = hero.getBoundingClientRect().bottom <= 0;
    stickyCta.classList.toggle('is-visible', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
  }

  function updateHeader() {
    ticking = false;
    var y = window.scrollY || 0;
    if (header) {
      header.classList.toggle('is-hidden', y > lastY && y > 180);
    }
    updateStickyCta();
    updateSectionNav();
    lastY = y;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  updateHeaderHeight();
  updateStickyCta();
  updateSectionNav();

  if ('ResizeObserver' in window && header) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  document.querySelectorAll('.faq-list details').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details').forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
