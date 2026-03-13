const CONTACT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwhIuF98PNLHBp1TkV05hxxpyHBPOb8-oP0G92zClyn2KTrSafrU1Pr7VPWT3aabHEa/exec';

function submitContactToSheet(role, name, email, message) {
    const payload = new URLSearchParams();
    payload.append('role', role);
    payload.append('name', name);
    payload.append('email', email);
    payload.append('message', message);

    return fetch(CONTACT_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
    });
}

function setContactLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Sending...' : 'Send Message';
}

function showContactSubmitError(form, message) {
    let errEl = form.querySelector('.form-submit-error');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-submit-error';
        form.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
}

function hideContactSubmitError(form) {
    const errEl = form.querySelector('.form-submit-error');
    if (errEl) errEl.style.display = 'none';
}

function revealContactSuccess() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('contactSuccess');
    if (!form || !success) return;

    form.reset();

    form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-8px)';

    setTimeout(() => {
        form.hidden = true;
        form.style.opacity = '';
        form.style.transform = '';
        success.hidden = false;
        success.style.animation = 'none';
        void success.offsetWidth;
        success.style.animation = '';
    }, 300);
}

function getContactFieldError(field) {
    const value = field.value.trim();
    const id = field.id;

    if (!value) return 'This field is required.';

    if (id === 'ct-role') {
        if (value.length < 2) return 'Please describe how you identify (e.g. Patient, Doctor).';
    }

    if (id === 'ct-name') {
        if (value.length < 2) return 'Name must be at least 2 characters.';
        if (!/^[\p{L}\s'-]+$/u.test(value)) return 'Name can only contain letters.';
    }

    if (id === 'ct-email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
            return 'Enter a valid email address (e.g. you@example.com).';
    }

    if (id === 'ct-message') {
        if (value.length < 10) return 'Message must be at least 10 characters.';
    }

    return null;
}

function setContactFieldError(field, message) {
    field.style.borderColor = '#FF6B81';
    field.style.boxShadow = '0 0 0 3px rgba(255, 107, 129, 0.15)';

    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        field.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
}

function clearContactFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    const errEl = field.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
}

function validateContactField(field) {
    const error = getContactFieldError(field);
    if (error) { setContactFieldError(field, error); return false; }
    clearContactFieldError(field);
    return true;
}

function validateContactForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let allValid = true;
    fields.forEach(field => {
        if (!validateContactField(field)) allValid = false;
    });
    return allValid;
}

function initContactWaitlist() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => clearContactFieldError(field));
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!validateContactForm(form)) return;
        hideContactSubmitError(form);

        const role = form.querySelector('#ct-role').value.trim();
        const name = form.querySelector('#ct-name').value.trim();
        const email = form.querySelector('#ct-email').value.trim();
        const message = form.querySelector('#ct-message').value.trim();

        setContactLoading(submitBtn, true);

        try {
            await submitContactToSheet(role, name, email, message);
            revealContactSuccess();
        } catch (err) {
            showContactSubmitError(form, 'Something went wrong. Please try again.');
            setContactLoading(submitBtn, false);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactWaitlist);
} else {
    initContactWaitlist();
}