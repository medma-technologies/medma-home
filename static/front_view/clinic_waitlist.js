const CLINIC_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzflSKv6ePLFPA1kVrMmNaFydBD-mxmUBPr9_husayZVsYvx0hnfbiUfZyUtPhMjMxZ/exec';

function submitClinicToSheet(doctorName, specialty, city, phone) {
    const payload = new URLSearchParams();
    payload.append('doctorName', doctorName);
    payload.append('specialty', specialty);
    payload.append('city', city);
    payload.append('phone', phone);

    return fetch(CLINIC_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
    });
}

function setClinicLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Saving...' : 'Partner With Medma';
}

function showClinicSubmitError(form, message) {
    let errEl = form.querySelector('.form-submit-error');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-submit-error';
        form.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
}

function hideClinicSubmitError(form) {
    const errEl = form.querySelector('.form-submit-error');
    if (errEl) errEl.style.display = 'none';
}

function revealClinicSuccess() {
    const form = document.getElementById('clinicForm');
    const success = document.getElementById('clinicSuccess');
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

function getClinicFieldError(input) {
    const value = input.value.trim();
    const id = input.id;

    if (!value) return 'This field is required.';

    if (id === 'c-name') {
        if (value.length < 2) return 'Name must be at least 2 characters.';
        if (!/^[\p{L}\s'.'-]+$/u.test(value)) return 'Name can only contain letters.';
    }

    if (id === 'c-specialty') {
        if (value.length < 2) return 'Specialty must be at least 2 characters.';
    }

    if (id === 'c-city') {
        if (value.length < 2) return 'City must be at least 2 characters.';
        if (!/^[\p{L}\s'-]+$/u.test(value)) return 'City can only contain letters.';
    }

    if (id === 'c-phone') {
        const digits = value.replace(/[\s\-().+]/g, '');
        if (!/^(0[67]\d{8}|212[67]\d{8}|\+212[67]\d{8})$/.test(digits))
            return 'Enter a valid Moroccan number (e.g. 06XXXXXXXX or 07XXXXXXXX).';
    }

    return null;
}

function setClinicFieldError(input, message) {
    input.style.borderColor = '#FF6B81';
    input.style.boxShadow = '0 0 0 3px rgba(255, 107, 129, 0.15)';

    let errEl = input.parentElement.querySelector('.field-error');
    if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        input.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
}

function clearClinicFieldError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
}

function validateClinicField(input) {
    const error = getClinicFieldError(input);
    if (error) { setClinicFieldError(input, error); return false; }
    clearClinicFieldError(input);
    return true;
}

function validateClinicForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let allValid = true;
    inputs.forEach(input => {
        if (!validateClinicField(input)) allValid = false;
    });
    return allValid;
}

function initClinicWaitlist() {
    const form = document.getElementById('clinicForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearClinicFieldError(input));
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!validateClinicForm(form)) return;
        hideClinicSubmitError(form);

        const doctorName = form.querySelector('#c-name').value.trim();
        const specialty = form.querySelector('#c-specialty').value.trim();
        const city = form.querySelector('#c-city').value.trim();
        const phone = form.querySelector('#c-phone').value.trim();

        setClinicLoading(submitBtn, true);

        try {
            await submitClinicToSheet(doctorName, specialty, city, phone);
            revealClinicSuccess();
        } catch (err) {
            showClinicSubmitError(form, 'Something went wrong. Please try again.');
            setClinicLoading(submitBtn, false);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClinicWaitlist);
} else {
    initClinicWaitlist();
}