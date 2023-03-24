CREATE TABLE `kaspi`.`authTokens` (`id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `token` CHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL , `lastAcessDate` DATETIME NULL DEFAULT NULL , PRIMARY KEY (`id`), UNIQUE (`name`), UNIQUE (`token`)) ENGINE = InnoDB;
ALTER TABLE `authTokens` CHANGE `token` `token` CHAR(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL;
ALTER TABLE `authtokens` ADD `active` BOOLEAN NOT NULL DEFAULT TRUE AFTER `lastAcessDate`;
# https://generate-random.org/api-token-generator?count=1&length=128&type=mixed-numbers-symbols&prefix=
INSERT INTO `authTokens` (`id`, `name`, `token`, `lastAcessDate`) VALUES (NULL, 'Tester', 'Ft4Qlyq7-?ukO-QEHjVx1iJX6!dCQDoihA-9EXuqPU9J2Psy0215XiQ!DgLRwLsbIvFOGw59mQwFeV0=aS3T8LfRrGzdF!T0Owx4Z13CZPnkIUuPQRp9KN1v1!rhxrD8', NULL);

ALTER TABLE `products` ADD `categoryId` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `id`, ADD INDEX (`categoryId`);
ALTER TABLE `products` CHANGE `categoryId` `categoryId` INT UNSIGNED NULL DEFAULT '0';

Update `products` set categoryId = JSON_EXTRACT(`categories`, "$.level3");

