
CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `code` char(12) NOT NULL,
  `title` varchar(256) NOT NULL,
  `unitPrice` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `creditMonthlyPrice` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `reviewsQuantity` smallint UNSIGNED NOT NULL DEFAULT '0',
  `offersQuantity` smallint UNSIGNED DEFAULT '0',
  `url` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `specification` json DEFAULT NULL,
  `galleryImages` json DEFAULT NULL,
  `lastCheckedAt` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `failDescription` text,
  `failDate` datetime DEFAULT NULL,
  `attempt` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `productRating` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `productsHistory` (
  `id` bigint UNSIGNED NOT NULL,
  `productId` bigint UNSIGNED NOT NULL,
  `parsingId` int UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unitPrice` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `creditMonthlyPrice` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `reviewsQuantity` smallint UNSIGNED NOT NULL DEFAULT '0',
  `offersQuantity` smallint UNSIGNED NOT NULL DEFAULT '0',
  `productRating` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00',
  `productSellers` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `productsReviews` (
  `id` bigint UNSIGNED NOT NULL,
  `productId` bigint UNSIGNED NOT NULL,
  `productCode` int NOT NULL,
  `author` varchar(256) NOT NULL,
  `date` date NOT NULL,
  `rating` tinyint NOT NULL DEFAULT '0',
  `externalId` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `productsToSellers` (
  `id` bigint NOT NULL,
  `productId` bigint NOT NULL,
  `sellerId` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `proxy` (
  `id` int UNSIGNED NOT NULL,
  `ip` char(16) NOT NULL,
  `port` char(5) NOT NULL,
  `username` varchar(100) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `failDescription` text,
  `failDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `sellers` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(12) NOT NULL,
  `name` varchar(256) NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`) USING BTREE;

ALTER TABLE `productsHistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

ALTER TABLE `productsReviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productId_2` (`productId`,`externalId`),
  ADD KEY `productId` (`productId`),
  ADD KEY `productCode` (`productCode`);

ALTER TABLE `productsToSellers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`),
  ADD KEY `sellerId` (`sellerId`);

ALTER TABLE `proxy`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ip` (`ip`,`port`);

ALTER TABLE `sellers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `productsHistory`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `productsReviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `productsToSellers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

ALTER TABLE `proxy`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `sellers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

