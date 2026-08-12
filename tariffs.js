(() => {
  const slug = location.pathname.split('/').filter(Boolean)[0] || 'novosibirsk';
  const grids = { internet: document.querySelector('#internet .tariff-grid'), internet_tv: document.querySelector('#tv .tariff-grid') };
  const power = '<svg class="button__power" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8M6.4 5.9a8 8 0 1 0 11.2 0" /></svg>';
  const format = value => new Intl.NumberFormat('ru-RU').format(value);
  const create = (tariff, index) => {
    const card = document.createElement('article'); card.className = `tariff-card${tariff.badge ? ' tariff-card--featured' : ''}`;
    if (tariff.badge) { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = tariff.badge; card.append(tag); }
    const name = document.createElement('p'); name.className = 'tariff-card__name'; name.textContent = tariff.name; card.append(name);
    const speed = document.createElement('div'); speed.className = 'speed'; speed.innerHTML = `<b>${tariff.speed ?? '—'}</b><span>Мбит/с</span>`; card.append(speed);
    const list = document.createElement('ul');
    const features = [...(tariff.features || [])]; if (tariff.tv_channels) features.push(`${tariff.tv_channels} ТВ-каналов`); if (tariff.router) features.push(tariff.router); if (tariff.connection_price !== null && tariff.connection_price !== undefined) features.push(`Подключение ${format(tariff.connection_price)} ₽`); features.forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); }); card.append(list);
    const price = document.createElement('div'); price.className = 'price'; price.innerHTML = `<b>${format(tariff.price)} ₽</b><span>/ месяц</span>`; card.append(price);
    const button = document.createElement('button'); button.type = 'button'; button.className = `button ${tariff.badge || index === 1 ? 'button--lime' : 'button--outline'}`; button.dataset.modal = 'tariff'; button.dataset.tariff = tariff.name; button.dataset.tariffId = tariff.id; button.dataset.tariffPayload = JSON.stringify({ id: tariff.id, city: tariff.city, name: tariff.name, price: tariff.price, category: tariff.category, speed: tariff.speed, router: tariff.router || '' }); button.innerHTML = `Подключить ${power}`; card.append(button); return card;
  };
  // Generated city pages contain a home-page HTML fallback for SEO. Hide it before data arrives,
  // so a failed local request never exposes Novosibirsk tariffs on another city's URL.
  if (slug !== 'novosibirsk') Object.values(grids).forEach(grid => grid?.closest('.tariffs')?.setAttribute('hidden', ''));
  fetch(`/data/tariffs/${encodeURIComponent(slug)}.json`, { cache: 'no-cache' }).then(response => response.ok ? response.json() : Promise.reject()).then(tariffs => {
    const grouped = { internet: [], internet_tv: [] }; tariffs.filter(tariff => tariff.active !== false && grouped[tariff.category]).forEach(tariff => grouped[tariff.category].push(tariff));
    Object.entries(grids).forEach(([category, grid]) => { if (!grid || !grouped[category].length) { grid?.closest('.tariffs')?.setAttribute('hidden', ''); return; } grid.closest('.tariffs')?.removeAttribute('hidden'); grid.replaceChildren(...grouped[category].map(create)); });
  }).catch(() => {
    // Only the home page has a static Novosibirsk fallback. A city page must never show another city's tariffs.
    if (slug !== 'novosibirsk') Object.values(grids).forEach(grid => grid?.closest('.tariffs')?.setAttribute('hidden', ''));
  });
})();
