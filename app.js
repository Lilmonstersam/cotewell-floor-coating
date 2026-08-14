(function () {
  var header = document.querySelector('[data-header]');
  var hero = document.querySelector('.hero');
  var stickyCta = document.querySelector('[data-sticky-cta]');
  var lastY = 0;
  var ticking = false;

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
    lastY = y;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  updateStickyCta();

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
