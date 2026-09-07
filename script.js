/* =========================================================
   ZENITH LEARNING ACADEMY — SCRIPT
   1. Dynamic rotating headline word in the hero
   2. Mobile nav toggle
   3. Inquiry form validation (Full Name, Mobile, Inquiry Type, Message)
   4. On submit: build a formatted WhatsApp message and redirect
   (The "Call Now" button needs no JS — it's a plain tel: link in the HTML)
   ========================================================= */

const WHATSAPP_NUMBER = '918639641523'; // country code + number, no "+" or spaces

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Dynamic headline text ---------- */
  // Rotates the highlighted phrase in the hero heading every few seconds
  const dynamicPhrases = [
    'JEE Main & Advanced',
    'NEET aspirants',
    'Class 9–10 Foundation',
    'Board exam toppers',
  ];
  const dynamicWordEl = document.getElementById('dynamicWord');
  let phraseIndex = 0;

  setInterval(() => {
    phraseIndex = (phraseIndex + 1) % dynamicPhrases.length;

    // Fade out, swap text, fade back in — a small, deliberate transition
    dynamicWordEl.style.opacity = '0';
    setTimeout(() => {
      dynamicWordEl.textContent = dynamicPhrases[phraseIndex];
      dynamicWordEl.style.opacity = '1';
    }, 250);
  }, 3200);

  /* ---------- 2. Mobile nav toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3 & 4. Inquiry form validation + WhatsApp redirect ---------- */
  const form = document.getElementById('inquiryForm');

  const fields = {
    fullName: document.getElementById('fullName'),
    mobile: document.getElementById('mobile'),
    inquiryType: document.getElementById('inquiryType'),
    message: document.getElementById('message'),
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    mobile: document.getElementById('mobileError'),
    inquiryType: document.getElementById('inquiryTypeError'),
    message: document.getElementById('messageError'),
  };

  function isEmpty(value) {
    return value.trim().length === 0;
  }

  function isValidMobile(value) {
    // Accepts a 10-digit Indian mobile number, optionally prefixed with +91 / 91 / 0
    const digitsOnly = value.replace(/[\s-]/g, '');
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(digitsOnly);
  }

  function setFieldError(field, msg) {
    fields[field].classList.add('field-invalid');
    errors[field].textContent = msg;
  }

  function clearFieldError(field) {
    fields[field].classList.remove('field-invalid');
    errors[field].textContent = '';
  }

  function validateField(field) {
    const value = fields[field].value;

    if (field === 'fullName' && isEmpty(value)) {
      setFieldError(field, 'Please enter a full name.');
      return false;
    }
    if (field === 'mobile' && (isEmpty(value) || !isValidMobile(value))) {
      setFieldError(field, 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (field === 'inquiryType' && isEmpty(value)) {
      setFieldError(field, 'Please select an inquiry type.');
      return false;
    }
    if (field === 'message' && isEmpty(value)) {
      setFieldError(field, 'Please add a short message.');
      return false;
    }

    clearFieldError(field);
    return true;
  }

  Object.keys(fields).forEach((field) => {
    const eventName = field === 'inquiryType' ? 'change' : 'blur';
    fields[field].addEventListener(eventName, () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    // Prevent the default form submission before anything else
    event.preventDefault();

    const results = Object.keys(fields).map((field) => validateField(field));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      const firstInvalid = Object.keys(fields).find((field) => !validateField(field));
      if (firstInvalid) fields[firstInvalid].focus();
      return;
    }

    // Extract the submitted details
    const fullName = fields.fullName.value.trim();
    const mobile = fields.mobile.value.trim();
    const inquiryType = fields.inquiryType.value;
    const message = fields.message.value.trim();

    // Build a formatted message from the submitted details
    const whatsappText =
      `Hi Zenith Learning Academy, I have an inquiry.\n\n` +
      `Name: ${fullName}\n` +
      `Mobile: ${mobile}\n` +
      `Inquiry type: ${inquiryType}\n` +
      `Message: ${message}`;

    // Encode the message and redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
    window.location.href = whatsappUrl;
  });
});
