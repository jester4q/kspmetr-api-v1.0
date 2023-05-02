CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` char(100) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`email`);

ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

CREATE TABLE `authSessions` (
  `id` int UNSIGNED NOT NULL,
  `token` text CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `userId` int UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiredAt` datetime NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
ALTER TABLE `authSessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `authSessions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `authsessions`
  ADD CONSTRAINT `authsessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

ALTER TABLE `users` ADD `roles` SET('admin', 'parser', 'chrome_ext') NOT NULL AFTER `createdAt`;

ALTER TABLE `users` CHANGE `roles` `roles` SET('none','admin','parser','chrome_ext') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL;

ALTER TABLE `products` ADD `sessionId` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `categoryId`, ADD INDEX (`sessionId`);

ALTER TABLE `productsHistory` ADD `sessionId` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `parsingId`, ADD INDEX (`sessionId`);

ALTER TABLE `productsReviews` ADD `sessionId` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `productId`, ADD INDEX (`sessionId`);

ALTER TABLE `sellers` ADD `sessionId` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `id`, ADD INDEX (`sessionId`);

CREATE TABLE `log` (
  `id` int UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int UNSIGNED NOT NULL,
  `sessionId` int UNSIGNED NOT NULL,
  `query` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

ALTER TABLE `log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createdAt` (`createdAt`),
  ADD KEY `userId` (`userId`),
  ADD KEY `sessionId` (`sessionId`);

ALTER TABLE `log`
  ADD CONSTRAINT `log_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `log_ibfk_2` FOREIGN KEY (`sessionId`) REFERENCES `authSessions` (`id`) ON DELETE RESTRICT;

  ALTER TABLE `log` CHANGE `id` `id` INT UNSIGNED NOT NULL AUTO_INCREMENT;

  ALTER TABLE `users` ADD `banned` DATETIME NULL DEFAULT NULL AFTER `roles`;

  INSERT INTO `users` (`email`, `password`, `createdAt`, `roles`, `banned`) VALUES
('SkyMetric@mail.com', '$2b$10$TrpR9Nr96HOMmSFUUezHW.O/9AjKICBzTVK3/miJANXhK4fgxajuS', '2023-04-20 15:17:34', 'admin', NULL),
('SkyMetricParserTest@mail.com', '$2b$10$0PLnWRQ9.GTYgty03VXjsOvnJ8.VTW9dEe1raxm5ewxuhvEFYUYAK', '2023-04-20 18:14:14', 'parser', NULL),
('SkyMetricExtensionTest@mail.com', '$2b$10$UHEkAePrWx75VY356xAcjemVXY.y0qsQ3d9pFR7XCc3.QyD1jJN5q', '2023-04-21 18:41:34', 'chrome_ext', NULL);