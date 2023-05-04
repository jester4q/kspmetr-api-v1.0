ALTER TABLE `users` CHANGE `roles` `roles` SET('none','admin','parser','chrome_ext','site_user') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL;

 INSERT INTO `users` (`email`, `password`, `createdAt`, `roles`) VALUES ('SkyMetricSiteTest@mail.com', '$2b$10$8SLw6ZrCXe0xOHOru0rRW.G9JvOcrzp.sMwr/LYPdWv1nLkhdchGy', '2023-05-03 10:45:09', 'site_user');