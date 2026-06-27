(function () {
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj || {}));
  }

  function getData() {
    return deepClone(window.DEFAULT_PORTFOLIO_DATA || {});
  }

  function text(node, value) {
    if (node) node.textContent = value || '';
  }

  function create(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }

  function render() {
    const data = getData();
    const profile = data.profile || {};
    const contact = data.contact || {};

    document.title = `${profile.displayName || 'Portfolio'}｜IT Management & Cybersecurity`;
    document.querySelectorAll('[data-field]').forEach((node) => {
      const path = node.getAttribute('data-field').split('.');
      const value = path.reduce((acc, key) => (acc ? acc[key] : ''), data);
      text(node, value);
    });

    text(document.getElementById('summaryText'), profile.summary);
    text(document.getElementById('mottoText'), profile.motto ? `“${profile.motto}”` : '');

    const focusList = document.getElementById('focusList');
    focusList.innerHTML = '';
    (data.focus || []).forEach((item) => {
      const li = create('li');
      li.innerHTML = `<span></span>${escapeHtml(item)}`;
      focusList.appendChild(li);
    });

    const metrics = document.getElementById('metricsList');
    metrics.innerHTML = '';
    (data.metrics || []).forEach((item) => {
      const card = create('article', 'metric-card reveal');
      card.innerHTML = `<strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.note)}</small>`;
      metrics.appendChild(card);
    });

    const capabilityGrid = document.getElementById('capabilityGrid');
    capabilityGrid.innerHTML = '';
    (data.capabilities || []).forEach((item) => {
      const card = create('article', 'cap-card reveal');
      card.innerHTML = `<div class="cap-icon">${escapeHtml(item.icon || '◆')}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`;
      capabilityGrid.appendChild(card);
    });

    const skillCategories = document.getElementById('skillCategories');
    skillCategories.innerHTML = '';
    const categoryData = data.skillCategories || [];
    categoryData.forEach((group) => {
      const card = create('article', 'skill-category-card reveal');
      const tags = (group.items || []).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('');
      card.innerHTML = `<h4>${escapeHtml(group.category)}</h4><div class="tag-cloud">${tags}</div>`;
      skillCategories.appendChild(card);
    });

    const timeline = document.getElementById('experienceTimeline');
    timeline.innerHTML = '';
    (data.experiences || []).forEach((item) => {
      const row = create('article', 'timeline-item reveal');
      const bullets = (item.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('');
      row.innerHTML = `
        <div class="timeline-date">${escapeHtml(item.period)}</div>
        <div class="timeline-content">
          <h3>${escapeHtml(item.role)}</h3>
          <p class="timeline-org">${escapeHtml(item.org)}</p>
          <ul>${bullets}</ul>
        </div>`;
      timeline.appendChild(row);
    });

    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    (data.education || []).forEach((item) => {
      const card = create('article', 'info-card reveal');
      card.innerHTML = `<span>${escapeHtml(item.period)}</span><h3>${escapeHtml(item.school)}</h3><p>${escapeHtml(item.degree)}</p><small>${escapeHtml(item.note)}</small>`;
      educationList.appendChild(card);
    });

    const certList = document.getElementById('certList');
    certList.innerHTML = '';
    (data.certifications || []).forEach((cert) => {
      if (typeof cert === 'string') {
        certList.appendChild(create('span', 'cert reveal', cert));
        return;
      }
      const card = create('article', 'cert-card reveal');
      const subtitle = cert.subtitle ? `<p>${escapeHtml(cert.subtitle)}</p>` : '';
      const img = cert.image ? `<img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)}">` : '';
      card.innerHTML = `${img}<div class="cert-body"><h3>${escapeHtml(cert.title)}</h3>${subtitle}</div>`;
      certList.appendChild(card);
    });

    const projectGrid = document.getElementById('projectGrid');
    projectGrid.innerHTML = '';
    (data.projects || []).forEach((project) => {
      const card = create('article', 'project-card reveal');
      card.innerHTML = `<span>${escapeHtml(project.period)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.text)}</p>`;
      projectGrid.appendChild(card);
    });

    renderContact(contact);
    text(document.getElementById('year'), new Date().getFullYear());
    observeReveal();
  }

  function renderContact(contact) {
    const email = String(contact.email || '').trim();
    const subject = String(contact.subject || '').trim();
    const body = String(contact.body || '').trim();
    const mailto = buildMailto(email, subject, body);

    const emailText = document.getElementById('contactEmailText');
    const contactBtn = document.getElementById('contactEmailBtn');
    const navEmail = document.getElementById('navEmailLink');

    if (email) {
      text(emailText, `E-mail：${email}`);
      if (contactBtn) {
        contactBtn.href = mailto;
        contactBtn.textContent = contact.buttonText || 'E-mail 聯絡';
      }
      if (navEmail) {
        navEmail.href = mailto;
        navEmail.textContent = contact.navText || 'E-mail 聯絡';
      }
    } else {
      text(emailText, '請於 assets/js/data.js 設定 contact.email。');
      if (contactBtn) contactBtn.href = '#contact';
      if (navEmail) navEmail.href = '#contact';
    }
  }

  function buildMailto(email, subject, body) {
    if (!email) return '#contact';
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${encodeURIComponent(email)}${params.length ? '?' + params.join('&') : ''}`;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function observeReveal() {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  document.querySelector('.nav-toggle')?.addEventListener('click', function () {
    const menu = document.getElementById('navMenu');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });

  render();
})();
