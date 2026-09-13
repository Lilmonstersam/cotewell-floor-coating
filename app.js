(function () {
  var header = document.querySelector('[data-header]');
  var sectionNav = document.querySelector('[data-section-nav]');
  var sectionNavTrack = sectionNav ? sectionNav.querySelector('.section-nav__links') : null;
  var sectionNavLinks = sectionNav
    ? Array.prototype.slice.call(sectionNav.querySelectorAll('a[href^="#"]'))
    : [];
  var sectionTargets = sectionNavLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);
  var hero = document.querySelector('.hero');
  var stickyCta = document.querySelector('[data-sticky-cta]');
  var activeSectionId = 'overview';
  var lastY = 0;
  var ticking = false;

  // ── Keep --site-header-height in sync with actual rendered height ──
  function updateHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty(
      '--site-header-height', header.offsetHeight + 'px'
    );
  }

  // ── Highlight active section in section-nav ──
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

  // ── Sticky CTA: show once hero has scrolled out ──
  function updateStickyCta() {
    if (!hero || !stickyCta) return;
    var show = hero.getBoundingClientRect().bottom <= 0;
    stickyCta.classList.toggle('is-visible', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
  }

  // ── Header scroll logic ──
  // Hide when scrolling DOWN past 180px; show when scrolling UP.
  // Add .is-compact (drop-shadow) past 80px.
  function updateHeader() {
    ticking = false;
    var y = window.scrollY || 0;
    if (header && !document.body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > lastY && y > 180);
      var compact = header.classList.contains('is-compact');
      header.classList.toggle('is-compact', compact ? y > 10 : y > 80);
    }
    updateStickyCta();
    updateSectionNav();
    lastY = y;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });

  // Run once on load
  updateHeaderHeight();
  updateStickyCta();
  updateSectionNav();

  // Keep height in sync on resize
  if ('ResizeObserver' in window && header) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
  }

  // ── Scroll-reveal (IntersectionObserver) ──
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

  // ── FAQ accordion: one open at a time ──
  document.querySelectorAll('.faq-list details').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details').forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  // ── Hero video: mute toggle + pause when off-screen ──
  var heroVideo = document.querySelector('[data-hero-video]');
  var heroToggle = document.querySelector('[data-hero-video-toggle]');
  if (heroVideo && heroToggle) {
    var toggleIcon = heroToggle.querySelector('[data-toggle-icon]');
    heroToggle.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;
      if (toggleIcon) toggleIcon.textContent = heroVideo.muted ? '🔇' : '🔊';
      heroToggle.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
      if (!heroVideo.muted && heroVideo.paused) heroVideo.play();
    });

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
      heroVideo.setAttribute('controls', '');
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var playing = heroVideo.play();
            if (playing && playing.catch) playing.catch(function () {});
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.2 }).observe(heroVideo);
    }
  }

  // ── Mobile menu toggle ──
  var menuButton = document.querySelector('.menu-toggle');
  var primary    = document.querySelector('.primary');
  if (menuButton && primary) {
    menuButton.addEventListener('click', function () {
      var open = primary.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('menu-open', open);
    });
  }

  // ── Learning Centre dropdown (keyboard toggle) ──
  var learningButton = document.querySelector('.learning-menu > button');
  if (learningButton) {
    learningButton.addEventListener('click', function () {
      var expanded = learningButton.getAttribute('aria-expanded') === 'true';
      learningButton.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  }

  // ── Custom Video Play Buttons ──
  var playButtons = document.querySelectorAll('.video-play-btn');
  playButtons.forEach(function (btn) {
    var video = btn.previousElementSibling;
    if (video && video.tagName === 'VIDEO') {
      btn.addEventListener('click', function () {
        video.play();
      });
      video.addEventListener('play', function () {
        btn.style.display = 'none';
      });
      video.addEventListener('pause', function () {
        btn.style.display = 'flex';
      });
    }
  });

})();
