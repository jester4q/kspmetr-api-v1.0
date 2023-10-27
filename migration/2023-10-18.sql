CREATE TABLE `kaspi`.`userLimits` (`id` INT UNSIGNED NOT NULL , `query` VARCHAR(100) NOT NULL , `role` ENUM('none','admin','parser','chrome_ext','site_user','premium_user') NOT NULL , `value` INT NOT NULL DEFAULT '-1' , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `kaspi`.`userLimits` CHANGE `id` `id` INT UNSIGNED NOT NULL AUTO_INCREMENT;
INSERT INTO `kaspi`.`userLimits` (`query`, `role`, `value`) VALUES 
( 'GET /api/product-details', 'site_user', 500), 
('GET /api/product-details', 'chrome_ext', 500),
('GET /api/product-details', 'premium_user', 1500);
