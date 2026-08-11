(() => {
  const city = new URLSearchParams(window.location.search).get('city')?.trim() || 'Новосибирск';
  const title = document.querySelector('[data-city-title]');
  const description = document.querySelector('[data-city-description]');

  if (title) title.textContent = `Интернет и телевидение для дома — ${city}`;
  if (description) description.textContent = `Проверим возможность подключения в городе ${city}, подберём тариф и свяжемся с вами в удобное время.`;
  document.title = `Сибсети — подключение в ${city}`;
})();
