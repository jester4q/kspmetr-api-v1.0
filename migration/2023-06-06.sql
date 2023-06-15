

CREATE TABLE `emailVerifications` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `email` VARCHAR(255) NOT NULL , `token` CHAR(7) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL , `createdAt` DATETIME NOT NULL , PRIMARY KEY (`id`), INDEX (`email`), INDEX (`token`)) ENGINE = InnoDB;

ALTER TABLE `users` ADD `validEmail` BOOLEAN NOT NULL DEFAULT FALSE AFTER `banned`;
