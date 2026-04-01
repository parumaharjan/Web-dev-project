// ===== CONTACT FORM =====

const MAX_CHARS = 500;

// Run when page is ready
document.addEventListener('DOMContentLoaded', function () {

  // Character counter for the message field
  const messageInput = document.getElementById('message');
  const charCurrent  = document.getElementById('char-current');
  const charCounter  = document.querySelector('.char-counter');

  if (messageInput) {
    messageInput.addEventListener('input', function () {
      const count = messageInput.value.length;
      charCurrent.textContent = count;

      if (count > MAX_CHARS) {
        charCounter.classList.add('over-limit');
      } else {
        charCounter.classList.remove('over-limit');
      }
    });
  }

  // Handle form submission
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the page from refreshing
      if (validateForm()) {
        showSuccess();
      }
    });
  }

  // Clear error on each field when the user starts typing
  const fields = ['first-name', 'last-name', 'email', 'subject', 'message'];
  fields.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        clearFieldError(id);
        el.classList.remove('is-error');
      });
    }
  });

  const agreeCheckbox = document.getElementById('agree');
  if (agreeCheckbox) {
    agreeCheckbox.addEventListener('change', function () {
      clearFieldError('agree');
      document.querySelector('.checkbox-box').classList.remove('is-error');
    });
  }

});

// ===== VALIDATION =====

function validateForm() {
  let isValid = true;

  // First Name
  const firstName = document.getElementById('first-name').value.trim();
  if (firstName === '') {
    showFieldError('first-name', 'Please enter your first name.');
    isValid = false;
  }

  // Last Name
  const lastName = document.getElementById('last-name').value.trim();
  if (lastName === '') {
    showFieldError('last-name', 'Please enter your last name.');
    isValid = false;
  }

  // Email
  const email = document.getElementById('email').value.trim();
  if (email === '') {
    showFieldError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  // Subject
  const subject = document.getElementById('subject').value;
  if (subject === '') {
    showFieldError('subject', 'Please choose a subject.');
    isValid = false;
  }

  // Message
  const message = document.getElementById('message').value.trim();
  if (message === '') {
    showFieldError('message', 'Please write a message.');
    isValid = false;
  } else if (message.length > MAX_CHARS) {
    showFieldError('message', 'Message is too long (max ' + MAX_CHARS + ' characters).');
    isValid = false;
  }

  // Checkbox
  const agree = document.getElementById('agree').checked;
  if (!agree) {
    showFieldError('agree', 'Please check this box to continue.');
    document.querySelector('.checkbox-box').classList.add('is-error');
    isValid = false;
  }

  return isValid;
}

// ===== HELPERS =====

// Basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show a red error message under a field
function showFieldError(fieldId, message) {
  const errorEl = document.getElementById('error-' + fieldId);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('is-error');
}

// Remove the error message under a field
function clearFieldError(fieldId) {
  const errorEl = document.getElementById('error-' + fieldId);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) errorEl.textContent = '';
  if (inputEl) inputEl.classList.remove('is-error');
}

// Hide the form and show the success message
function showSuccess() {
  document.getElementById('contact-form').style.display  = 'none';
  document.getElementById('form-success').style.display  = 'block';
}

// Reset everything back to the empty form
function resetForm() {
  const form = document.getElementById('contact-form');
  form.reset();

  // Clear all error messages
  document.querySelectorAll('.field-error').forEach(function (el) {
    el.textContent = '';
  });
  document.querySelectorAll('.form-input').forEach(function (el) {
    el.classList.remove('is-error', 'is-valid');
  });
  document.querySelector('.checkbox-box').classList.remove('is-error');

  // Reset character counter
  document.getElementById('char-current').textContent = '0';
  document.querySelector('.char-counter').classList.remove('over-limit');

  // Show form, hide success
  form.style.display = 'flex';
  document.getElementById('form-success').style.display = 'none';
}
