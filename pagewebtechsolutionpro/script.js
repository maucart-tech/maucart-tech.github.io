/*
  SOLUTION TECHPRO SCRIPT JAVASCRIPT PURO VANILLA JS
  Gestion interactiva Modo Oscuro Acordeon FAQ Carrusel de Repuestos y Menu Movil
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initFaqAccordion();
    initRepuestosCarousel();
  });

  /* 1 Modo Oscuro con LocalStorage */
  function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (!toggleBtns.length) return;

    // Verificar si el usuario ya guardo preferencia previa
    const savedTheme = localStorage.getItem('techpro-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark');
      updateThemeButtons(true);
    } else {
      document.body.classList.remove('dark');
      updateThemeButtons(false);
    }

    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('techpro-theme', isDark ? 'dark' : 'light');
        updateThemeButtons(isDark);
      });
    });

    function updateThemeButtons(isDark) {
      toggleBtns.forEach((btn) => {
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      });
    }
  }

  /* 2 Menu de Navegacion Movil */
  /* 2 Menu de Navegacion Movil */
  function initMobileNav() {
    const toggleBtn = document.querySelector('.nav-mobile-toggle');
    const drawer = document.querySelector('.mobile-menu-drawer');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Cerrar al hacer clic en cualquier enlace del menu movil
    const mobileLinks = drawer.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Cerrar al hacer clic fuera del drawer
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Cerrar si se redimensiona a pantalla de escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    }
  }

  /* 3 Acordeon de Preguntas Frecuentes FAQ */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question-btn');
      const panel = item.querySelector('.faq-answer-panel');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Cerrar los demas acordeones abiertos
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const otherPanel = other.querySelector('.faq-answer-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Alternar el actual
        if (isOpen) {
          item.classList.remove('open');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* 4 Carrusel Interactivo de Repuestos */
  function initRepuestosCarousel() {
    const track = document.getElementById('repuestosTrack');
    const prevBtn = document.getElementById('repuestosPrevBtn');
    const nextBtn = document.getElementById('repuestosNextBtn');
    const counter = document.getElementById('repuestosCounter');
    const dotsContainer = document.getElementById('repuestosDots');

    if (!track) return;

    const cards = track.querySelectorAll('.repuesto-card');
    const totalItems = cards.length;
    if (totalItems === 0) return;

    let currentIndex = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w < 600) return 1;
      if (w < 850) return 2;
      if (w < 1100) return 3;
      return 4;
    }

    function getMaxIndex() {
      return Math.max(0, totalItems - getVisibleCount());
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const max = getMaxIndex();

      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a posición ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      const max = getMaxIndex();
      if (currentIndex > max) currentIndex = max;
      if (currentIndex < 0) currentIndex = 0;

      const card = cards[0];
      if (!card) return;

      const gap = 16; // 1rem gap
      const cardWidth = card.offsetWidth;
      const offset = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      // Botones de navegacion
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= max;

      // Contador visual
      if (counter) {
        const visible = getVisibleCount();
        const end = Math.min(currentIndex + visible, totalItems);
        counter.textContent = `${currentIndex + 1}–${end} / ${totalItems}`;
      }

      // Actualizar dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
        updateCarousel();
      });
    }

    // Deslizamiento tactil para moviles Touch Swipe
    let startX = 0;
    let isTouching = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isTouching = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          // Deslizar hacia la izquierda siguiente
          currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
        } else {
          // Deslizar hacia la derecha anterior
          currentIndex = Math.max(0, currentIndex - 1);
        }
        updateCarousel();
      }
      isTouching = false;
    }, { passive: true });

    window.addEventListener('resize', () => {
      renderDots();
      updateCarousel();
    });

    renderDots();
    updateCarousel();
  }
})();
