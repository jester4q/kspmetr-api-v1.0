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