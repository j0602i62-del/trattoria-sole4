/**
 * Trattoria SOLE - Reservation Form Logic & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  const dateInput = document.getElementById('resDate');
  const timeSelect = document.getElementById('resTime');
  const courseSelect = document.getElementById('resCourse');
  const peopleSelect = document.getElementById('resPeople');
  const nameInput = document.getElementById('resName');
  const telInput = document.getElementById('resTel');
  const emailInput = document.getElementById('resEmail');
  const modal = document.getElementById('resSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSummary = document.getElementById('modalSummary');

  // Set min/max date on datepicker (Tomorrow to 60 days ahead)
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 60);

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    dateInput.min = formatDate(tomorrow);
    dateInput.max = formatDate(maxDate);
  }

  // Course & Time slot synchronization assistance
  if (courseSelect && timeSelect) {
    courseSelect.addEventListener('change', () => {
      const selectedCourse = courseSelect.value;
      const currentTime = timeSelect.value;

      // If Lunch Course is selected and a dinner time was picked, guide the user
      if (selectedCourse === 'ランチコース（¥3,800）') {
        const dinnerTimes = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
        if (dinnerTimes.includes(currentTime)) {
          timeSelect.value = '12:00';
        }
      } else if (selectedCourse === 'ディナーコース（¥8,500）' || selectedCourse === '記念日コース（¥12,000）') {
        const lunchTimes = ['11:30', '12:00', '12:30', '13:00', '13:30'];
        if (lunchTimes.includes(currentTime)) {
          timeSelect.value = '18:30';
        }
      }
    });
  }

  // Validation functions
  const validateName = (val) => val.trim().length >= 2;
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validateTel = (val) => /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/.test(val.trim().replace(/\s+/g, ''));
  const validateRequired = (val) => val.trim() !== '';

  const setFieldState = (input, isValid, errorMsg = '') => {
    const parent = input.closest('.form-group');
    const feedback = parent ? parent.querySelector('.invalid-feedback') : null;

    if (isValid) {
      input.classList.remove('is-invalid');
      if (feedback) feedback.textContent = '';
    } else {
      input.classList.add('is-invalid');
      if (feedback && errorMsg) feedback.textContent = errorMsg;
    }
  };

  // Realtime blur validation
  nameInput?.addEventListener('blur', () => {
    const isValid = validateName(nameInput.value);
    setFieldState(nameInput, isValid, 'お名前を正しくご入力ください（2文字以上）');
  });

  telInput?.addEventListener('blur', () => {
    const isValid = validateTel(telInput.value);
    setFieldState(telInput, isValid, '有効なお電話番号を入力してください（例: 03-5790-8822）');
  });

  emailInput?.addEventListener('blur', () => {
    const isValid = validateEmail(emailInput.value);
    setFieldState(emailInput, isValid, '正しいメールアドレスの形式でご入力ください');
  });

  dateInput?.addEventListener('change', () => {
    const isValid = validateRequired(dateInput.value);
    setFieldState(dateInput, isValid, 'ご希望日を選択してください');
  });

  timeSelect?.addEventListener('change', () => {
    const isValid = validateRequired(timeSelect.value);
    setFieldState(timeSelect, isValid, 'ご希望の時間帯を選択してください');
  });

  courseSelect?.addEventListener('change', () => {
    const isValid = validateRequired(courseSelect.value);
    setFieldState(courseSelect, isValid, 'コースを選択してください');
  });

  peopleSelect?.addEventListener('change', () => {
    const isValid = validateRequired(peopleSelect.value);
    setFieldState(peopleSelect, isValid, 'ご利用人数を選択してください');
  });

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate Date
    if (!validateRequired(dateInput.value)) {
      setFieldState(dateInput, false, 'ご希望日を選択してください');
      isFormValid = false;
    } else {
      setFieldState(dateInput, true);
    }

    // Validate Time
    if (!validateRequired(timeSelect.value)) {
      setFieldState(timeSelect, false, 'ご希望の時間帯を選択してください');
      isFormValid = false;
    } else {
      setFieldState(timeSelect, true);
    }

    // Validate People
    if (!validateRequired(peopleSelect.value)) {
      setFieldState(peopleSelect, false, 'ご利用人数を選択してください');
      isFormValid = false;
    } else {
      setFieldState(peopleSelect, true);
    }

    // Validate Course
    if (!validateRequired(courseSelect.value)) {
      setFieldState(courseSelect, false, 'コースを選択してください');
      isFormValid = false;
    } else {
      setFieldState(courseSelect, true);
    }

    // Validate Name
    if (!validateName(nameInput.value)) {
      setFieldState(nameInput, false, 'お名前を正しくご入力ください');
      isFormValid = false;
    } else {
      setFieldState(nameInput, true);
    }

    // Validate Tel
    if (!validateTel(telInput.value)) {
      setFieldState(telInput, false, '有効なお電話番号を入力してください（例: 03-5790-8822）');
      isFormValid = false;
    } else {
      setFieldState(telInput, true);
    }

    // Validate Email
    if (!validateEmail(emailInput.value)) {
      setFieldState(emailInput, false, '正しいメールアドレスをご入力ください');
      isFormValid = false;
    } else {
      setFieldState(emailInput, true);
    }

    if (!isFormValid) {
      // Scroll to first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Simulate sending with loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '送信中...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Populate confirmation summary
      const requestText = document.getElementById('resRequests')?.value.trim() || '特になし';
      if (modalSummary) {
        modalSummary.innerHTML = `
          <p><strong>ご予約日時：</strong> ${dateInput.value} ${timeSelect.value}〜</p>
          <p><strong>人数：</strong> ${peopleSelect.value}</p>
          <p><strong>コース：</strong> ${courseSelect.value}</p>
          <p><strong>お名前：</strong> ${nameInput.value} 様</p>
          <p><strong>お電話番号：</strong> ${telInput.value}</p>
          <p><strong>メールアドレス：</strong> ${emailInput.value}</p>
          <p><strong>アレルギー・ご要望：</strong> ${requestText}</p>
        `;
      }

      // Open Modal
      modal?.classList.add('is-open');
      form.reset();
    }, 700);
  });

  // Modal close
  modalCloseBtn?.addEventListener('click', () => {
    modal?.classList.remove('is-open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
    }
  });
});
