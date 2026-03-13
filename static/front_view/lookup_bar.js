const SEARCH_INDEX = [
    {
        id: 'hero',
        title: 'Home',
        desc: 'Stop Waiting. Start Healing.',
        keywords: ['home', 'hero', 'headline', 'healing', 'waiting', 'medma'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    },
    {
        id: 'about',
        title: 'The Problem',
        desc: 'Crowded waiting rooms and inefficient booking.',
        keywords: ['problem', 'waiting room', 'booking', 'crowded', 'chaos', 'queue', 'about'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    },
    {
        id: 'about',
        title: 'The Solution',
        desc: 'Smart queue management and remote follow-ups.',
        keywords: ['solution', 'smart', 'queue', 'management', 'remote', 'follow-up', 'dashboard', 'sms'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    },
    {
        id: 'mission',
        title: 'Our Mission',
        desc: 'Bringing calm to local clinics.',
        keywords: ['mission', 'calm', 'clinics', 'patients', 'time', 'care', 'values'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    },
    {
        id: 'join',
        title: 'Patient Waitlist',
        desc: 'Get early access — reserve your spot.',
        keywords: ['patient', 'waitlist', 'join', 'early access', 'reserve', 'spot', 'sign up'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    },
    {
        id: 'join',
        title: 'Clinic Waitlist',
        desc: 'Partner with Medma and modernize your practice.',
        keywords: ['clinic', 'doctor', 'partner', 'waitlist', 'specialty', 'practice', 'join'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12z"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    },
    {
        id: 'contact',
        title: 'Contact Us',
        desc: 'Get in touch — hello@medma.ma',
        keywords: ['contact', 'email', 'message', 'reach', 'hello', 'question', 'request'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    },
    {
        id: 'contact',
        title: 'Launch Cities',
        desc: 'Launching in Casablanca, Rabat, and beyond.',
        keywords: ['launch', 'casablanca', 'rabat', 'morocco', 'cities', 'soon', 'expand'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    },
];

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function scoreEntry(entry, query) {
    const q = query.toLowerCase().trim();
    if (!q) return 1;
    const titleMatch = entry.title.toLowerCase().includes(q);
    const descMatch = entry.desc.toLowerCase().includes(q);
    const keywordMatch = entry.keywords.some(k => k.includes(q));
    if (entry.title.toLowerCase().startsWith(q)) return 4;
    if (titleMatch) return 3;
    if (keywordMatch) return 2;
    if (descMatch) return 1;
    return 0;
}

function filterIndex(query) {
    if (!query.trim()) return SEARCH_INDEX;
    return SEARCH_INDEX
        .map(entry => ({ entry, score: scoreEntry(entry, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ entry }) => entry);
}

function buildResultItem(entry, query, index) {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.setAttribute('role', 'option');
    el.dataset.index = index;
    el.dataset.target = entry.id;
    el.innerHTML = `
    <div class="search-result__icon">${entry.icon}</div>
    <div class="search-result__body">
      <div class="search-result__title">${highlightMatch(entry.title, query)}</div>
      <div class="search-result__desc">${entry.desc}</div>
    </div>
    <div class="search-result__arrow">${ARROW_SVG}</div>
  `;
    return el;
}

function buildEmptyState(query) {
    const el = document.createElement('div');
    el.className = 'search-overlay__empty';
    el.innerHTML = `<strong>No results for "${query}"</strong>Try searching for a section name or topic.`;
    return el;
}

function LookupBar() {
    const overlay = document.getElementById('searchOverlay');
    const backdrop = document.getElementById('searchBackdrop');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const pill = document.getElementById('searchPill');
    const mobileTrigger = document.getElementById('searchMobile');

    if (!overlay || !input || !results) return;

    let activeIndex = -1;
    let currentItems = [];

    function getNavHeight() {
        const nav = document.getElementById('nav');
        return nav ? nav.offsetHeight : 72;
    }

    function scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - getNavHeight() - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    function open() {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            input.focus();
            input.select();
        });
        renderResults(input.value);
    }

    function close() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        activeIndex = -1;
    }

    function setActive(index) {
        currentItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        activeIndex = index;
        if (currentItems[index]) {
            currentItems[index].scrollIntoView({ block: 'nearest' });
        }
    }

    function navigateDown() {
        const next = activeIndex < currentItems.length - 1 ? activeIndex + 1 : 0;
        setActive(next);
    }

    function navigateUp() {
        const prev = activeIndex > 0 ? activeIndex - 1 : currentItems.length - 1;
        setActive(prev);
    }

    function confirmSelection() {
        if (activeIndex >= 0 && currentItems[activeIndex]) {
            const target = currentItems[activeIndex].dataset.target;
            close();
            setTimeout(() => scrollToSection(target), 120);
        } else if (currentItems.length > 0) {
            const target = currentItems[0].dataset.target;
            close();
            setTimeout(() => scrollToSection(target), 120);
        }
    }

    function renderResults(query) {
        results.innerHTML = '';
        activeIndex = -1;

        const filtered = filterIndex(query);

        if (filtered.length === 0 && query.trim()) {
            results.appendChild(buildEmptyState(query));
            currentItems = [];
            return;
        }

        currentItems = filtered.map((entry, i) => {
            const item = buildResultItem(entry, query, i);
            item.addEventListener('mouseenter', () => setActive(i));
            item.addEventListener('click', () => {
                close();
                setTimeout(() => scrollToSection(entry.id), 120);
            });
            results.appendChild(item);
            return item;
        });
    }

    input.addEventListener('input', () => renderResults(input.value));

    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); navigateDown(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); navigateUp(); }
        else if (e.key === 'Enter') { e.preventDefault(); confirmSelection(); }
        else if (e.key === 'Escape') { close(); }
    });

    backdrop.addEventListener('click', close);

    if (pill) pill.addEventListener('click', open);
    if (mobileTrigger) mobileTrigger.addEventListener('click', open);

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('open') ? close() : open();
        }
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            close();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', LookupBar);
} else {
    LookupBar();
}