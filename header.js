(() => {
  const header = document.querySelector('.header');
  const cityTrigger = document.querySelector('.city-trigger');
  const cityPanel = document.querySelector('#city-panel');
  const closeCity = document.querySelector('.city-panel__close');
  const menu = document.querySelector('.menu--new');
  const cityName = document.querySelector('[data-current-city]');

  if (!header || !cityTrigger || !cityPanel) return;

  const cityLinks = document.querySelectorAll('.city-panel a, .cities__list a');
  cityLinks.forEach(link => {
    const city = link.textContent.trim();
    link.href = `city.html?city=${encodeURIComponent(city)}`;
  });

  const setCityOpen = open => {
    header.classList.toggle('is-city-open', open);
    cityPanel.setAttribute('aria-hidden', String(!open));
    cityTrigger.setAttribute('aria-expanded', String(open));
    if (open) header.classList.remove('is-menu-open');
  };
  const setMenuOpen = open => {
    header.classList.toggle('is-menu-open', open);
    menu?.setAttribute('aria-expanded', String(open));
    if (open) setCityOpen(false);
  };
  const updateScrolledState = () => {
    const isScrolled = window.scrollY > 100;
    header.classList.toggle('header--scrolled', isScrolled);
    if (isScrolled) setCityOpen(false);
  };

  const storedCity = localStorage.getItem('sibseti-city');
  if (storedCity && cityName) cityName.textContent = storedCity;

  cityTrigger.addEventListener('click', () => setCityOpen(!header.classList.contains('is-city-open')));
  closeCity?.addEventListener('click', () => setCityOpen(false));
  menu?.addEventListener('click', () => setMenuOpen(!header.classList.contains('is-menu-open')));
  window.addEventListener('scroll', updateScrolledState, { passive: true });
  updateScrolledState();

  cityPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const city = link.textContent.trim();
    localStorage.setItem('sibseti-city', city);
    if (cityName) cityName.textContent = city;
  }));

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) { setCityOpen(false); setMenuOpen(false); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setCityOpen(false); setMenuOpen(false); }
  });
})();
