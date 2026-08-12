(() => {
  const city = new URLSearchParams(window.location.search).get('city')?.trim();
  const target = new URL('index.html', window.location.href);
  if (city) target.searchParams.set('city', city);
  window.location.replace(target);
})();
