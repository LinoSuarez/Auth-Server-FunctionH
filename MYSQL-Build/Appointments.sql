CREATE TABLE `Appointments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `adminName` varchar(40) NOT NULL DEFAULT '',
  `clientName` varchar(40) NOT NULL DEFAULT '',
  `appointmentTime` datetime NOT NULL,
  `appointmentReason` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;