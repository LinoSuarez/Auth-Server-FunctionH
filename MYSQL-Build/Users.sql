CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(42) NOT NULL DEFAULT '',
  `token` varchar(24) DEFAULT NULL,
  `isOnline` tinyint(1) NOT NULL DEFAULT '0',
  `rank` varchar(20) NOT NULL DEFAULT 'user',
  `fullName` varchar(60) NOT NULL DEFAULT '',
  `email` varchar(40) NOT NULL DEFAULT '',
  `phone` varchar(15) NOT NULL DEFAULT '',
  `address` varchar(30) NOT NULL DEFAULT '',
  `city` varchar(20) NOT NULL DEFAULT '',
  `zipands` varchar(11) NOT NULL DEFAULT '',
  `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profilePicture` blob,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;