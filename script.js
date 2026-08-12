const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modal-title');
const toast = document.querySelector('.toast');

function getCurrentCity() {
  return document.body.dataset.cityName?.trim()
    || localStorage.getItem('sibseti-city')
    || document.querySelector('[data-current-city]')?.textContent.trim()
    || 'Новосибирск';
}

function setModalCity() {
  const cityField = modal.querySelector('input[name="city"]');
  if (cityField) cityField.value = getCurrentCity();
}

function openModal(button) {
  const tariff = button.dataset.tariffPayload ? JSON.parse(button.dataset.tariffPayload) : null;
  modalTitle.textContent = button.dataset.tariff ? `Тариф «${button.dataset.tariff}»` : 'Заказать звонок';
  setModalCity();
  let input = modal.querySelector('input[name="tariff_data"]');
  if (!input) { input = document.createElement('input'); input.type = 'hidden'; input.name = 'tariff_data'; modal.querySelector('[data-form]')?.append(input); }
  input.value = tariff ? JSON.stringify(tariff) : '';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
document.addEventListener('click', event => { const button = event.target.closest('[data-modal]'); if (button) openModal(button); });

function closeModal() { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelector('.modal__close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.querySelectorAll('[data-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) return form.reportValidity();
  form.reset(); closeModal();
  toast.textContent = 'Спасибо! Заявка принята.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}));

document.querySelectorAll('[data-availability-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) return form.reportValidity();
  form.reset();
  toast.textContent = 'Адрес принят — скоро сообщим о возможности подключения.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}));

document.querySelectorAll('input[name="phone"]').forEach(input => input.addEventListener('input', () => {
  let digits = input.value.replace(/\D/g, '');
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits && digits[0] !== '7') digits = `7${digits}`;
  const part = digits.slice(1, 11); let value = '+7';
  if (part.length) value += ` (${part.slice(0, 3)}`;
  if (part.length >= 3) value += ')'; if (part.length > 3) value += ` ${part.slice(3, 6)}`;
  if (part.length > 6) value += `-${part.slice(6, 8)}`; if (part.length > 8) value += `-${part.slice(8, 10)}`;
  input.value = value;
}));
