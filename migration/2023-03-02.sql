ALTER TABLE `products` ADD `categories` JSON NULL DEFAULT NULL;

CREATE TABLE `categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
    `level` TINYINT UNSIGNED NOT NULL , 
    `parentCategoryId` INT UNSIGNED NOT NULL , 
    `name` VARCHAR(256) NOT NULL , 
    PRIMARY KEY (`id`), 
    INDEX (`parentCategoryId`)
) ENGINE = InnoDB;

ALTER TABLE `categories` ADD `url` VARCHAR(512) NOT NULL AFTER `name`;

INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Телефоны и гаджеты', 'https://kaspi.kz/shop/nur-sultan/c/smartphones%20and%20gadgets/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '1', 'Аксессуары для телефонов', 'https://kaspi.kz/shop/nur-sultan/c/phone%20accessories/?q='), 
(NULL, '2', '1', 'Гаджеты', 'https://kaspi.kz/shop/nur-sultan/c/gadgets/?q='),
(NULL, '2', '1', 'Смартфоны', 'https://kaspi.kz/shop/nur-sultan/c/smartphones/?q='),
(NULL, '2', '1', 'Мобильные телефоны', 'https://kaspi.kz/shop/nur-sultan/c/mobiles/?q='),
(NULL, '2', '1', 'Радиотелефоны', 'https://kaspi.kz/shop/nur-sultan/c/cordless%20telephones/?q=');



INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES (NULL, '1', '0', 'Бытовая техника', 'https://kaspi.kz/shop/nur-sultan/c/home%20equipment/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '44', 'Мелкая техника для кухни', 'https://kaspi.kz/shop/nur-sultan/c/kitchen%20appliances/?q='), 
(NULL, '2', '44', 'Крупная техника для дома', 'https://kaspi.kz/shop/nur-sultan/c/big%20home%20appliances/?q='),
(NULL, '2', '44', 'Климатическая техника', 'https://kaspi.kz/shop/nur-sultan/c/climate%20equipment/?q='),
(NULL, '2', '44', 'Малая техника для дома', 'https://kaspi.kz/shop/nur-sultan/c/small%20home%20appliances/?q='),
(NULL, '2', '44', 'Торговые автоматы', 'https://kaspi.kz/shop/nur-sultan/c/vending%20machines/?q=');



INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES (NULL, '1', '0', 'Компьютеры', 'https://kaspi.kz/shop/nur-sultan/c/computers/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '137', 'Периферия', 'https://kaspi.kz/shop/nur-sultan/c/peripherals/?q='), 
(NULL, '2', '137', 'Комплектующие', 'https://kaspi.kz/shop/nur-sultan/c/hardware/?q='),
(NULL, '2', '137', 'Ноутбуки и аксессуары', 'https://kaspi.kz/shop/nur-sultan/c/notebooks%20and%20accessories/?q='),
(NULL, '2', '137', 'Планшеты и аксессуары', 'https://kaspi.kz/shop/nur-sultan/c/tablets%20and%20accessories/?q='),
(NULL, '2', '137', 'Сетевое оборудование', 'https://kaspi.kz/shop/nur-sultan/c/network%20hardware/?q='),
(NULL, '2', '137', 'Оргтехника и расходные материалы', 'https://kaspi.kz/shop/nur-sultan/c/office%20equipment%20and%20consumables/?q='),
(NULL, '2', '137', 'Настольные компьютеры', 'https://kaspi.kz/shop/nur-sultan/c/desktop%20computers/?q='),
(NULL, '2', '137', 'Электронное оборудование для торговли', 'https://kaspi.kz/shop/nur-sultan/c/electronic%20equipment%20for%20trade/?q='),
(NULL, '2', '137', 'IP-телефония и конференц-оборудование', 'https://kaspi.kz/shop/nur-sultan/c/ip%20telephony%20and%20conference%20equipment/?q='),
(NULL, '2', '137', 'Программное обеспечение', 'https://kaspi.kz/shop/nur-sultan/c/computer%20software/?q=');



INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Подарки, товары для праздников', 'https://kaspi.kz/shop/nur-sultan/c/gifts%20and%20party%20supplies/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '239', 'Подарки', 'https://kaspi.kz/shop/nur-sultan/c/gifts/?q='), 
(NULL, '2', '239', 'Новогодние товары', 'https://kaspi.kz/shop/nur-sultan/c/new%20year%20decor/?q'),
(NULL, '2', '239', 'Украшения для праздников', 'https://kaspi.kz/shop/nur-sultan/c/holiday%20decorations/?q='),
(NULL, '2', '239', 'Подарочная упаковка', 'https://kaspi.kz/shop/nur-sultan/c/gift%20wrapping%20supplies/?q='),
(NULL, '2', '239', 'Карнавальные костюмы, аксессуары для вечеринок', 'https://kaspi.kz/shop/nur-sultan/c/carnival%20accessories/?q='),
(NULL, '2', '239', 'Цветы и букеты', 'https://kaspi.kz/shop/nur-sultan/c/flowers%20and%20bouquets/?q='),
(NULL, '2', '239', 'Сувенирная продукция', 'https://kaspi.kz/shop/nur-sultan/c/souvenirs/?q=');



INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Товары для животных', 'https://kaspi.kz/shop/nur-sultan/c/pet%20goods/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '252', 'Для кошек', 'https://kaspi.kz/shop/nur-sultan/c/cat%20goods/?q='), 
(NULL, '2', '252', 'Гигиена и уход за животными', 'https://kaspi.kz/shop/nur-sultan/c/hygiene%20and%20care%20for%20animals/?q='),
(NULL, '2', '252', 'Для собак', 'https://kaspi.kz/shop/nur-sultan/c/dog%20goods/?q='),
(NULL, '2', '252', 'Аксессуары для животных', 'https://kaspi.kz/shop/nur-sultan/c/pet%20accessories/?q='),
(NULL, '2', '252', 'Для сельскохозяйственных животных', 'https://kaspi.kz/shop/nur-sultan/c/livestock%20goods/?q='),
(NULL, '2', '252', 'Ветаптека', 'https://kaspi.kz/shop/nur-sultan/c/veterinary%20pharmacy/?q='),
(NULL, '2', '252', 'Груминг', 'https://kaspi.kz/shop/nur-sultan/c/pet%20grooming/?q='),
(NULL, '2', '252', 'Для рыб и рептилий', 'https://kaspi.kz/shop/nur-sultan/c/fish%20and%20reptiles%20goods/?q='),
(NULL, '2', '252', 'Для грызунов', 'https://kaspi.kz/shop/nur-sultan/c/rodents%20goods/?q='),
(NULL, '2', '252', 'Для птиц', 'https://kaspi.kz/shop/nur-sultan/c/bird%20goods/?q=');


INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Красота и здоровье', 'https://kaspi.kz/shop/nur-sultan/c/beauty%20care/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '373', 'Уход за лицом', 'https://kaspi.kz/shop/nur-sultan/c/skin%20care/?q='), 
(NULL, '2', '373', 'Уход за волосами', 'https://kaspi.kz/shop/nur-sultan/c/hair%20care/?q='),
(NULL, '2', '373', 'Уход за телом', 'https://kaspi.kz/shop/nur-sultan/c/body%20care/?q='),
(NULL, '2', '373', 'Декоративная косметика', 'https://kaspi.kz/shop/nur-sultan/c/decorative%20cosmetics/?q='),
(NULL, '2', '373', 'Техника и оборудование для красоты', 'https://kaspi.kz/shop/nur-sultan/c/beauty%20care%20equipment/?q='),
(NULL, '2', '373', 'Уход за полостью рта', 'https://kaspi.kz/shop/nur-sultan/c/oral%20care/?q='),
(NULL, '2', '373', 'Для маникюра и педикюра', 'https://kaspi.kz/shop/nur-sultan/c/nail%20care/?q='),
(NULL, '2', '373', 'Массажеры, массажные кресла, миостимуляторы', 'https://kaspi.kz/shop/nur-sultan/c/massagers/?q='),
(NULL, '2', '373', 'Парфюмерия', 'https://kaspi.kz/shop/nur-sultan/c/perfumes/?q='),
(NULL, '2', '373', 'Косметика и аксессуары для бровей и ресниц', 'https://kaspi.kz/shop/nur-sultan/c/cosmetics%20and%20accessories%20for%20eyebrows%20and%20eyelashes/?q='),
(NULL, '2', '373', 'Депиляция и эпиляция', 'https://kaspi.kz/shop/nur-sultan/c/shaving%20and%20hair%20removal/?q='),
(NULL, '2', '373', 'Аксессуары для красоты', 'https://kaspi.kz/shop/nur-sultan/c/tools%20and%20accessories/?q='),
(NULL, '2', '373', 'Товары для бритья', 'https://kaspi.kz/shop/nur-sultan/c/shaving%20products/?q='),
(NULL, '2', '373', 'Декоративные и уходовые наборы косметики', 'https://kaspi.kz/shop/nur-sultan/c/skin%20care%20sets/?q='),
(NULL, '2', '373', 'Инструменты для укладки, ухода и наращивания волос', 'https://kaspi.kz/shop/nur-sultan/c/hair%20styling%20and%20care%20tools/?q='),
(NULL, '2', '373', 'Товары для тату и перманентного макияжа', 'https://kaspi.kz/shop/nur-sultan/c/products%20for%20tattoos%20and%20permanent%20makeup/?q='),
(NULL, '2', '373', 'Товары для ароматерапии', 'https://kaspi.kz/shop/nur-sultan/c/products%20for%20aromatherapy/?q='),
(NULL, '2', '373', 'Мебель и оборудование для салонов красоты', 'https://kaspi.kz/shop/nur-sultan/c/beauty%20salon%20equipment/?q='),
(NULL, '2', '373', 'Защита от солнца', 'https://kaspi.kz/shop/nur-sultan/c/tanning%20and%20sun%20protection/?q=');

INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Детские товары', 'https://kaspi.kz/shop/nur-sultan/c/child%20goods/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '393', 'Игрушки', 'https://kaspi.kz/shop/nur-sultan/c/toys/?q='), 
(NULL, '2', '393', 'Для малыша и мамы', 'https://kaspi.kz/shop/nur-sultan/c/baby%20care/?q='),
(NULL, '2', '393', 'Детское питание', 'https://kaspi.kz/shop/nur-sultan/c/baby%20feeding/?q='),
(NULL, '2', '393', 'Прогулки и поездки', 'https://kaspi.kz/shop/nur-sultan/c/baby%20strolls%20and%20trips/?q='),
(NULL, '2', '393', 'Игровая площадка', 'https://kaspi.kz/shop/nur-sultan/c/playground/?q=');

INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '1', '0', 'Канцелярские товары', 'https://kaspi.kz/shop/nur-sultan/c/office%20and%20school%20supplies/');
INSERT INTO `categories` (`id`, `level`, `parentCategoryId`, `name`, `url`) VALUES 
(NULL, '2', '399', 'Бумага и бумажная продукция', 'https://kaspi.kz/shop/nur-sultan/c/paper%20products/?q='), 
(NULL, '2', '399', 'Офисные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/office%20supplies/?q='),
(NULL, '2', '399', 'Письменные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/writing%20supplies/?q='),
(NULL, '2', '399', 'Школьные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/school%20supplies/?q='),
(NULL, '2', '399', 'Демонстрационные доски', 'https://kaspi.kz/shop/nur-sultan/c/demonstration%20boards/?q='),
(NULL, '2', '399', 'Торговые и рекламные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/trade%20supplies/?q='),
(NULL, '2', '399', 'Мелкоофисные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/small%20office%20supplies/?q='),
(NULL, '2', '399', 'Постпечатное оборудование', 'https://kaspi.kz/shop/nur-sultan/c/post-press%20tools/?q='),
(NULL, '2', '399', 'Штемпельные принадлежности', 'https://kaspi.kz/shop/nur-sultan/c/stamp%20accessories/?q=');