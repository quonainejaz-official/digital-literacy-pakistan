// Digital Literacy Pakistan - Main JavaScript
(function() {
  'use strict';

  const quizQuestions = [
    { question: "What is the safest way to create a strong password?", options: ["Use your birthday and pet's name", "Use a combination of letters, numbers, and symbols", "Use the same password for all accounts", "Write it on a sticky note near your computer"], correct: 1, explanation: "Strong passwords use a mix of uppercase, lowercase, numbers, and symbols. Never use personal information or reuse passwords." },
    { question: "How can you tell if an email might be a phishing scam?", options: ["It has spelling mistakes and urgent language", "It comes from a familiar company", "It has colorful images and logos", "It was sent to many people at once"], correct: 0, explanation: "Phishing emails often have poor grammar, spelling mistakes, and create a sense of urgency to trick you into acting quickly." },
    { question: "What should you do if you receive a suspicious link?", options: ["Click it to see what it is", "Forward it to friends as a warning", "Hover over it to check the URL before clicking", "Delete it immediately without checking"], correct: 2, explanation: "Always hover over links to see where they actually lead. If the URL looks suspicious or doesn't match the supposed sender, don't click it." },
    { question: "Which is the most secure way to browse the internet?", options: ["Using public WiFi without a password", "Looking for 'HTTPS' and the padlock icon", "Using any website that appears in search results", "Clicking on ads and pop-ups"], correct: 1, explanation: "HTTPS and the padlock icon indicate that the website uses encryption to protect your data during transmission." },
    { question: "What is two-factor authentication (2FA)?", options: ["Using two different passwords", "A second layer of security beyond just a password", "Logging in from two different devices", "Having two email accounts"], correct: 1, explanation: "2FA adds an extra security step, usually requiring a code sent to your phone or email in addition to your password." },
    { question: "How often should you update your passwords?", options: ["Never, if they're strong enough", "Only when you forget them", "Every 6-12 months or after a security breach", "Every week"], correct: 2, explanation: "Regular password updates and immediate changes after security breaches help protect your accounts from unauthorized access." },
    { question: "What is the best way to handle email attachments?", options: ["Open all attachments immediately", "Only open attachments from known senders after scanning", "Forward interesting attachments to others", "Download all attachments to your computer"], correct: 1, explanation: "Only open attachments from trusted sources and ensure your antivirus software scans them first to prevent malware infections." },
    { question: "How can you protect your privacy on social media?", options: ["Share everything publicly", "Accept all friend requests", "Review and adjust your privacy settings regularly", "Use the same password for all social media accounts"], correct: 2, explanation: "Regularly reviewing privacy settings helps you control who sees your information and protects you from identity theft." },
    { question: "What should you do if you think you've been hacked?", options: ["Ignore it and hope it goes away", "Immediately change your passwords and enable 2FA", "Tell everyone on social media", "Turn off your computer and never use it again"], correct: 1, explanation: "Quick action is crucial. Change passwords immediately, enable 2FA, and check for any unauthorized activity on your accounts." },
    { question: "What is the most important thing to remember about online safety?", options: ["Technology is always safe to use", "Be cautious and think before you click", "Only use websites you know", "Never use the internet"], correct: 1, explanation: "The most important principle is to stay vigilant, think critically about online interactions, and prioritize your digital safety." }
  ];

  let currentQuestionIndex = 0;
  let userAnswers = [];
  let quizScore = 0;
  let isLanguageUrdu = false;

  function initTypewriter() {
    const el = document.getElementById('typed-text');
    if (el && typeof Typed !== 'undefined') {
      new Typed('#typed-text', {
        strings: ['Digital Literacy Pakistan', 'Digital Literacy Pakistan'],
        typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, showCursor: true, cursorChar: '|'
      });
    }
  }

  function openQuizModal() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetQuiz();
    loadQuestion();
  }

  function closeQuizModal() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  function resetQuiz() {
    currentQuestionIndex = 0; userAnswers = []; quizScore = 0;
    const results = document.getElementById('quizResults');
    const content = document.getElementById('quizContent');
    if (results) results.classList.add('hidden');
    if (content) content.classList.remove('hidden');
    updateProgress();
  }

  function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;
    quizContent.innerHTML = `
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">${question.question}</h3>
        <div class="space-y-3">
          ${question.options.map((option, index) =>
            `<button onclick="window.digitalLiteracyPakistan.selectAnswer(${index})" class="quiz-option w-full text-left p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all">${option}</button>`
          ).join('')}
        </div>
      </div>
      <div class="flex justify-between">
        <button onclick="window.digitalLiteracyPakistan.previousQuestion()" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
        <button id="nextBtn" onclick="window.digitalLiteracyPakistan.nextQuestion()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors opacity-50 cursor-not-allowed" disabled>${currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}</button>
      </div>`;
  }

  function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      opt.classList.remove('border-green-500', 'bg-green-100');
      if (i === answerIndex) opt.classList.add('border-green-500', 'bg-green-100');
    });
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) { nextBtn.classList.remove('opacity-50', 'cursor-not-allowed'); nextBtn.disabled = false; }
  }

  function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) return;
    if (currentQuestionIndex < quizQuestions.length - 1) { currentQuestionIndex++; loadQuestion(); updateProgress(); }
    else { finishQuiz(); }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) { currentQuestionIndex--; loadQuestion(); updateProgress(); }
  }

  function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    const el = document.getElementById('currentQuestion');
    const perc = document.getElementById('progressPercent');
    const bar = document.getElementById('progressBar');
    if (el) el.textContent = currentQuestionIndex + 1;
    if (perc) perc.textContent = Math.round(progress);
    if (bar) bar.style.width = progress + '%';
  }

  function finishQuiz() {
    quizScore = 0;
    userAnswers.forEach((answer, index) => { if (answer === quizQuestions[index].correct) quizScore++; });
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    const content = document.getElementById('quizContent');
    const results = document.getElementById('quizResults');
    if (content) content.classList.add('hidden');
    if (results) results.classList.remove('hidden');
    generateResultsChart(percentage);
    generateLearningPath(percentage);
  }

  function generateResultsChart(percentage) {
    const el = document.getElementById('resultsChart');
    if (!el || typeof echarts === 'undefined') return;
    const chart = echarts.init(el);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        name: 'Quiz Results', type: 'pie', radius: ['40%', '70%'],
        avoidLabelOverlap: false, label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '18', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: quizScore, name: 'Correct Answers', itemStyle: { color: '#059669' } },
          { value: quizQuestions.length - quizScore, name: 'Incorrect Answers', itemStyle: { color: '#DC2626' } }
        ]
      }]
    });
    window.addEventListener('resize', () => chart.resize());
  }

  function generateLearningPath(percentage) {
    const el = document.getElementById('learningPath');
    if (!el) return;
    let recommendations = [];
    if (percentage < 40) recommendations = ['Start with Basic Computer Skills tutorials', 'Learn about Internet Navigation', 'Practice with Email Communication basics', 'Take the Internet Safety fundamentals course'];
    else if (percentage < 70) recommendations = ['Improve your Password Security knowledge', 'Learn about Social Media Safety', 'Practice identifying Phishing attempts', 'Explore Advanced Security Features'];
    else recommendations = ['Become a Digital Literacy Mentor', 'Explore Advanced Cybersecurity topics', 'Help others in the Community Forum', 'Consider pursuing advanced certifications'];
    el.innerHTML = recommendations.map(r => `<div class="flex items-center text-gray-700"><span class="text-green-600 mr-2">\u2713</span><span>${r}</span></div>`).join('');
  }

  function initStatsCounter() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const count = parseInt(target.getAttribute('data-count'), 10);
          if (typeof anime !== 'undefined') {
            anime({ targets: { value: 0 }, value: count, duration: 2000, easing: 'easeOutQuart',
              update: function(anim) { target.textContent = Math.round(anim.animatables[0].target.value).toLocaleString(); }
            });
          } else {
            target.textContent = count.toLocaleString();
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.1 });
    counters.forEach(c => observer.observe(c));
  }

  function initImpactChart() {
    const el = document.getElementById('impactChart');
    if (!el || typeof echarts === 'undefined') return;
    const chart = echarts.init(el);
    chart.setOption({
      title: { text: 'Digital Literacy Growth in Pakistan', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
      tooltip: { trigger: 'axis' },
      legend: { data: ['Rural Areas', 'Urban Areas', 'Women Participants'], bottom: 10 },
      xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025'] },
      yAxis: { type: 'value', name: 'Participants (Thousands)' },
      series: [
        { name: 'Rural Areas', type: 'line', data: [5, 12, 25, 45, 78, 132], itemStyle: { color: '#2D5A27' }, smooth: true },
        { name: 'Urban Areas', type: 'line', data: [8, 18, 35, 58, 95, 150], itemStyle: { color: '#1E3A8A' }, smooth: true },
        { name: 'Women Participants', type: 'line', data: [3, 8, 18, 35, 62, 110], itemStyle: { color: '#EA580C' }, smooth: true }
      ]
    });
    window.addEventListener('resize', () => chart.resize());
  }

  function toggleLanguage() {
    isLanguageUrdu = !isLanguageUrdu;
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    if (isLanguageUrdu) { btn.textContent = 'English'; document.body.setAttribute('dir', 'rtl'); document.body.classList.add('urdu'); }
    else { btn.textContent = 'اردو'; document.body.setAttribute('dir', 'ltr'); document.body.classList.remove('urdu'); }
  }

  function initAnimations() {
    if (typeof anime === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({ targets: entry.target, translateY: [50, 0], opacity: [0, 1], duration: 800, easing: 'easeOutQuart', delay: anime.stagger(100) });
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.card-hover').forEach(card => observer.observe(card));
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      const modal = document.getElementById('quizModal');
      if (!modal) return;
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) { closeQuizModal(); }
      if (!modal.classList.contains('hidden') && !document.getElementById('quizContent')?.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') previousQuestion();
        else if (e.key === 'ArrowRight' || e.key === 'Enter') {
          const btn = document.getElementById('nextBtn');
          if (btn && !btn.disabled) nextQuestion();
        }
      }
    });
  }

  function init() {
    initTypewriter();
    initStatsCounter();
    initImpactChart();
    initAnimations();
    initSmoothScroll();
    initKeyboardNav();
    const startBtn = document.getElementById('startQuizBtn');
    const closeBtn = document.getElementById('closeQuiz');
    const retakeBtn = document.getElementById('retakeQuiz');
    const learnBtn = document.getElementById('startLearning');
    const langBtn = document.getElementById('langToggle');
    if (startBtn) startBtn.addEventListener('click', openQuizModal);
    if (closeBtn) closeBtn.addEventListener('click', closeQuizModal);
    if (retakeBtn) retakeBtn.addEventListener('click', resetQuiz);
    if (learnBtn) learnBtn.addEventListener('click', () => { window.location.href = 'pages/tutorials.html'; });
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

  window.digitalLiteracyPakistan = {
    openQuizModal, closeQuizModal, resetQuiz, selectAnswer, nextQuestion, previousQuestion, toggleLanguage,
    showNotification: function(message, type) {
      const el = document.createElement('div');
      el.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`;
      el.textContent = message; document.body.appendChild(el);
      if (typeof anime !== 'undefined') {
        anime({ targets: el, translateX: [300, 0], opacity: [0, 1], duration: 300, easing: 'easeOutQuart' });
        setTimeout(() => { anime({ targets: el, translateX: [0, 300], opacity: [1, 0], duration: 300, easing: 'easeInQuart', complete: () => { document.body.removeChild(el); } }); }, 3000);
      } else { setTimeout(() => { el.style.opacity = '0'; setTimeout(() => document.body.removeChild(el), 300); }, 3000); }
    }
  };
})();
