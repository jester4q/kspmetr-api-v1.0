ALTER TABLE `proxy` ADD `type` CHAR(10) NOT NULL DEFAULT 'HTTP' AFTER `status`;
UPDATE `proxy` SET type='SOCKS5' WHERE status=1;