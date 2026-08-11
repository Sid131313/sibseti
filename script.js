const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modal-title');
const toast = document.querySelector('.toast');

document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  modalTitle.textContent = button.dataset.tariff ? `Тариф «${button.dataset.tariff}»` : 'Заказать звонок';
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}));

function closeModal() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }
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
