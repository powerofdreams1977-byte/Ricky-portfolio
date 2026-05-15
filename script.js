/* ========================================
   script.js
   AI × Manufacturing DX Strategist
======================================== */

(function () {
  'use strict';

  /* ----------------------------------------
     1. ヘッダー：スクロールで背景を追加
  ---------------------------------------- */
  const header = document.getElementById('header');

  function onHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll(); // 初期チェック

  /* ----------------------------------------
     2. スムーズスクロール
        href="#xxx" のリンクに適用
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // ヘッダー高さ分オフセット
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // スマホドロワーを閉じる
      closeDrawer();
    });
  });

  /* ----------------------------------------
     3. ハンバーガーメニュー（スマホ用ドロワー）
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  // オーバーレイを動的生成
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openDrawer() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  overlay.addEventListener('click', closeDrawer);

  // ESCキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ----------------------------------------
     4. フェードイン（Intersection Observer）
        .fade-in クラスの要素が画面に入ったら
        .is-visible を付与してアニメーション発火
  ---------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // 一度表示したら監視を解除
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,       // 12% 見えたら発火
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // IntersectionObserver 非対応ブラウザは即表示
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----------------------------------------
     5. アクティブナビゲーション
        スクロール位置に応じてナビリンクに
        .is-active を付与する
  ---------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  function updateActiveNav() {
    const scrollY   = window.scrollY;
    const headerH   = header ? header.offsetHeight : 0;
    let currentId   = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - headerH - 80;
      if (scrollY >= top) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ----------------------------------------
     6. ヒーロータイトルのタイプライター風
        ページロード時にゆっくり表示
  ---------------------------------------- */
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    // ページ読み込み後、少し待ってから is-visible を付与
    setTimeout(function () {
      heroContent.classList.add('is-visible');
    }, 150);
  }

  const heroCards = document.querySelector('.hero__cards');
  if (heroCards) {
    setTimeout(function () {
      heroCards.classList.add('is-visible');
    }, 400);
  }

})();
