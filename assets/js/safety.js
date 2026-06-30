// Digital Literacy Pakistan - Safety Page
(function() {
  'use strict';

  function checkPasswordStrength(password) {
    const meter = document.getElementById('strengthMeter');
    const text = document.getElementById('strengthText');
    const feedback = document.getElementById('feedbackList');
    const container = document.getElementById('passwordFeedback');
    if (!meter || !text || !feedback || !container) return;
    if (!password.length) { meter.style.width = '0%'; text.textContent = 'Enter a password to test'; container.classList.add('hidden'); return; }
    let score = 0; const fb = [];
    if (password.length >= 8) score++; else fb.push('Password should be at least 8 characters');
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++; else fb.push('Add lowercase letters');
    if (/[A-Z]/.test(password)) score++; else fb.push('Add uppercase letters');
    if (/[0-9]/.test(password)) score++; else fb.push('Add numbers');
    if (/[^A-Za-z0-9]/.test(password)) score++; else fb.push('Add special characters (!@#$%^&)');
    if (/(.)\1{2,}/.test(password)) { score--; fb.push('Avoid repeated characters'); }
    if (/123|abc|qwe/i.test(password)) { score--; fb.push('Avoid common sequences'); }
    let strength, color, width;
    if (score <= 2) { strength = 'Weak'; color = '#dc3545'; width = '25%'; }
    else if (score <= 3) { strength = 'Fair'; color = '#fd7e14'; width = '50%'; }
    else if (score <= 4) { strength = 'Good'; color = '#28a745'; width = '75%'; }
    else { strength = 'Strong'; color = '#007bff'; width = '100%'; }
    meter.style.width = width; meter.style.backgroundColor = color; text.textContent = strength;
    if (fb.length) {
      feedback.innerHTML = fb.map(i => `<div class="flex items-center text-sm text-gray-600"><span class="text-red-500 mr-2">⚠️</span><span>${i}</span></div>`).join('');
    } else {
      feedback.innerHTML = `<div class="flex items-center text-sm text-green-600"><span class="text-green-500 mr-2">✅</span><span>Excellent password security!</span></div>`;
    }
    container.classList.remove('hidden');
  }

  function generateStrongPassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pwd = '';
    pwd += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    pwd += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    pwd += '0123456789'[Math.floor(Math.random() * 10)];
    pwd += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    for (let i = 4; i < 12; i++) pwd += charset[Math.floor(Math.random() * charset.length)];
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    const el = document.getElementById('generatedPassword');
    if (!el) return;
    el.textContent = pwd; el.classList.remove('hidden');
    navigator.clipboard.writeText(pwd).then(() => showNotification('Strong password generated and copied to clipboard!', 'success')).catch(() => {});
    const pwdInput = document.getElementById('passwordInput');
    if (pwdInput) pwdInput.value = pwd;
    checkPasswordStrength(pwd);
  }

  const phishingScenarios = [
    { email: 'From: hbl-bank@secure-update.com\nSubject: Urgent: Verify Your Account Now\n\nDear Customer,\n\nYour HBL account will be suspended in 24 hours due to suspicious activity. Click here to verify immediately:\n\nhttp://hbl-verification.net/verify.php\n\nHBL Security Team', isPhishing: true, explanation: "This is a phishing attempt. The sender's email domain is suspicious and the link doesn't go to the official HBL website." },
    { email: 'From: noreply@jazz.com.pk\nSubject: Your Monthly Bill is Ready\n\nDear Customer,\n\nYour monthly bill for account 0300-1234567 is ready. Amount: PKR 1,250.\n\nView your bill: https://www.jazz.com.pk/bill\n\nJazz Customer Service', isPhishing: false, explanation: 'This is a legitimate email from Jazz. The domain is correct and the link goes to the official website.' },
    { email: 'From: google-security@accounts-alert.com\nSubject: Someone tried to access your Google account\n\nHi,\n\nWe noticed a login attempt from Islamabad, Pakistan. If this was not you, secure your account immediately:\n\nhttps://accounts.google.com/signin\n\nGoogle Security Team', isPhishing: true, explanation: 'This is suspicious. The sender domain is not from Google, even though it looks official.' },
    { email: 'From: info@daraz.pk\nSubject: Flash Sale - 50% Off Electronics!\n\nDear Shopper,\n\nDon\'t miss our 24-hour flash sale! Up to 50% off on electronics.\n\nShop now: https://www.daraz.pk/flash-sale\n\nHappy Shopping,\nDaraz Team', isPhishing: false, explanation: 'This appears to be a legitimate promotional email from Daraz with the correct domain.' },
    { email: 'From: nadra-update@gov.pk\nSubject: CNIC Verification Required\n\nCitizen,\n\nYour CNIC needs immediate verification. Click below to update your information:\n\nhttp://nadra-gov.pk-update.com/cnic-verify\n\nNADRA Pakistan', isPhishing: true, explanation: 'This is a phishing attempt. The link domain is suspicious and not the official NADRA website.' }
  ];

  let currentPhishingQuestion = 0;
  let phishingScore = 0;

  function loadPhishingQuestion() {
    if (currentPhishingQuestion >= phishingScenarios.length) { showPhishingResults(); return; }
    const scenario = phishingScenarios[currentPhishingQuestion];
    const progress = ((currentPhishingQuestion + 1) / phishingScenarios.length) * 100;
    const numEl = document.getElementById('phishingQuestionNum');
    const progEl = document.getElementById('phishingProgress');
    const content = document.getElementById('phishingContent');
    if (numEl) numEl.textContent = currentPhishingQuestion + 1;
    if (progEl) progEl.style.width = progress + '%';
    if (content) {
      content.innerHTML = `<div class="phishing-email p-4 rounded-lg mb-6"><pre class="whitespace-pre-wrap text-sm">${scenario.email}</pre></div><div class="text-center"><p class="text-lg font-semibold text-gray-900 mb-4">Is this email safe or suspicious?</p><div class="flex gap-4 justify-center"><button onclick="answerPhishingQuestion(false)" class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">Safe</button><button onclick="answerPhishingQuestion(true)" class="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">Phishing</button></div></div>`;
    }
  }

  window.answerPhishingQuestion = function(userAnswer) {
    const scenario = phishingScenarios[currentPhishingQuestion];
    const isCorrect = userAnswer === scenario.isPhishing;
    if (isCorrect) { phishingScore++; const sc = document.getElementById('phishingScore'); if (sc) sc.textContent = phishingScore; }
    const content = document.getElementById('phishingContent');
    if (content) {
      content.innerHTML = `<div class="text-center mb-6"><div class="text-4xl mb-2">${isCorrect ? '✅' : '❌'}</div><h3 class="text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'} mb-2">${isCorrect ? 'Correct!' : 'Incorrect'}</h3><p class="text-gray-700 text-sm">${scenario.explanation}</p></div><div class="text-center"><button onclick="nextPhishingQuestion()" class="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">${currentPhishingQuestion === phishingScenarios.length - 1 ? 'View Results' : 'Next Question'}</button></div>`;
    }
  };

  window.nextPhishingQuestion = function() { currentPhishingQuestion++; loadPhishingQuestion(); };

  function showPhishingResults() {
    const game = document.getElementById('phishingGame'); const results = document.getElementById('phishingResults');
    if (game) game.classList.add('hidden'); if (results) results.classList.remove('hidden');
    const final = document.getElementById('finalScore'); const msg = document.getElementById('scoreMessage');
    if (final) final.textContent = phishingScore;
    if (msg) {
      if (phishingScore === 5) msg.textContent = 'Perfect! You\'re an expert at spotting phishing attempts!';
      else if (phishingScore >= 3) msg.textContent = 'Good job! You have a solid understanding of phishing detection.';
      else if (phishingScore >= 2) msg.textContent = 'Not bad, but there\'s room for improvement. Keep learning!';
      else msg.textContent = 'Consider reviewing our safety resources to improve your skills.';
    }
  }

  window.resetPhishingGame = function() {
    currentPhishingQuestion = 0; phishingScore = 0;
    const sc = document.getElementById('phishingScore'); if (sc) sc.textContent = '0';
    const results = document.getElementById('phishingResults'); const game = document.getElementById('phishingGame');
    if (results) results.classList.add('hidden'); if (game) game.classList.remove('hidden');
    loadPhishingQuestion();
  };

  function showNotification(msg, type) {
    const el = document.createElement('div');
    el.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`;
    el.textContent = msg; document.body.appendChild(el);
    if (typeof anime !== 'undefined') {
      anime({ targets: el, translateX: [300, 0], opacity: [0, 1], duration: 300, easing: 'easeOutQuart' });
      setTimeout(() => { anime({ targets: el, translateX: [0, 300], opacity: [1, 0], duration: 300, easing: 'easeInQuart', complete: () => { document.body.removeChild(el); } }); }, 3000);
    } else { setTimeout(() => { el.style.opacity = '0'; setTimeout(() => document.body.removeChild(el), 300); }, 3000); }
  }

  function init() {
    const pwdInput = document.getElementById('passwordInput');
    const genBtn = document.getElementById('generatePassword');
    const langBtn = document.getElementById('langToggle');
    if (pwdInput) pwdInput.addEventListener('input', function() { checkPasswordStrength(this.value); });
    if (genBtn) genBtn.addEventListener('click', generateStrongPassword);
    if (langBtn) {
      langBtn.addEventListener('click', function() {
        this.textContent = this.textContent === 'اردو' ? 'English' : 'اردو';
        if (this.textContent === 'English') { document.body.setAttribute('dir', 'rtl'); document.body.classList.add('urdu'); }
        else { document.body.setAttribute('dir', 'ltr'); document.body.classList.remove('urdu'); }
      });
    }
    loadPhishingQuestion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
