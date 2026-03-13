const PATIENT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzk7-WtOQPP69nMElZxVhv9fLBJqWnw6MKrjmhXjkzBbLPpXSHl1lhWilNMt06hKxvvJw/exec';

function submitPatientToSheet(name, phone) {
    const payload = new URLSearchParams();
    payload.append('name', name);
    payload.append('phone', phone);

    return fetch(PATIENT_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
    });
}

function setPatientLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Saving...' : 'Reserve My Spot';
}

function showPatientSubmitError(form, message) {
    let errEl = form.querySelector('.form-submit-error');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-submit-error';
        form.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
}

function hidePatientSubmitError(form) {
    const errEl = form.querySelector('.form-submit-error');
    if (errEl) errEl.style.display = 'none';
}

function revealPatientSuccess() {
    const form = document.getElementById('patientForm');
    const success = document.getElementById('patientSuccess');
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

function getPatientFieldError(input) {
    const value = input.value.trim();
    const id = input.id;

    if (!value) return 'This field is required.';

    if (id === 'p-name') {
        if (value.length < 2) return 'Name must be at least 2 characters.';
        if (!/^[\p{L}\s'-]+$/u.test(value)) return 'Name can only contain letters.';
    }

    if (id === 'p-phone') {
        const digits = value.replace(/[\s\-().+]/g, '');
        if (!/^(0[67]\d{8}|212[67]\d{8}|\+212[67]\d{8})$/.test(digits))
            return 'Enter a valid Moroccan number (e.g. 06XXXXXXXX or 07XXXXXXXX).';
    }

    return null;
}

function setPatientFieldError(input, message) {
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

function clearPatientFieldError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
}

function validatePatientField(input) {
    const error = getPatientFieldError(input);
    if (error) { setPatientFieldError(input, error); return false; }
    clearPatientFieldError(input);
    return true;
}

function validatePatientForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let allValid = true;
    inputs.forEach(input => {
        if (!validatePatientField(input)) allValid = false;
    });
    return allValid;
}

function initPatientWaitlist() {
    const form = document.getElementById('patientForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearPatientFieldError(input));
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!validatePatientForm(form)) return;
        hidePatientSubmitError(form);

        const name = form.querySelector('#p-name').value.trim();
        const phone = form.querySelector('#p-phone').value.trim();

        setPatientLoading(submitBtn, true);

        try {
            await submitPatientToSheet(name, phone);
            revealPatientSuccess();
        } catch (err) {
            showPatientSubmitError(form, 'Something went wrong. Please try again.');
            setPatientLoading(submitBtn, false);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPatientWaitlist);
} else {
    initPatientWaitlist();
}