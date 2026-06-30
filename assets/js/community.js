// Digital Literacy Pakistan - Community Page
(function() {
  'use strict';

  function initSuccessStoriesCarousel() {
    const el = document.getElementById('successStories');
    if (el && typeof Splide !== 'undefined') {
      new Splide('#successStories', {
        type: 'loop', perPage: 3, perMove: 1, gap: '1.5rem', autoplay: true, interval: 4000,
        breakpoints: { 1024: { perPage: 2 }, 768: { perPage: 1 } }
      }).mount();
    }
  }

  function filterForumPosts(category) {
    document.querySelectorAll('.forum-post').forEach(post => {
      const cat = post.getAttribute('data-category');
      const shouldShow = category === 'all' || cat === category;
      post.style.display = shouldShow ? 'block' : 'none';
      if (shouldShow && typeof anime !== 'undefined') {
        anime({ targets: post, opacity: [0, 1], translateY: [20, 0], duration: 300, easing: 'easeOutQuart' });
      }
    });
  }

  function initForumFunctionality() {
    const categoryButtons = document.querySelectorAll('.forum-category');
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        categoryButtons.forEach(btn => {
          btn.classList.remove('active', 'bg-purple-100', 'text-purple-800');
          btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        this.classList.add('active', 'bg-purple-100', 'text-purple-800');
        this.classList.remove('bg-gray-100', 'text-gray-700');
        filterForumPosts(this.getAttribute('data-category'));
      });
    });
    const form = document.getElementById('newPostForm');
    if (form) form.addEventListener('submit', function(e) { e.preventDefault(); submitNewPost(); });
  }

  function submitNewPost() {
    const title = document.getElementById('postTitle'); const content = document.getElementById('postContent');
    if (!title?.value?.trim() || !content?.value?.trim()) { showNotification('Please fill in all fields', 'error'); return; }
    showNotification('Your post has been published successfully!', 'success');
    closeNewPostModal();
    if (form) form.reset();
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
    document.querySelectorAll('.story-card, .forum-post').forEach(c => observer.observe(c));
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

  function openNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
  }

  function closeNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; }
  }

  function showNotification(msg, type) {
    const el = document.createElement('div');
    el.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`;
    el.textContent = msg; document.body.appendChild(el);
    if (typeof anime !== 'undefined') {
      anime({ targets: el, translateX: [300, 0], opacity: [0, 1], duration: 300, easing: 'easeOutQuart' });
      setTimeout(() => { anime({ targets: el, translateX: [0, 300], opacity: [1, 0], duration: 300, easing: 'easeInQuart', complete: () => { document.body.removeChild(el); } }); }, 3000);
    } else {
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => document.body.removeChild(el), 300); }, 3000);
    }
  }

  function init() {
    initSuccessStoriesCarousel(); initForumFunctionality(); initAnimations(); initLanguageToggle();
    const newPostBtn = document.querySelector('[onclick="openNewPostModal()"]');
    const closePostBtn = document.querySelector('[onclick="closeNewPostModal()"]');
    window.openNewPostModal = openNewPostModal;
    window.closeNewPostModal = closeNewPostModal;
    window.askExpert = function(name) {
      showNotification(`Your question will be directed to ${name}. They typically respond within 24 hours.`, 'info');
    };
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeNewPostModal();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
