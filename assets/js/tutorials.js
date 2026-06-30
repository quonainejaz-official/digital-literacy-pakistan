// Digital Literacy Pakistan - Tutorials Page
(function() {
  'use strict';

  function initFeaturedCarousel() {
    const el = document.getElementById('featuredTutorials');
    if (el && typeof Splide !== 'undefined') {
      new Splide('#featuredTutorials', {
        type: 'loop', perPage: 4, perMove: 1, gap: '1rem', autoplay: true, interval: 3000,
        breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2 }, 480: { perPage: 1 } }
      }).mount();
    }
  }

  function filterTutorials(searchTerm, category) {
    document.querySelectorAll('.tutorial-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.tutorial-card-body p')?.textContent.toLowerCase() || '';
      const cat = card.getAttribute('data-category');
      const matchSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchCat = category === 'all' || cat === category;
      card.style.display = matchSearch && matchCat ? 'block' : 'none';
      if (matchSearch && matchCat && typeof anime !== 'undefined') {
        anime({ targets: card, opacity: [0, 1], translateY: [20, 0], duration: 300, easing: 'easeOutQuart' });
      }
    });
  }

  function initSearchFilter() {
    const search = document.getElementById('searchTutorials');
    const filters = document.querySelectorAll('.filter-btn');
    if (!search) return;
    search.addEventListener('input', function() { filterTutorials(this.value.toLowerCase(), getActiveFilter()); });
    filters.forEach(btn => {
      btn.addEventListener('click', function() {
        filters.forEach(b => { b.classList.remove('filter-btn-active'); b.classList.add('filter-btn-inactive'); });
        this.classList.add('filter-btn-active'); this.classList.remove('filter-btn-inactive');
        const inp = document.getElementById('searchTutorials');
        filterTutorials(inp ? inp.value.toLowerCase() : '', this.getAttribute('data-filter'));
      });
    });
  }

  function getActiveFilter() {
    const active = document.querySelector('.filter-btn-active');
    return active ? active.getAttribute('data-filter') : 'all';
  }

  function initAnimations() {
    if (typeof anime === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({ targets: entry.target, translateY: [50, 0], opacity: [0, 1], duration: 600, easing: 'easeOutQuart', delay: anime.stagger(100) });
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.tutorial-card').forEach(c => observer.observe(c));
  }

  function initLanguageToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      this.textContent = this.textContent === 'اردو' ? 'English' : 'اردو';
      if (this.textContent === 'English') { document.body.setAttribute('dir', 'rtl'); document.body.classList.add('urdu'); }
      else { document.body.setAttribute('dir', 'ltr'); document.body.classList.remove('urdu'); }
    });
  }

  function init() {
    initFeaturedCarousel(); initSearchFilter(); initAnimations(); initLanguageToggle();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.startTutorial = function(id) {
    const msg = `Starting ${id.replace(/-/g, ' ')} tutorial!`;
    if (window.digitalLiteracyPakistan?.showNotification) {
      window.digitalLiteracyPakistan.showNotification(msg, 'success');
    } else { alert(msg); }
  };
})();
