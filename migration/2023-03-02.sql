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
