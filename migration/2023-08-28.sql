ALTER TABLE `productsHistory` ADD `failDescription` TEXT NULL DEFAULT NULL AFTER `productSellers`;
ALTER TABLE `users` DROP INDEX `username`, ADD INDEX `username` (`email`) USING BTREE;
ALTER TABLE `users` ADD INDEX(`fingerprint`);