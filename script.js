/* ============================================
   Ricky | AI × Manufacturing DX Strategist
   メインスクリプト
   ============================================ */

(function () {
  'use strict';

  /* --------------------------------------------
     1. ヘッダーのスクロール検知
        スクロールするとヘッダーに背景色が付く
     -------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const SCROLL_THRESHOLD = 40;

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 初期表示時にも反映

  /* --------------------------------------------
     2. モバイルナビゲーションのトグル
     -------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    nav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  /* --------------------------------------------
     3. ナビクリックでスムーズスクロール
        (CSS scroll-behavior と併用、ヘッダー高さを考慮)
     -------------------------------------------- */
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // モバイルナビが開いていれば閉じる
      if (nav.classList.contains('is-open')) {
        closeNav();
      }

      // ヘッダー高さ分オフセット
      const headerOffset = header.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  /* --------------------------------------------
     4. スクロール時の reveal アニメーション
        IntersectionObserverで表示領域に入ったらクラス付与
     -------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 一度表示したら監視解除
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // フォールバック: IntersectionObserver未対応ブラウザでは即表示
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --------------------------------------------
     5. フッターの年号を自動更新
     -------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------
     6. ESCキーでモバイルメニューを閉じる (UX向上)
     -------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
    }
  });

  /* --------------------------------------------
     7. リサイズ時、PCサイズに戻ったらモバイルメニューをリセット
     -------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768 && nav.classList.contains('is-open')) {
        closeNav();
      }
    }, 150);
  });

})();
