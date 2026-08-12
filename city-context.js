(() => {
  const city = new URLSearchParams(window.location.search).get('city')?.trim();
  if (!city) return;

  document.title = `Сибсети — интернет и телевидение в ${city}`;
  document.documentElement.lang = 'ru';

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `Домашний интернет и телевидение в ${city} — Сибсети`;

  const heroLead = document.querySelector('.hero__lead');
  if (heroLead) {
    heroLead.textContent = `Подключим надёжный интернет и ТВ в ${city}. Скорость до 750 Мбит/с, подключение — 0 ₽.`;
  }

  document.querySelectorAll('input[name="address"]').forEach(input => {
    const placeholder = input.getAttribute('placeholder');
    if (placeholder?.includes('Город')) input.placeholder = `${city}, улица, дом`;
  });

  document.querySelectorAll('form').forEach(form => {
    let field = form.querySelector('input[name="city"]');
    if (!field) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = 'city';
      form.append(field);
    }
    field.value = city;
  });
})();
