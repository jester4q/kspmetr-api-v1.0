# v1.0
CREATE TABLE `kaspi`.`products` (
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
`code` CHAR(12) NOT NULL ,
`title` VARCHAR(256) NOT NULL ,
`unitPrice` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT '0' ,
`creditMonthlyPrice` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT '0' ,
`reviewsQuantity` SMALLINT UNSIGNED NOT NULL DEFAULT '0' ,
`offersQuantity` SMALLINT UNSIGNED NULL DEFAULT '0' ,
`description` TEXT NULL DEFAULT NULL ,
`specification` JSON NULL DEFAULT NULL ,
`galleryImages` JSON NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
INDEX (`code`)
) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

CREATE TABLE `kaspi`.`productsOffers` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `productId` BIGINT UNSIGNED NOT NULL ,
 `productCode` CHAR(12) NOT NULL ,
 `name` VARCHAR(256) NOT NULL ,
 `price` DECIMAL(10,2) NOT NULL DEFAULT '0' ,
 PRIMARY KEY (`id`),
 INDEX (`productId`),
 INDEX (`productCode`)
 ) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

CREATE TABLE `kaspi`.`productsReviews` (
`id` BIGINT UNSIGNED NOT NULL ,
`productId` BIGINT UNSIGNED NOT NULL ,
`productCode` INT NOT NULL ,
`author` VARCHAR(256) NOT NULL ,
`date` DATE NOT NULL ,
`rating` TINYINT NOT NULL DEFAULT '0' ,
PRIMARY KEY (`id`),
INDEX (`productId`),
INDEX (`productCode`)
) ENGINE = InnoDB  CHARSET=utf8 COLLATE utf8_general_ci;

ALTER TABLE `products` ADD `url` VARCHAR(255) NOT NULL DEFAULT '' AFTER `offersQuantity`;
ALTER TABLE `productsReviews` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `products` ADD `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `id`;

# v.1.1

TRUNCATE TABLE `kaspi`.`products`;
ALTER TABLE `products`
ADD `lastCheckedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `galleryImages`,
ADD `status` BOOLEAN NOT NULL DEFAULT TRUE AFTER `lastCheckedAt`,
ADD `failDescription` TEXT NULL DEFAULT NULL AFTER `status`,
ADD `failDate` DATETIME NULL DEFAULT NULL AFTER `failDescription`,
ADD `productRating` DECIMAL(10,2) NOT NULL DEFAULT '0' AFTER `failDate`;

ALTER TABLE `kaspi`.`products` DROP INDEX `code`, ADD UNIQUE `code` (`code`) USING BTREE;
ALTER TABLE `products` CHANGE `lastCheckedAt` `lastCheckedAt` DATETIME NULL DEFAULT NULL;
ALTER TABLE `proxy` 
ADD `status` BOOLEAN NOT NULL DEFAULT TRUE AFTER `pwd`, 
ADD `failDescription` TEXT NULL DEFAULT NULL AFTER `status`, 
ADD `failDate` DATETIME NULL DEFAULT NULL AFTER `failDescription`;
ALTER TABLE `proxy` ADD `id` INT UNSIGNED NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);

CREATE TABLE `kaspi`.`productsHistory` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT , 
    `productId` BIGINT UNSIGNED NOT NULL , 
    `parserId` INT UNSIGNED NOT NULL , 
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `unitPrice` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT '0' , 
    `creditMonthlyPrice` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT '0' , 
    `reviewsQuantity` SMALLINT UNSIGNED NOT NULL DEFAULT '0' , 
    `offersQuantity` SMALLINT UNSIGNED NOT NULL DEFAULT '0' , 
    `productRating` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT '0' , 
    `productSellers` JSON NULL DEFAULT NULL , 
    PRIMARY KEY (`id`), 
    INDEX (`productId`)
) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

ALTER TABLE `productsHistory` CHANGE `parserId` `parsingId` INT(10) UNSIGNED NOT NULL;

ALTER TABLE `kaspi`.`productsOffers` RENAME `sellers`;
TRUNCATE TABLE `kaspi`.`sellers`;
ALTER TABLE `sellers` DROP `productId`;
ALTER TABLE `sellers` DROP `productCode`;
ALTER TABLE `sellers` DROP `price`;

ALTER TABLE `sellers` 
ADD `url` VARCHAR(255) NOT NULL DEFAULT '' AFTER `name`, 
ADD `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `url`;

ALTER TABLE `sellers` ADD `code` VARCHAR(12) NOT NULL AFTER `id`, ADD UNIQUE `sellerCode` (`code`);

CREATE TABLE `kaspi`.`productsToSellers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT , 
    `productId` BIGINT NOT NULL , 
    `sellerId` BIGINT NOT NULL , 
    PRIMARY KEY (`id`), 
    INDEX (`productId`), 
    INDEX (`sellerId`)
) ENGINE = InnoDB;

ALTER TABLE `products` ADD `attempt` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `failDate`;

ALTER TABLE `productsReviews` ADD `parsingId` INT(10) UNSIGNED NOT NULL;

ALTER TABLE `productsReviews` CHANGE `parsingId` `externalId` VARCHAR(64) NOT NULL;
ALTER TABLE `productsReviews` ADD UNIQUE(`productId`, `externalId`);

ALTER TABLE `sellers` CHANGE `code` `code` VARCHAR(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL;