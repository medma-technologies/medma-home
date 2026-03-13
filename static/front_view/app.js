const NAV_SCROLL_THRESHOLD = 20;

function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
        if (window.scrollY > NAV_SCROLL_THRESHOLD) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('navMobile');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const navHeight = document.getElementById('nav')?.offsetHeight ?? 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
}

function initSmoothScrollLinks() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            smoothScrollTo(el.dataset.scroll);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.dataset.scroll) return;
        anchor.addEventListener('click', e => {
            const hash = anchor.getAttribute('href').slice(1);
            if (!hash) return;
            e.preventDefault();
            smoothScrollTo(hash);
        });
    });
}

function initScrollReveal() {
    const revealTargets = [
        { selector: '.about__col', delay: 0 },
        { selector: '.join-card', delay: 0 },
        { selector: '.mission__inner', delay: 0 },
        { selector: '.contact__inner', delay: 0 },
    ];

    const elements = [];

    revealTargets.forEach(({ selector, delay }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            if (i === 1) el.classList.add('reveal-delay-2');
            elements.push(el);
        });
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

function init() {
    initNavScroll();
    initMobileNav();
    initSmoothScrollLinks();
    initScrollReveal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}