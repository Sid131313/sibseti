<?php
declare(strict_types=1);

/* Central configuration for the tariff importer. Keep this file outside public access. */
$root = dirname(__DIR__);

return [
    'root' => $root,
    'paths' => [
        'source' => $root . '/data/source',
        'final' => $root . '/data/tariffs',
        'overrides' => $root . '/data/overrides',
        'manual' => $root . '/data/manual',
        'backups' => $root . '/data/backups/tariffs',
        'status' => $root . '/data/status',
        'log' => $root . '/logs/tariffs-parser.log',
        'lock' => $root . '/data/tariffs-update.lock',
    ],
    'http' => [
        'connect_timeout' => 10,
        'timeout' => 30,
        'user_agent' => 'SibirsetConnectTariffUpdater/1.0 (+https://sibirset-connect.ru/)',
        'city_delay_us' => 300000,
    ],
    'validation' => [
        'min_price' => 100,
        'max_price' => 20000,
        'max_speed' => 5000,
        'min_count_ratio' => 0.35,
        'price_change_ratio' => 3.0,
        'backup_count' => 10,
    ],
    'cities' => [
        'akademgorodok' => ['name' => 'Академгородок'], 'barabinsk' => ['name' => 'Барабинск'], 'berdsk' => ['name' => 'Бердск'], 'iskitim' => ['name' => 'Искитим'], 'karasuk' => ['name' => 'Карасук'], 'koltsovo' => ['name' => 'Кольцово'], 'kuybyshev' => ['name' => 'Куйбышев'], 'linevo' => ['name' => 'Линёво'], 'novosibirsk' => ['name' => 'Новосибирск', 'source' => 'https://sibsetipro.ru/'], 'ob' => ['name' => 'Обь'],
        'anzhero-sudzhensk' => ['name' => 'Анжеро-Судженск'], 'bachatskiy' => ['name' => 'Бачатский'], 'belovo' => ['name' => 'Белово'], 'berezovskiy' => ['name' => 'Березовский'], 'gramoteino' => ['name' => 'Грамотеино'], 'gurevsk' => ['name' => 'Гурьевск'], 'inskoy' => ['name' => 'Инской'], 'kaltan' => ['name' => 'Калтан'], 'kemerovo' => ['name' => 'Кемерово'], 'kiselevsk' => ['name' => 'Киселёвск'], 'leninsk-kuznetskiy' => ['name' => 'Ленинск-Кузнецкий'], 'mezhdurechensk' => ['name' => 'Междуреченск'], 'myski' => ['name' => 'Мыски'], 'novokuznetsk' => ['name' => 'Новокузнецк'], 'novyy-gorodok' => ['name' => 'Новый городок'], 'osinniki' => ['name' => 'Осинники'], 'polysaevo' => ['name' => 'Полысаево'], 'prokopevsk' => ['name' => 'Прокопьевск'], 'salair' => ['name' => 'Салаир'], 'topki' => ['name' => 'Топки'], 'yurga' => ['name' => 'Юрга'], 'iganino' => ['name' => 'Иганино'],
        'barnaul' => ['name' => 'Барнаул'], 'biysk' => ['name' => 'Бийск'], 'zarinsk' => ['name' => 'Заринск'], 'novoaltaysk' => ['name' => 'Новоалтайск'], 'rubtsovsk' => ['name' => 'Рубцовск'],
        'abakan' => ['name' => 'Абакан'], 'achinsk' => ['name' => 'Ачинск'], 'borodino' => ['name' => 'Бородино'], 'divnogorsk' => ['name' => 'Дивногорск'], 'zaozernyy' => ['name' => 'Заозерный'], 'zelenogorsk' => ['name' => 'Зеленогорск'], 'krasnoyarsk' => ['name' => 'Красноярск'], 'lesosibirsk' => ['name' => 'Лесосибирск'], 'minusinsk' => ['name' => 'Минусинск'], 'nazarovo' => ['name' => 'Назарово'], 'chernogorsk' => ['name' => 'Черногорск'],
    ],
];
