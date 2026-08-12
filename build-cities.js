const fs = require('fs');
const path = require('path');

const domain = 'https://sibirset-connect.ru';
const cities = [
  ['akademgorodok','Академгородок','Академгородке'],['barabinsk','Барабинск','Барабинске'],['berdsk','Бердск','Бердске'],['iskitim','Искитим','Искитиме'],['karasuk','Карасук','Карасуке'],['koltsovo','Кольцово','Кольцово'],['kuybyshev','Куйбышев','Куйбышеве'],['linevo','Линёво','Линёво'],['novosibirsk','Новосибирск','Новосибирске'],['ob','Обь','Оби'],
  ['anzhero-sudzhensk','Анжеро-Судженск','Анжеро-Судженске'],['bachatskiy','Бачатский','Бачатском'],['belovo','Белово','Белово'],['berezovskiy','Березовский','Березовском'],['gramoteino','Грамотеино','Грамотеино'],['gurevsk','Гурьевск','Гурьевске'],['inskoy','Инской','Инском'],['kaltan','Калтан','Калтане'],['kemerovo','Кемерово','Кемерово'],['kiselevsk','Киселёвск','Киселёвске'],['leninsk-kuznetskiy','Ленинск-Кузнецкий','Ленинске-Кузнецком'],['mezhdurechensk','Междуреченск','Междуреченске'],['myski','Мыски','Мысках'],['novokuznetsk','Новокузнецк','Новокузнецке'],['novyy-gorodok','Новый городок','Новом городке'],['osinniki','Осинники','Осинниках'],['polysaevo','Полысаево','Полысаево'],['prokopevsk','Прокопьевск','Прокопьевске'],['salair','Салаир','Салаире'],['topki','Топки','Топках'],['yurga','Юрга','Юрге'],['iganino','Иганино','Иганино'],
  ['barnaul','Барнаул','Барнауле'],['biysk','Бийск','Бийске'],['zarinsk','Заринск','Заринске'],['novoaltaysk','Новоалтайск','Новоалтайске'],['rubtsovsk','Рубцовск','Рубцовске'],['abakan','Абакан','Абакане'],['achinsk','Ачинск','Ачинске'],['borodino','Бородино','Бородино'],['divnogorsk','Дивногорск','Дивногорске'],['zaozernyy','Заозерный','Заозерном'],['zelenogorsk','Зеленогорск','Зеленогорске'],['krasnoyarsk','Красноярск','Красноярске'],['lesosibirsk','Лесосибирск','Лесосибирске'],['minusinsk','Минусинск','Минусинске'],['nazarovo','Назарово','Назарово'],['chernogorsk','Черногорск','Черногорске']
].map(([slug, name, inCity]) => ({slug, name, inCity}));

const root = __dirname;
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cityNav = cities.map(city => ({...city, href: `/${city.slug}/`}));

function cityContent(city) {
  const text = `Сибсети в ${city.inCity} — это домашний интернет для работы, учёбы, общения и развлечений. На странице представлены актуальные варианты подключения: интернет и цифровое телевидение, а также оборудование для стабильной домашней сети. Скорость зависит от выбранного тарифа и технической возможности по конкретному адресу.\n\nПеред подключением можно оставить заявку и указать адрес: специалист проверит доступность услуг, поможет подобрать тариф и расскажет об условиях подключения. При необходимости подберём Wi‑Fi-роутер или ТВ-приставку. Это удобно, если дома несколько устройств и нужен уверенный сигнал в разных комнатах.\n\nВыберите подходящую скорость, оставьте контакты и дождитесь звонка специалиста. Сибсети в ${city.inCity} помогут оформить заявку на интернет или комплект интернет + ТВ без лишних действий.`;
  return `<section class="city-seo" aria-labelledby="city-seo-title"><div class="wrap city-seo__inner"><h2 id="city-seo-title">Интернет и телевидение Сибсети в ${city.inCity}</h2>${text.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div></section><section class="city-faq" aria-labelledby="city-faq-title"><div class="wrap city-faq__inner"><h2 id="city-faq-title">Частые вопросы</h2><details><summary>Как подключить интернет Сибсети в ${city.inCity}?</summary><p>Оставьте заявку на странице и укажите адрес. Специалист проверит возможность подключения и свяжется с вами.</p></details><details><summary>Можно ли подключить интернет и ТВ вместе?</summary><p>Да, на странице доступны тарифы с домашним интернетом и цифровым телевидением.</p></details><details><summary>Как выбрать скорость интернета?</summary><p>Ориентируйтесь на количество устройств и привычные сценарии: работа, видеосвязь, игры и просмотр видео.</p></details></div></section>`;
}

function jsonLd(city) {
  return `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'InternetServiceProvider','name':`Сибсети в ${city.inCity}`,'url':`${domain}/${city.slug}/`,'areaServed':{'@type':'City','name':city.name},'description':`Домашний интернет и телевидение Сибсети в ${city.inCity}.`},{'@type':'FAQPage','mainEntity':[{'@type':'Question','name':`Как подключить интернет Сибсети в ${city.inCity}?`,'acceptedAnswer':{'@type':'Answer','text':'Оставьте заявку и укажите адрес для проверки технической возможности подключения.'}},{'@type':'Question','name':'Можно ли подключить интернет и ТВ вместе?','acceptedAnswer':{'@type':'Answer','text':'Да, доступны тарифы с домашним интернетом и цифровым телевидением.'}}]}]})}</script>`;
}

function localPaths(html) {
  return html.replace(/\b(href|src)="([^"#][^"]*)"/g, (all, attr, value) => {
    if (/^(https?:|tel:|mailto:|\/)/.test(value)) return all;
    return `${attr}="/${value}"`;
  });
}

for (const city of cities) {
  let html = source;
  html = html.replace('<link rel="canonical" href="https://sibirset-connect.ru/" />', `<link rel="canonical" href="${domain}/${city.slug}/" />`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>Сибсети в ${city.inCity} — тарифы на домашний интернет и ТВ</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="Подключить домашний интернет Сибсети в ${city.inCity}. Актуальные тарифы, интернет и телевидение, оборудование и проверка возможности подключения по адресу." />`);
  html = html.replace('<body data-city-name="">', `<body data-city-name="${city.name}">`);
  html = html.replace('<span data-current-city>Новосибирск</span>', `<span data-current-city>${city.name}</span>`);
  html = html.replace('Домашний интернет <span>Сибсети</span>', `Домашний интернет <span>Сибсети</span><br />в ${city.inCity}`);
  html = html.replace('Надёжный оператор связи для вашего дома: подключаем быстро, предлагаем прозрачные условия и остаёмся на связи 24/7.', `Подключаем домашний интернет и телевидение в ${city.inCity}: поможем выбрать тариф и проверим возможность подключения по адресу.`);
  html = html.replace('Подключим надёжный интернет и ТВ в Новосибирске. Скорость до 750 Мбит/с, подключение — 0 ₽.', `Подключим надёжный интернет и ТВ в ${city.inCity}. Скорость до 750 Мбит/с, подключение — 0 ₽.`);
  html = html.replace('4 актуальных тарифа на интернет со скоростью до 750 Мбит/с.', `Актуальные тарифы Сибсети в ${city.inCity} со скоростью до 750 Мбит/с.`);
  html = html.replace('Выберите свою <em>скорость</em>', `Тарифы Сибсети в <em>${city.inCity}</em>`);
  html = html.replace('</main>', `${cityContent(city)}</main>`);
  html = html.replace('</body>', `${jsonLd(city)}\n</body>`);
  html = html.replace(/https:\/\/sibsetipro\.ru\/(?:[a-z-]+)?\/?/g, match => {
    const slug = match.replace('https://sibsetipro.ru/', '').replaceAll('/', '');
    return slug ? `/${slug}/` : '/novosibirsk/';
  });
  html = html.replace(/<a class="is-current" href="\/novosibirsk\/">Новосибирск<\/a>/, `<a class="is-current" href="/novosibirsk/">Новосибирск</a>`);
  html = html.replace(/<a([^>]*) href="\/${city.slug}\/"([^>]*)>([^<]+)<\/a>/g, (all, left, right, label) => `<a${left} href="/${city.slug}/"${right} data-city-name="${city.name}">${label}</a>`);
  html = html.replace(/<a([^>]*) href="\/novosibirsk\/"([^>]*)>Новосибирск<\/a>/g, (all, left, right) => `<a${left} href="/novosibirsk/"${right} data-city-name="Новосибирск">Новосибирск</a>`);
  html = localPaths(html);
  html = html.replaceAll('name="city" value="" data-city-field', `name="city" value="${city.name}" data-city-field`);
  const folder = path.join(root, city.slug);
  fs.mkdirSync(folder, {recursive: true});
  fs.writeFileSync(path.join(folder, 'index.html'), html);
}

let home = source.replace(/https:\/\/sibsetipro\.ru\/(?:[a-z-]+)?\/?/g, match => {
  const slug = match.replace('https://sibsetipro.ru/', '').replaceAll('/', '');
  return slug ? `/${slug}/` : '/novosibirsk/';
});
home = home.replace(/<a([^>]*) href="\/([a-z-]+)\/"([^>]*)>([^<]+)<\/a>/g, (all, left, slug, right, label) => {
  const city = cities.find(item => item.slug === slug);
  return city ? `<a${left} href="/${city.slug}/"${right} data-city-name="${city.name}">${label}</a>` : all;
});
fs.writeFileSync(path.join(root, 'index.html'), home);

const urls = ['/', ...cities.map(city => `/${city.slug}/`), '/privacy-policy.html', '/data-processing-policy.html', '/personal-data-consent.html'];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${domain}${url}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Created ${cities.length} city pages.`);
