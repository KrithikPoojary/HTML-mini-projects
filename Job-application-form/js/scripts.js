// ==========================================================================
// Job Application Form — behavior
// Note: the HTML has two inputs sharing id="name" (first/last name).
// That's invalid HTML, so getElementById only returns the first one —
// querySelectorAll('[id="name"]') is used instead to reliably grab both.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInputs = document.querySelectorAll('[id="name"]'); // [firstName, lastName]
    const phoneInput = document.getElementById('phn');
    const coverLetter = document.getElementById('type');
    const resumeInput = document.getElementById('resume');
    const docInput = document.getElementById('doc');
    const interviewDate = document.getElementById('interview');
    const dobInput = document.getElementById('dob');

    injectSuccessBanner(form);
    restrictPhoneToDigits(phoneInput);
    addCharCounter(coverLetter, 500);
    addFilePreview(resumeInput);
    addFilePreview(docInput);
    enforceDateBounds(dobInput, interviewDate);
    liveValidateOnBlur(form);
    handleSubmit(form);
});

// Adds a hidden banner element right above the form, used to confirm submission
function injectSuccessBanner(form) {
    const banner = document.createElement('div');
    banner.className = 'success-banner';
    banner.id = 'success-banner';
    banner.textContent = 'Application received. We will contact you to confirm your interview slot.';
    form.parentNode.insertBefore(banner, form);
}

// Keeps the phone field numeric-only and capped at 10 digits
function restrictPhoneToDigits(phoneInput) {
    if (!phoneInput) return;
    phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    });
}

// Live character counter under the cover letter textarea
function addCharCounter(textarea, limit) {
    if (!textarea) return;
    const counter = document.createElement('small');
    counter.className = 'char-count';
    textarea.insertAdjacentElement('afterend', counter);

    const update = () => {
        const remaining = limit - textarea.value.length;
        counter.textContent = `${textarea.value.length} / ${limit} characters`;
        counter.style.color = remaining < 0 ? '#B3432B' : '#8A968F';
    };
    textarea.addEventListener('input', update);
    update();
}

// Shows the chosen file name under a file input
function addFilePreview(fileInput) {
    if (!fileInput) return;
    const preview = document.createElement('span');
    preview.className = 'file-chosen';
    fileInput.insertAdjacentElement('afterend', preview);

    fileInput.addEventListener('change', () => {
        preview.textContent = fileInput.files.length
            ? `Selected: ${fileInput.files[0].name}`
            : '';
    });
}

// Date of birth can't be in the future; interview date can't be in the past
function enforceDateBounds(dobInput, interviewInput) {
    const today = new Date().toISOString().split('T')[0];
    if (dobInput) dobInput.max = today;
    if (interviewInput) interviewInput.min = today;
}

// Adds an inline error message under a field the first time it's invalid,
// and marks it "touched" so the CSS :invalid.touched styling applies
function liveValidateOnBlur(form) {
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach((field) => {
        field.addEventListener('blur', () => {
            field.classList.add('touched');
            showOrClearError(field);
        });
        field.addEventListener('input', () => {
            if (field.classList.contains('touched')) showOrClearError(field);
        });
    });
}

function showOrClearError(field) {
    let msg = field.parentNode.querySelector(`.field-error[data-for="${field.id}"]`);

    if (!field.checkValidity()) {
        if (!msg) {
            msg = document.createElement('small');
            msg.className = 'field-error';
            msg.setAttribute('data-for', field.id);
            field.insertAdjacentElement('afterend', msg);
        }
        msg.textContent = fieldErrorMessage(field);
    } else if (msg) {
        msg.remove();
    }
}

function fieldErrorMessage(field) {
    if (field.validity.valueMissing) return 'This field is required.';
    if (field.validity.typeMismatch && field.type === 'email') return 'Enter a valid email address.';
    if (field.type === 'tel' && field.value.length > 0 && field.value.length < 10) {
        return 'Enter a 10-digit mobile number.';
    }
    return 'Please check this field.';
}

// Validates on submit and, since the form's action is a placeholder ("/none"),
// prevents the actual navigation and shows a success confirmation instead
function handleSubmit(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fields = form.querySelectorAll('input, textarea');
        let firstInvalid = null;

        fields.forEach((field) => {
            field.classList.add('touched');
            showOrClearError(field);
            if (!field.checkValidity() && !firstInvalid) firstInvalid = field;
        });

        const phone = document.getElementById('phn');
        if (phone && phone.value.length !== 10) {
            firstInvalid = firstInvalid || phone;
        }

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const banner = document.getElementById('success-banner');
        banner.classList.add('visible');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.reset();
        form.querySelectorAll('.file-chosen').forEach((el) => (el.textContent = ''));
        form.querySelectorAll('.field-error').forEach((el) => el.remove());
        form.querySelectorAll('.touched').forEach((el) => el.classList.remove('touched'));
    });
}