ALTER TABLE `users` ADD `fingerprint` CHAR(32) NULL DEFAULT NULL AFTER `email`;
ALTER TABLE `users` CHANGE `password` `password` CHAR(100) CHARACTER SET latin1 COLLATE latin1_general_cs NULL DEFAULT NULL;
ALTER TABLE `users` CHANGE `email` `email` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL;