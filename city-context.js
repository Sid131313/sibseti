(() => {
  const city = document.body.dataset.cityName?.trim();
  if (!city) return;

  document.querySelectorAll('input[name="address"]').forEach(input => {
    const placeholder = input.getAttribute('placeholder');
    if (placeholder?.includes('Город')) input.placeholder = `${city}, улица, дом`;
  });

  document.querySelectorAll('[data-city-field]').forEach(field => {
    field.value = city;
  });
})();
