CREATE TABLE `kaspi`.`productsRequests` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
    `sessionId` INT UNSIGNED NOT NULL , 
    `url` VARCHAR(512) NOT NULL DEFAULT '' , 
    `code` CHAR(12) NOT NULL DEFAULT '' , 
    `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1' , 
    `errorDescription` TEXT NULL DEFAULT NULL , 
    PRIMARY KEY (`id`), 
    INDEX (`sessionId`), 
    INDEX (`code`)
) ENGINE = InnoDB;