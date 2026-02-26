-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: webshop_egen
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesslog`
--

DROP TABLE IF EXISTS `accesslog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accesslog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(40) NOT NULL,
  `user_agent` varchar(200) DEFAULT NULL,
  `accessed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesslog`
--

LOCK TABLES `accesslog` WRITE;
/*!40000 ALTER TABLE `accesslog` DISABLE KEYS */;
INSERT INTO `accesslog` VALUES (1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:08','/favicon.ico'),(2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:09','/login'),(3,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:10','/favicon.ico'),(4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:18','/register'),(5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:18','/favicon.ico'),(6,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:21','/favicon.ico'),(7,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:22','/login'),(8,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:22','/'),(9,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:22','/favicon.ico'),(10,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:23','/favicon.ico'),(11,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:24','/favicon.ico'),(12,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-26 12:36:24','/me');
/*!40000 ALTER TABLE `accesslog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_ip` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin','$2b$10$VlWyvzUYVzprf88X/PcB3e2BbskKpu8No.WXStlL8c.GeEwWgpNr6','2026-02-01 14:17:36','2026-02-26 12:32:16','::1');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `parent_categories_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  KEY `fk_categories_categories1_idx` (`parent_categories_id`),
  CONSTRAINT `fk_categories_categories1` FOREIGN KEY (`parent_categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_categories_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (23,'Dator',NULL),(24,'Tillbehör',23),(25,'Tangentbord',24),(26,'Skärm',23),(27,'Ljud',NULL),(28,'Hörlurar',27),(29,'Högtalare',27),(30,'Lagring',32),(31,'NVMe',30),(32,'Komponenter',23),(33,'Minne',32),(34,'Chassi',23),(35,'Klockor',36),(36,'Wearables',NULL),(37,'Mobiltillbehör',38),(38,'Mobil',NULL),(39,'Laddare',38),(40,'Laptop',23),(41,'Kamera',NULL),(42,'Actionkamera',41),(43,'Nätverk',NULL),(44,'Router',43),(46,'Datormus',24),(103,'Smarthem',NULL),(104,'Gaming',NULL),(105,'Kontor',NULL),(106,'Kablar och adaptrar',NULL),(107,'Grafikkort',32),(108,'Processor',32),(109,'Moderkort',32),(110,'Nätaggregat',32),(111,'Kylning',32),(112,'Stationär PC',23),(113,'Mini PC',23),(114,'Dockningsstation',24),(115,'USB-hubbar',24),(116,'Skärmarm',24),(117,'Ritplattor',24),(118,'Ultrawide',26),(119,'Bärbar skärm',26),(120,'Mikrofon',27),(121,'Headset',27),(122,'Ljudkort',27),(123,'SSD SATA',30),(124,'Portabel SSD',30),(125,'HDD',30),(126,'Minneskort',30),(127,'USB-minne',30),(128,'NAS',30),(129,'Nätverksswitch',43),(130,'WiFi-extender',43),(131,'Nätverkskort',43),(132,'Nätverkskabel',43),(133,'Webbkamera',41),(134,'Dashcam',41),(135,'Systemkamera',41),(136,'Säkerhetskamera',41),(137,'Laptop-sleeve',40),(138,'Laptopstativ',40),(139,'Laptopkylare',40),(140,'Powerbanks',39),(141,'Trådlös laddning',39),(142,'Smarta lampor',103),(143,'Smarta sensorer',103),(144,'Smarthögtalare',103),(145,'Smarta kontakter',103),(146,'Spelkonsoler',104),(147,'Spelstolar',104),(148,'Gamingbord',104),(149,'Spelkontroller',104),(150,'Skrivbord',105),(151,'Kontorsstolar',105),(152,'Belysning',105),(153,'Skrivbordstillbehör',105),(154,'HDMI-kablar',106),(155,'USB-kablar',106),(156,'Adaptrar',106),(157,'Projektor',23);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filter_types`
--

DROP TABLE IF EXISTS `filter_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filter_types` (
  `filters_id` int(11) NOT NULL,
  `min_value` int(11) DEFAULT NULL,
  `max_value` int(11) DEFAULT NULL,
  PRIMARY KEY (`filters_id`),
  KEY `fk_filter_types_filters1_idx` (`filters_id`),
  CONSTRAINT `fk_filter_types_filters1` FOREIGN KEY (`filters_id`) REFERENCES `filters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filter_types`
--

LOCK TABLES `filter_types` WRITE;
/*!40000 ALTER TABLE `filter_types` DISABLE KEYS */;
INSERT INTO `filter_types` VALUES (1,1,128),(2,12,70),(5,1,5000),(7,30,1040),(9,0,5000),(12,24,1000),(13,1,2826),(14,10,46000),(16,1,5000),(17,1,40),(18,1,100),(24,1,24),(25,1,6),(26,5,400),(27,1000,26800),(28,100,7000),(29,400,25600),(30,100,5000),(31,1,10),(34,1,10000);
/*!40000 ALTER TABLE `filter_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filter_values`
--

DROP TABLE IF EXISTS `filter_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filter_values` (
  `filters_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`filters_id`,`value`),
  KEY `fk_filter_values_filters1_idx` (`filters_id`),
  CONSTRAINT `fk_filter_values_filters1` FOREIGN KEY (`filters_id`) REFERENCES `filters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filter_values`
--

LOCK TABLES `filter_values` WRITE;
/*!40000 ALTER TABLE `filter_values` DISABLE KEYS */;
INSERT INTO `filter_values` VALUES (4,'Android'),(4,'IOS'),(4,'Linux'),(4,'Windows'),(6,'2.4GHz'),(6,'Bluetooth 2.1'),(6,'Bluetooth 3'),(6,'Bluetooth 4.2'),(6,'Bluetooth 5'),(6,'Trådad'),(6,'Wifi'),(8,'DisplayPort'),(8,'DVI'),(8,'Ethernet'),(8,'HDMI'),(8,'PCIe'),(8,'Scart'),(8,'TosLink'),(8,'USB-A'),(8,'USB-B'),(8,'USB-C'),(8,'VGA'),(8,'XLR'),(10,'1'),(10,'2'),(11,'GPS'),(11,'Pulsmätning'),(11,'Syresensor'),(15,'IEEE 802.11'),(15,'IEEE 802.11a'),(15,'IEEE 802.11ac'),(15,'IEEE 802.11b'),(15,'IEEE 802.11g'),(15,'IEEE 802.11n'),(15,'Wi-Fi 6'),(15,'Wi-Fi 6E'),(15,'Wi-Fi 7'),(19,'1'),(19,'12'),(19,'2'),(19,'3'),(19,'4'),(19,'6'),(19,'8'),(20,'IPS'),(20,'Mini-LED'),(20,'OLED'),(20,'TN'),(20,'VA'),(21,'Cherry MX Blue'),(21,'Cherry MX Brown'),(21,'Cherry MX Red'),(21,'Gateron Blue'),(21,'Gateron Red'),(21,'Gateron Yellow'),(21,'Membran'),(21,'Optical'),(22,'60%'),(22,'65%'),(22,'75%'),(22,'ATX'),(22,'Full Size'),(22,'Micro-ATX'),(22,'Mini-ITX'),(22,'TKL'),(23,'AMD Ryzen 5'),(23,'AMD Ryzen 7'),(23,'AMD Ryzen 9'),(23,'Apple M1'),(23,'Apple M2'),(23,'Apple M3'),(23,'Intel Core i3'),(23,'Intel Core i5'),(23,'Intel Core i7'),(23,'Intel Core i9'),(23,'Intel N100'),(32,'IP44'),(32,'IP54'),(32,'IP65'),(32,'IP67'),(32,'IP68'),(32,'IPX4'),(32,'IPX5'),(32,'IPX6'),(32,'IPX7'),(33,'Ja'),(33,'Nej');
/*!40000 ALTER TABLE `filter_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filters`
--

DROP TABLE IF EXISTS `filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `units` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filters`
--

LOCK TABLES `filters` WRITE;
/*!40000 ALTER TABLE `filters` DISABLE KEYS */;
INSERT INTO `filters` VALUES (1,'Minne','GB'),(2,'Skärmstorlek','\"'),(4,'OS',NULL),(5,'Lagringsstorlek','GB'),(6,'Trådlös teknik',NULL),(7,'Uppdateringsfrekvens','Hz'),(8,'Anslutning',NULL),(9,'Watt','W'),(10,'Antal minnen',NULL),(11,'Tekniker',NULL),(12,'FPS','fps'),(13,'Upplösning','mp'),(14,'Nätverkshastighet','Mbps'),(15,'Wifi-standard',NULL),(16,'Vikt','kg'),(17,'Batteritid','h'),(18,'Räckvidd','m'),(19,'Antal portar',NULL),(20,'Skärmtyp',NULL),(21,'Switchtyp',NULL),(22,'Formfaktor',NULL),(23,'Processormodell',NULL),(24,'Antal kärnor','st'),(25,'Klockhastighet','GHz'),(26,'TDP','W'),(27,'Kapacitet','mAh'),(28,'Hastighet','MB/s'),(29,'DPI','DPI'),(30,'Ljusstyrka','lumen'),(31,'Svarstid','ms'),(32,'IP-klass',NULL),(33,'RGB',NULL),(34,'Längd','cm');
/*!40000 ALTER TABLE `filters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logindata`
--

DROP TABLE IF EXISTS `logindata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logindata` (
  `user_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_logindata_users_idx` (`user_id`),
  CONSTRAINT `fk_logindata_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logindata`
--

LOCK TABLES `logindata` WRITE;
/*!40000 ALTER TABLE `logindata` DISABLE KEYS */;
/*!40000 ALTER TABLE `logindata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderitems_products1_idx` (`product_id`),
  KEY `fk_orderitems_orders1_idx` (`order_id`),
  CONSTRAINT `fk_orderitems_orders1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_orderitems_products1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `ordertime` timestamp NULL DEFAULT current_timestamp(),
  `state` enum('ordered','shipped','delivered','cancelled','refunded','returned') NOT NULL DEFAULT 'ordered',
  `name` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `postal` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_service` varchar(100) NOT NULL,
  `postal_point` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ordertime` (`ordertime`),
  KEY `fk_orders_users1_idx` (`user_id`),
  CONSTRAINT `fk_orders_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `number` varchar(16) NOT NULL,
  `expires` varchar(5) NOT NULL,
  `cvc` varchar(3) NOT NULL,
  `order_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payments_orders_idx` (`order_id`),
  CONSTRAINT `fk_payments_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `short_description` varchar(100) DEFAULT NULL,
  `full_description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL,
  `added` date DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (32,'Mekaniskt tangentbord TKL Pro','Kompakt mekaniskt tangentbord med hot-swap och RGB.','Robust TKL-tangentbord med aluminiumplatta, hot-swap sockets och PBT keycaps. Stöd för både Windows och macOS. RGB per key, avtagbar USB-C och N-key rollover. Passar både utvecklare och gamers.',1490.00,'1770884270818_1994.png',0,'2026-02-17'),(33,'Ergonomisk kontorsmus Silent Pro','Vertikal mus med låg klickvolym.','Ergonomiskt designad vertikal mus som minskar belastning på handled. Justerbar DPI, Bluetooth. Tyst klickmekanism och laddningsbart batteri.',699.00,'1770884350099_9239.png',58,'2026-02-17'),(34,'27” IPS 144Hz Skärm','Skarp IPS-panel för arbete och gaming.','2560x1440 upplösning, 144Hz uppdateringsfrekvens och 1ms responstid. Stöd för FreeSync. Justerbart stativ och VESA-fäste.',3990.00,'1770882808943_5625.png',12,'2026-02-18'),(35,'USB-C Dockningsstation 12-i-1','Förvandla din laptop till arbetsstation.','HDMI, DisplayPort, Ethernet, USB-A, USB-C, SD-kort och 100W PD. Aluminiumchassi och plug-and-play. Perfekt för kontor och hemmakontor.',1290.00,'1770799405749_1478.png',27,'2026-02-19'),(36,'Trådlösa Over-Ear Hörlurar ANC','Aktiv brusreducering och 40h batteritid.','Bluetooth 5, multipoint-anslutning och djup bas. ANC med transparensläge. Hopfällbar design och medföljande resefodral.',1990.00,'1770901795770_2451.jpg',19,'2026-02-22'),(37,'Bluetooth-högtalare Outdoor 30W','Vattentålig högtalare för utomhusbruk.','IPX7-klassad, 30W effekt och upp till 20h batteritid. Parkoppla två enheter för stereo. Robust gummerat skal.',1190.00,'1770901791451_6143.jpg',41,'2026-02-22'),(38,'2TB NVMe SSD Gen4','Extrem läs- och skrivhastighet.','Upp till 7000 MB/s läshastighet. PCIe 4.0, låg latens och fem års garanti. Passar gaming och professionell redigering.',1790.00,'1770901787682_3558.jpg',23,'2026-02-22'),(39,'Mini-ITX Chassi Mesh','Kompakt chassi med optimal luftflöde.','Stöd för fullängds GPU, mesh-paneler och plats för 240mm radiator. Perfekt för små men kraftfulla byggen.',1090.00,'1770901783852_5658.jpg',15,'2026-12-22'),(40,'32GB DDR5 RAM 6000MHz','Snabbt minne för moderna system.','2x16GB kit, XMP 3.0-stöd och låg latens. Optimerad för gaming och produktivitet.',1690.00,'1770901781298_3344.jpg',29,'2026-02-22'),(41,'Smartwatch Active S','Hälsa och notiser direkt på handleden.','Pulsmätning, syresensor, GPS och 7 dagars batteritid. Stöd för Android och iOS.',1490.00,'1770901778260_2357.jpg',38,'2026-02-22'),(42,'65W GaN USB-C Laddare','Kraftfull och kompakt snabbladdare.','GaN-teknik ger hög effekt i litet format. Två USB-C och en USB-A. Stöd för PD och QC.',499.00,'1770901775538_5834.jpg',76,'2026-02-22'),(43,'14” Ultralight Laptop Ryzen 7','Kraft och portabilitet i balans.','Ryzen 7, 16GB RAM, 1TB SSD och 2.8K IPS-panel. Aluminiumchassi och 10h batteritid.',12990.00,'1770901772140_3517.jpg',9,'2026-02-22'),(44,'4K Actionkamera','Filma äventyren i hög upplösning.','4K/60fps, bildstabilisering och vattentät till 30m med hus. WiFi och app-stöd.',2490.00,'1770901769360_8927.jpg',17,'2026-02-22'),(45,'Router WiFi 6 AX3000','Snabb och stabil uppkoppling.','Dual-band WiFi 6, MU-MIMO och WPA3. Täcker större bostäder med stabil signal.',1790.00,'1770901765585_412.jpg',21,'2026-02-22'),(52,'Mekaniskt tangentbord Full Size RGB','Fullstort mekaniskt tangentbord med RGB-belysning.','Mekaniskt tangentbord med Cherry MX Red-switchar, RGB per tangent och avtagbar USB-C-kabel. Aluminiumram och PBT keycaps. N-key rollover och stöd för makron.',1290.00,'1770884270818_1994.png',34,'2025-08-12'),(53,'Trådlös spelmus 25600 DPI','Lätt trådlös mus för gamers.','Optisk sensor med upp till 25600 DPI, 70h batteritid och 2.4GHz trådlös. Programmerbar med 7 knappar och RGB-belysning. Vikt: 85g.',899.00,'1770884350099_9239.png',22,'2025-11-03'),(54,'34\" Ultrawide 165Hz','Böjd ultrawide-skärm för gaming och arbete.','3440x1440, VA-panel, 165Hz och 1ms. AMD FreeSync Premium och HDR400. USB-C med 65W PD och inbyggd KVM-switch.',5490.00,'1770882808943_5625.png',8,'2025-06-17'),(55,'Webbkamera 4K med autofokus','Skarp 4K-webbkamera för streaming och möten.','Sony-sensor, autofokus och brusreducerande mikrofon. Plug-and-play via USB-C. Passar OBS, Teams och Zoom.',1190.00,'1770901769360_8927.jpg',45,'2025-09-22'),(56,'NVMe SSD 1TB Gen4','Snabb och pålitlig lagring.','Upp till 7000 MB/s läshastighet, PCIe 4.0 och låg latens. Fem års garanti. Perfekt för gaming och videoredigering.',990.00,'1770901787682_3558.jpg',60,'2025-07-05'),(57,'Gaming Headset 7.1 Surround','Nedsänkande ljud för gaming.','Virtuellt 7.1 surroundljud, avtagbar brusreducerande mikrofon och minnesskumkuddar. USB och 3.5mm-jack. Kompatibel med PC, PS5 och Xbox.',799.00,'1771914983344_5177.png',31,'2025-10-14'),(58,'Stationär PC Gaming RTX 4070','Färdigbyggd gaming-PC för 1440p.','Intel Core i7, 32GB DDR5, 1TB NVMe och RTX 4070. Windows 11 Home. Mesh-chassi med RGB-kylning.',19990.00,'1771873771427_1574.jpg',5,'2025-12-01'),(59,'Portabel SSD 2TB USB-C','Ta med din lagring överallt.','Upp till 1050 MB/s, USB 3.2 Gen 2 och stöttålig design. Passar Mac och PC. Liten som ett kreditkort.',1290.00,'1771874170453_3366.jpg',28,'2025-08-29'),(60,'RGB Musmatta XL','Täck hela skrivbordet med RGB.','900x400mm, 4mm tjocklek och RGB-kant med 15 lägen. Halkfri gummibotten och sömnad kant. USB-anslutning.',399.00,'1771915066110_5301.png',72,'2025-05-11'),(61,'Spelkontroll Pro Wireless','Trådlös kontroll för PC och konsol.','Stöd för PC, PS4 och Android. Vibrationsmotorer, programmerbar och 20h batteritid. USB-C-laddning.',699.00,'1771874177294_9925.jpg',19,'2025-11-25'),(62,'16GB DDR4 RAM 3200MHz','Pålitligt RAM för stationära datorer.','2x8GB kit, XMP 2.0-profil och heatspreader. Kompatibel med AMD och Intel. Passar gaming och produktivitet.',590.00,'1770901781298_3344.jpg',47,'2025-06-08'),(63,'CPU-kylare 240mm AIO','Vätskekylare för processorer.','240mm radiator, två 120mm-fläktar och ARGB-belysning. Kompatibel med AM5, AM4, LGA1700. Enkel installation.',990.00,'1771874179894_6561.jpg',14,'2025-09-30'),(64,'ATX Modulariserat Nätaggregat 850W','80+ Gold certifierat modulärt PSU.','850W, 80+ Gold, fullt modulärt och tyst 135mm-fläkt. Skyddas mot överspänning och kortslutning. 10 års garanti.',1390.00,'1771875117839_9036.png',18,'2025-07-19'),(65,'Mikrofon USB Kondensator','Studiokvalitet för streaming och podcasting.','Kardioid kondensatormikrofon med USB-C. Inbyggd headphone-utgång, mute-knapp och justerbar stativ. Plug-and-play.',1090.00,'1771874183292_8952.jpg',26,'2025-10-07'),(66,'27\" 4K IPS 60Hz Skärm','Kristallklar 4K för kreativt arbete.','3840x2160, IPS-panel, 99% sRGB och fabrikskalibrerad. USB-C med 90W PD och DisplayHDR 400. Justerbart stativ.',4990.00,'1771874186328_2041.jpg',11,'2025-08-03'),(67,'Trådlöst laddningsställ 3-i-1','Ladda telefon, klocka och hörlurar samtidigt.','15W Qi-laddning, kompatibel med iPhone och Android. Laddningsindikator och halkfri yta. Kompakt design.',599.00,'1771874188773_180.jpg',53,'2025-12-15'),(68,'Laptopstativ Aluminium Justerbart','Ergonomiskt stativ för laptop.','Justerbar höjd och vinkel, stöd för 10-17 tum. Aluminium med halkfria gummifötter. Hopfällbart och portabelt.',449.00,'1771874191238_24.jpg',39,'2025-05-28'),(69,'USB-hubb 7-port USB 3.0','Utöka dina USB-portar.','7x USB 3.0-portar med individuella strömbrytare. 5V/4A nätadapter. Bakåtkompatibel med USB 2.0. LED-indikatorer.',349.00,'1771875082266_567.png',64,'2025-09-09'),(70,'Skrivbordslampa LED med USB','Justerbar LED-lampa för skrivbordet.','5 ljusnivåer och 3 färgtemperaturer. USB-A-port för laddning. Minnesfunktion och touch-kontroll. Böjbar arm.',299.00,'1771874193885_872.jpg',81,'2025-06-21'),(71,'Spelstol Racing Pro','Ergonomisk spelstol med lumbalt stöd.','PU-läder, justerbar armstöd och ryggstöd. Inkl. nackdyna och ländryggskudde. Bärighet upp till 150kg.',2990.00,'1771874928778_1836.png',7,'2025-11-18'),(72,'Vertikalt laptopstativ dubbelt','Placera två laptops vertikalt.','Stål med gummiskydd. Justerbar bredd för 10-17 tum. Sparar skrivbordsyta och förbättrar luftflöde.',399.00,'1771874191238_24.jpg',43,'2025-07-14'),(73,'Bluetooth-tangentbord Slim','Tunt Bluetooth-tangentbord för kontorsbruk.','Anslut upp till 3 enheter, scissor-switchar och 3 månaders batteritid. Kompatibel med Windows, macOS och iOS.',699.00,'1770884270818_1994.png',33,'2025-10-26'),(74,'Smart LED-remsa 5m WiFi','Styr belysningen med röst och app.','5m RGB LED-remsa med WiFi och app-kontroll. Kompatibel med Alexa och Google Home. Klipp och anslut.',349.00,'1771875278626_4388.png',58,'2025-08-16'),(75,'Powerbank 26800mAh 65W','Stor kapacitet för alla dina enheter.','65W USB-C PD, 18W QC USB-A och laddningsindikator. Ladda laptop, surfplatta och telefon samtidigt. TSA-godkänd.',799.00,'1771874883952_5767.png',29,'2025-06-04'),(76,'Bärbar bildskärm 15.6\" 1080p','Ta med skärmen vart du vill.','IPS, 1920x1080, USB-C och HDMI. Eget stativ och skyddsfodralet ingår. 5ms responstid. Plug-and-play.',2490.00,'1771874186328_2041.jpg',13,'2025-12-08'),(77,'WiFi 6E Router Tri-band','Nästa generations WiFi för hela hemmet.','AXE7800, tri-band, 8 antenner och WPA3. Stöd för 100+ enheter och MU-MIMO. App-baserad hantering.',2990.00,'1770901765585_412.jpg',16,'2025-09-15'),(78,'Mekaniskt tangentbord 60% Wireless','Kompakt trådlöst mekaniskt tangentbord.','Bluetooth 5.2 och 2.4GHz, hot-swap och hot-swappbara Gateron-switchar. 4000mAh batteri och RGB. PBT-keycaps.',1190.00,'1770884270818_1994.png',24,'2025-07-31'),(79,'Ergonomisk kontorsstol Mesh','Andningsbar kontorsstol för långa arbetsdagar.','Mesh-rygg, 4D-armstöd och justerbart lumbalt stöd. Synkronmekanik och svängbar sits. Certifierad för 8h daglig användning.',4490.00,'1771874928778_1836.png',6,'2025-11-10'),(80,'Stationär PC Workstation Ryzen 9','Kraftfull arbetsstation för proffs.','Ryzen 9 7950X, 64GB DDR5, 2TB NVMe och RTX 4080. Windows 11 Pro. Vattenkyld och tyst.',34990.00,'1771873771427_1574.jpg',3,'2025-05-20'),(81,'Nätverkskabel Cat8 5m','Ultrasnabb Ethernet-kabel.','Cat8, 40Gbps, 2000MHz och dubbelt skärmad. Guldpläterade kontakter och robust snäppskydd. 5m längd.',149.00,'1771875487748_4472.png',120,'2025-08-07'),(82,'Trådlös nummerknappsats','Bluetooth nummerknappsats för laptops.','Bluetooth 3.0, uppladdningsbar och kompatibel med Windows/Mac. Siffror, räknefunktioner och Enter-tangent.',299.00,'1770884270818_1994.png',47,'2025-10-19'),(83,'Gaming-mus med RGB 16000 DPI','Precis spelmus med anpassningsbar RGB.','16000 DPI optisk sensor, 8 programmerbara knappar och RGB. Flätad USB-kabel och justerbar vikt. Passar höger- och vänsterhänta.',599.00,'1771874734884_537.png',36,'2025-06-30'),(84,'Kabelhanteringslåda Bambu','Dölj kablar snyggt på skrivbordet.','Bambu med metallbotten, plats för grenuttag och kablar. 30x13x13cm. Naturlig finish och hållbart material.',349.00,'1771875589352_1018.png',55,'2025-09-01'),(85,'In-ear hörlurar True Wireless ANC','Aktiv brusreducering i kompakt format.','Bluetooth 5.2, ANC, transparensläge och 8h batteritid (32h med case). IPX5 och trådlös laddning av case.',1290.00,'1771874796959_6921.png',42,'2025-12-20'),(86,'Skärmskydd för 27\" skärm','Skydda ögonen med blåljusfilter.','Passar 27\" skärmar, reducerar blåljus och reflexer. Enkel montering utan verktyg. Klar och antistatisk yta.',299.00,'1771875686462_1009.png',68,'2025-07-09'),(87,'Digitalt ritplatta A5 med penna','Ritplatta för designers och illustratörer.','8192 trycknivåer, lutningskänslighet och batterifri penna. Plug-and-play USB. Kompatibel med Photoshop, Illustrator m.fl.',899.00,'1771875743213_3439.png',21,'2025-11-02'),(88,'NAS 2-bay med 8TB','Hemmaserver för säker lagring.','2-bay NAS med RAID 0/1, Gigabit Ethernet och mobil-app. Inkl. 2x4TB HDD. Stöd för Plex och Time Machine.',5990.00,'1770901783852_5658.jpg',9,'2025-08-24'),(89,'Projektor Full HD 3500 lumen','Storbildsupplevelse i hemmet.','1920x1080, 3500 lumen och upp till 300\" bild. HDMI, USB och Bluetooth. Inbyggda högtalare och auto-keystone.',6990.00,'1771875043180_8137.png',7,'2025-06-13'),(90,'Mikrofon Arm Justerbar','Bordsmonterat mikrofonarm.','Klämfäste och roterande kulled. Passar mikrofoner upp till 1.5kg. Kabelhantering inbyggd. Stål med svart finish.',499.00,'1771874183292_8952.jpg',38,'2025-10-05'),(91,'Hörlurar On-Ear Bluetooth','Vikbara Bluetooth-hörlurar för resor.','Bluetooth 5.0, 30h batteritid och inbyggd mikrofon. Vikbar design och mjuka kuddar. Stöd för 3.5mm-jack.',899.00,'1770901795770_2451.jpg',27,'2025-07-22'),(92,'Smart LED-glödlampa E27 WiFi','Styr lampan med röst och app.','800 lumen, RGBW, WiFi och app-kontroll. Kompatibel med Alexa, Google Home och HomeKit. 15 000h livslängd.',149.00,'1771875022643_8280.png',94,'2025-09-17'),(93,'Kabellös laddare Qi 15W','Snabbladdning utan kablar.','15W Qi-kompatibel, stöd för MagSafe-kompatibla skal. LED-indikator och säkerhetsskydd mot överhettning.',249.00,'1771874188773_180.jpg',76,'2025-05-06'),(94,'Thunderbolt 4 Kabel 2m','Snabb och kraftfull Thunderbolt 4-kabel.','40Gbps, 100W PD och stöd för dubbla 4K-skärmar. USB4-kompatibel. Flätad nylon och robust kontakter.',449.00,'1771875487748_4472.png',33,'2025-12-11'),(95,'Gaming-skrivbord 160x80cm','Stort skrivbord med kolfiberlook.','MDF-skiva med kolfibermönster, stålben och kabelkanal. Belastning upp till 100kg. Monteringsvänlig design.',2490.00,'1771875896984_2147.png',10,'2025-08-19'),(96,'Bärbar Bluetooth-högtalare 20W','Kraftfullt ljud i kompakt format.','IPX7, 20W stereo, 15h batteritid och inbyggd mikrofon. TWS-parning för stereoeffekt. Laddning via USB-C.',899.00,'1771874821200_6452.png',32,'2025-06-26'),(97,'Mini PC Intel N100','Tyst och energisnål minidator.','Intel N100, 16GB RAM, 512GB SSD och Windows 11 Pro. 4K HDMI, WiFi 6 och Bluetooth 5.2. Perfekt som HTPC eller kontor.',3490.00,'1771876130039_6483.png',18,'2025-11-07'),(98,'Kabelskydd Skrivbord Silikon','Håll kablar organiserade och dolda.','Självhäftande silikonskydd för skrivbordskantar. Passar kablar upp till 10mm. Set om 10 stycken. Svart och vit variant.',99.00,'1771876206348_5609.png',143,'2025-07-03'),(99,'Action Cam 360° 5.7K','Fånga hela världen runt dig.','5.7K 360°-video, 6-axlig bildstabilisering och vattentät till 5m. WiFi och Bluetooth. App för redigering ingår.',3990.00,'1770901769360_8927.jpg',12,'2025-10-30'),(100,'Ergonomisk tangentbordsdyna','Minska belastning på handlederna.','Memory foam med avtagbart tyg. 43x10cm, passar de flesta tangentbord. Halkfri botten och maskintvättbar.',199.00,'1771874174195_1099.jpg',88,'2025-09-12'),(101,'Smart termostat WiFi','Styr värmen hemifrån.','WiFi, touchskärm och veckoschema. Kompatibel med de flesta värmesystem. Energirapporter och geofencing i app.',1290.00,'1771876263145_8327.png',23,'2025-06-09'),(102,'Laptop 15.6\" Intel i5 16GB','Allround-laptop för studier och kontor.','Intel Core i5-1335U, 16GB RAM, 512GB SSD och 15.6\" FHD IPS. Windows 11 Home. WiFi 6 och Bluetooth 5.2. 8h batteritid.',8990.00,'1771874861841_9884.png',14,'2025-12-04'),(103,'Externt DVD-drivenhet USB','Läs och skriv CD/DVD utan intern enhet.','USB 3.0, plug-and-play och kompatibel med Windows/Mac. Smal och lätt design. Stöd för DVD±RW och CD-RW.',299.00,'1771874170453_3366.jpg',41,'2025-08-01'),(104,'Spelmus Pad RGB Extra Large','Extra stor musmatta för gaming-setup.','1200x600mm, tjocklek 4mm och RGB-belysning runt kanten. Halkfri och sömnad kant. USB-kontroll.',549.00,'1771874734884_537.png',26,'2025-07-27'),(105,'Kamera-webbkamera 1080p 60fps','Flytande video i 60fps.','1080p/60fps, autofokus och brusreducerande mikrofon. Klämfäste för skärm eller stativ. Plug-and-play USB-A.',699.00,'1771874906731_4401.png',35,'2025-11-21'),(106,'USB-C till HDMI Adapter 4K','Anslut laptop till skärm eller TV.','USB-C till HDMI 2.0, stöd för 4K/60Hz och HDR. Plug-and-play, inga drivrutiner. Aluminium och 15cm kabel.',199.00,'1770799405749_1478.png',92,'2025-05-16'),(107,'Skrivbordsfläkt tyst USB','Tyst bordsfläkt med USB-anslutning.','3 hastighetsnivåer, 360° rotation och timerfunktion. USB-A, tyst motor under 25dB. Passar kontor och hemmabruk.',249.00,'1771876343441_4658.png',57,'2025-09-28'),(108,'Bärbart batteri MagSafe 5000mAh','Magnetisk powerbank för iPhone.','5000mAh, 7.5W MagSafe och 12W USB-C. Fäster magnetiskt på iPhone 12 och nyare. Smal och lätt design.',599.00,'1770901775538_5834.jpg',44,'2025-08-10'),(109,'Stativ för mikrofon och lampa','Kombinerat stativ för podcast-setup.','Justerbart upp till 210cm, balkfäste för mikrofon och ringlampa. Stål med stabila trefötter. Snabbkoppling.',699.00,'1771874183292_8952.jpg',17,'2025-12-18'),(110,'Smarthögtalare med display 10\"','Smart display för kök och vardagsrum.','WiFi, Bluetooth, 10\" touchskärm och inbyggd Alexa. Videosamtal, recept, kalender och smarthemkontroll.',2490.00,'1771874821200_6452.png',11,'2025-07-16'),(111,'Mekanisk numknappsats RGB','Mekanisk nummerknappsats med RGB.','Gateron Red-switchar, RGB-belysning och aluminiamram. USB-C och N-key rollover. 19 tangenter inklusive Enter.',499.00,'1770884270818_1994.png',29,'2025-10-22'),(112,'Skärm Privacy Filter 27\"','Skydda skärminnehållet från insyn.','Passar 27\" widescreen. Mörkar bilden från sidorna, klar framifrån. Antireflexbeläggning. Enkel att sätta på och ta av.',349.00,'1771874186328_2041.jpg',38,'2025-06-02'),(113,'Laptop Ryzen 5 14\" 2K','Kompakt laptop med skarp skärm.','Ryzen 5 7530U, 16GB RAM, 512GB SSD och 14\" 2560x1600 IPS. WiFi 6 och Bluetooth. 10h batteritid. Aluminium.',9490.00,'1771874861841_9884.png',8,'2025-11-29'),(114,'Ringlampa 26cm med stativ','Perfekt belysning för selfies och videosamtal.','LED, 3 färgtemperaturer, 10 ljusnivåer och 2m stativ. Telefonhållare och fjärrkontroll ingår. USB-drivet.',449.00,'1771876537702_2903.png',51,'2025-08-23'),(115,'Smart dörrklocka WiFi med kamera','Se vem som ringer var du än är.','1080p, rörelsedetektion, tvåvägskommunikation och nattseende. WiFi, app-notiser och molnlagring.',1490.00,'1771876686849_8359.png',19,'2025-07-08'),(116,'USB-C Hub 6-i-1 för MacBook','Utöka din MacBook med fler portar.','HDMI 4K, 3x USB-A, SD/microSD och 100W PD. Aluminium och matchande design för MacBook. Plug-and-play.',499.00,'1771875082266_567.png',62,'2025-10-11'),(117,'Tangentbord och mus trådlöst set','Komplett trådlöst set för kontoret.','2.4GHz, stilla tangentbord och ergonomisk mus. En USB-mottagare för båda. Batteridrift upp till 24 månader.',599.00,'1770884270818_1994.png',46,'2025-09-06'),(118,'Gaming-headset PS5 3D Audio','Optimerat headset för PS5.','Tempest 3D Audio, USB och 3.5mm. Surroundljud och avtagbar mikrofon. Minnesskumkuddar. Fungerar även på PC.',1090.00,'1770901795770_2451.jpg',24,'2025-12-26'),(119,'Bildskärmsarm Single 32\"','Frigjort skrivbord med skärmart.','Passar skärmar upp till 32\" och 9kg. VESA 75/100. Full rörlighet i alla led. Klämfäste eller genomföring.',799.00,'1771874186328_2041.jpg',20,'2025-06-19'),(120,'Nätverksswitch 8-port Gigabit','Utöka nätverket med 8 portar.','8x Gigabit Ethernet, plug-and-play och auto-MDI/MDIX. Tyst utan fläkt. Metallchassi och väggmonterbar.',349.00,'1770901765585_412.jpg',53,'2025-08-14'),(121,'Smartphone Samsung Galaxy A55','Mellanklass med bra kamera.','6.6\" AMOLED, 50MP kamera, 5000mAh och 5G. 8GB RAM och 128GB lagring. IP67 och 4 års OS-uppdateringar.',4990.00,'1771914849819_3697.png',15,'2025-11-13'),(122,'Surfplatta 10.4\" 128GB WiFi','Mångsidig surfplatta för hela familjen.','10.4\" IPS, 128GB, 8GB RAM och 7040mAh batteri. Quad-speaker och stylus-stöd. WiFi 6 och Bluetooth 5.3.',3490.00,'1771914881057_9742.png',22,'2025-07-25'),(123,'Grafikkort RTX 4060 8GB','Spela i 1080p med raytracing.','NVIDIA RTX 4060, 8GB GDDR6, DLSS 3 och AV1-kodning. Dubbla HDMI och DisplayPort. Tyst dual-fan design.',4490.00,'1771874951316_546.png',10,'2025-05-30'),(124,'Processor Intel Core i5-13600K','Kraftfull CPU för gaming och arbete.','14 kärnor (6P+8E), upp till 5.1GHz boost och 24MB cache. LGA1700. Passar Z690/Z790-moderkort.',2990.00,'1771914953875_5079.png',15,'2025-10-17'),(125,'Moderkort ATX Z790 DDR5','Modernt moderkort för Intel 13/14 gen.','LGA1700, DDR5, PCIe 5.0 och WiFi 6E inbyggt. 4x M.2, USB 3.2 Gen 2x2 och Thunderbolt 4.',3490.00,'1771915349160_4524.png',9,'2025-08-06'),(126,'240mm AIO Vätskekylare ARGB','Håll processorn kall med stil.','240mm radiator, ARGB-pump och fläktar. Kompatibel med AM5, AM4 och LGA1700. Magnetisk montage.',890.00,'1771915410093_9745.png',27,'2025-12-09'),(127,'Chassi Mid-Tower ATX Glas','Visa upp bygget med glasfönster.','Härdat glas på sidan, mesh-front och plats för 360mm radiator. ATX, Micro-ATX och ITX. Förinstallerade fläktar.',1290.00,'1770901783852_5658.jpg',13,'2026-01-05'),(128,'SSD 500GB SATA 2.5\"','Uppgradera din gamla laptop eller PC.','500GB SATA SSD med upp till 560 MB/s läshastighet. Drop-säker och energieffektiv. 5 års garanti.',590.00,'1771915046395_969.png',74,'2026-01-12'),(129,'HDD 4TB 3.5\" Desktop','Stor lagring till lågt pris.','4TB, 7200RPM och 256MB cache. SATA III och 5 års garanti. Perfekt för NAS, backup och masslagring.',890.00,'1771915046395_969.png',38,'2025-05-09'),(130,'Trådlös laddningsplatta Qi 10W','Snabb och smidig trådlös laddning.','10W Qi-laddning, LED-indikator och skyddsfunktioner mot överhettning. Passar iPhone och Android. USB-C ingång.',199.00,'1771874188773_180.jpg',87,'2025-09-24'),(131,'Bluetooth-adapter USB 5.3','Ge datorn Bluetooth-stöd.','USB-A Bluetooth 5.3 adapter, plug-and-play och räckvidd upp till 20m. Kompatibel med Windows 10/11.',99.00,'1771915593092_5010.png',116,'2025-08-28'),(132,'Mus ergonomisk vertikal trådbunden','Minska handledsbelastning med trådbunden vertikal mus.','Ergonomisk vertikal design, 6 knappar och DPI 800-3200. USB-A, plug-and-play. Passar höger hand.',399.00,'1771915716902_9739.png',44,'2026-01-19'),(133,'Spelmus RGB 12000 DPI Trådbunden','Precis trådbunden mus för esport.','Optisk sensor 12000 DPI, 6 programmerbara knappar och RGB. Flätad kabel och halkfria sidor. Vikt: 90g.',449.00,'1771874734884_537.png',31,'2025-10-03'),(134,'Bärbar projektor Mini 1080p','Fickprojektor för filmer och presentationer.','1080p, 500 lumen, HDMI och USB-A. Inbyggt batteri för 2h. Bluetooth-högtalare och auto-keystone.',2990.00,'1771915769487_9098.png',8,'2025-07-01'),(135,'Skärmrengöringskit 200ml','Håll skärmen fläckfri.','Alkoholfri lösning, mikrofiberduk och 200ml spray. Passar LCD, OLED, touchskärmar och glasögon.',99.00,'1771915837225_3849.png',151,'2026-01-26'),(136,'Headset USB-C Mono','Enkelt headset för kontorssamtal.','USB-C, enörat och mikrofon med brusreducering. In-line volymkontroll och mute-knapp. Plug-and-play.',349.00,'1771914983344_5177.png',49,'2025-11-16'),(137,'Bärbar SSD 500GB USB-C','Kompakt och snabb portabel lagring.','Upp till 1000 MB/s, USB 3.2 Gen 2 och stöttålig. Passar Mac och PC. Liten som ett kreditkort.',699.00,'1771874170453_3366.jpg',36,'2025-06-23'),(138,'Smart plug WiFi med energimätning','Kontrollera och mät strömförbrukning.','WiFi, app-kontroll och schemaläggning. Mäter effekt och kWh. Kompatibel med Alexa och Google Home.',199.00,'1771875146784_7323.png',73,'2026-02-02'),(139,'Gamingmus Pad RGB Medium 400x350','RGB-musmatta i mellanstorlek.','400x350mm, RGB-kantbelysning och halkfri gummibotten. Sömnad kant och USB-kontroll. 15 RGB-lägen.',299.00,'1770884350099_9239.png',54,'2025-09-19'),(140,'Bärbar Bluetooth-tangentbord Hopfällbart','Fäll ihop tangentbordet och ta det med dig.','Bluetooth 5.1, hopfällbart till fickstorlekformat. 3 månaders batteritid och kompatibel med iOS/Android/Windows.',549.00,'1771916555367_5913.png',28,'2025-08-04'),(141,'Kabelklämmor självhäftande 20-pack','Organisera kablar enkelt.','Självhäftande silikon, passar kablar upp till 8mm. 20 stycken per förpackning. Svart och transparent alternativ.',79.00,'1771916859813_8824.png',198,'2025-12-30'),(142,'4K Webcam med inbyggd ringlampa','Perfekt belysning och bild för videomöten.','4K/30fps, inbyggd ringlampa med 3 färgtemperaturer och autofokus. USB-C och plug-and-play.',1590.00,'1771874906731_4401.png',17,'2026-01-14'),(143,'Skrivbord Höj och sänkbart Elektriskt','Arbeta stående eller sittande.','120x60cm, elektrisk justering 72-120cm, minnesfunktion med 4 positioner. Stålram och MDF-skiva. Max 100kg.',7990.00,'1771916652494_7543.png',6,'2025-07-11'),(144,'HDMI 2.1 Kabel 2m 8K','Framtidssäker HDMI-kabel för 8K och 4K/120Hz.','HDMI 2.1, 48Gbps, stöd för 8K/60Hz och 4K/120Hz. eARC och VRR. Nylon-flätad och guldpläterade kontakter.',149.00,'1771916932093_7655.png',103,'2025-10-28'),(145,'Minneskort microSD 256GB V30','Snabbt minneskort för kameror och telefoner.','UHS-I V30, upp till 100 MB/s läs och 60 MB/s skrivhastighet. Adapter ingår. Livstidsgaranti.',299.00,'1771917012246_9238.png',89,'2025-08-31'),(146,'Skärmstativ Dubbel Monitor Arm','Håll två skärmar i perfekt position.','Passar upp till 2x32\" och 9kg per arm. VESA 75/100. Klämfäste och kabelhantering. Gasfedrad.',1390.00,'1771917719422_5407.png',15,'2025-06-06'),(147,'Router Mesh WiFi 6 3-pack','Täck hela hemmet med snabbt WiFi.','AX1800 tri-pack, självkonfigurerande mesh och app-hantering. Täcker upp till 500m². WPA3 och föräldrakontroll.',3490.00,'1771917310576_6158.png',11,'2025-11-04'),(148,'GPU RTX 4070 Ti Super 16GB','Spela i 4K med hög bildfrekvens.','NVIDIA RTX 4070 Ti Super, 16GB GDDR6X, DLSS 3.5 och raytracing. Tre DisplayPort och ett HDMI.',9990.00,'1771917572580_593.png',4,'2025-09-08'),(149,'Laptop 13\" M3 MacBook Air','Ultrasnabb och tyst laptop utan fläkt.','Apple M3, 8GB RAM, 256GB SSD och 13.6\" Liquid Retina. MagSafe, USB-C och 18h batteritid.',13990.00,'1771917986082_6262.png',7,'2025-12-22'),(150,'Externt ljudkort USB','Förbättra ljudkvaliteten på din dator.','USB, 24-bit/96kHz, 3.5mm-in/out och phantom power. Plug-and-play och kompatibel med Windows/Mac.',599.00,'1771918078901_7965.png',32,'2025-07-18'),(151,'Ergonomisk fotpall kontor','Minska trötthet i benen under långa arbetsdagar.','Justerbar lutning och höjd, masserande yta och halkfri botten. 35x28cm. Svart och grå variant.',349.00,'1771918204040_5206.png',41,'2026-01-21'),(152,'Smart hem gateway Zigbee','Styr alla Zigbee-enheter från ett ställe.','Zigbee 3.0, app-kontroll och lokalt processning utan moln. Ethernet och WiFi. Kompatibel med 2000+ enheter.',699.00,'1771918282183_8028.png',22,'2025-10-09'),(153,'Spelkonsol Handheld Android','Spela dina favoritspel var du vill.','7\" IPS, Android 13, Snapdragon 870 och 6000mAh. Hall-effekt joysticks och triggers. WiFi 6 och Bluetooth 5.2.',4990.00,'1771918369684_2716.png',14,'2025-08-17'),(154,'Kamera Mirrorless 24MP APS-C','Kompakt systemkamera för entusiaster.','24MP APS-C sensor, 4K/30fps video, IBIS och AI-autofokus. Kit med 16-50mm objektiv. WiFi och Bluetooth.',9990.00,'1771918928355_1352.png',6,'2025-05-25'),(155,'Optisk mus trådbunden 1000 DPI','Enkel och pålitlig kontorsmus.','Optisk sensor 1000 DPI, USB-A och symmetrisk design. Tyst och lätt. Plug-and-play utan drivrutiner.',149.00,'1771921888234_1178.png',127,'2025-09-03'),(156,'Knäppsats Numerisk USB','Numerisk knappsats för bärbara datorer.','USB-A, 19 tangenter och halkfria gummifötter. Plug-and-play och bakgrundsbelyst. Passar alla USB-datorer.',199.00,'1771915195860_3149.png',68,'2025-12-16'),(157,'Bildskärm 24\" FHD 75Hz IPS','Budgetskärm för dagligt bruk.','1920x1080, IPS, 75Hz och 5ms. HDMI och VGA. Justerbart stativ och VESA-fäste. Flimmerfri och blåljusfilter.',1990.00,'1771942433521_280.png',25,'2026-01-07'),(158,'Headphones Over-Ear Wired Studio','Referensheadphones för musikproduktion.','40mm drivrutiner, 15-28000Hz och 250 ohm. Avtagbar kabel med 6.35mm adapter. Hopfällbar och mjuka öronkuddar.',1390.00,'1770901795770_2451.jpg',18,'2025-07-04'),(159,'Skärmläsare RFID USB-C','Läs RFID och NFC med din dator.','USB-C, stöd för ISO 14443 A/B och ISO 15693. Plug-and-play. Räckvidd upp till 10cm. Kompakt design.',299.00,'1771942548171_3008.png',37,'2025-10-31'),(160,'Gaming-mus Vertikal Ergonomisk Trådlös','Ergonomisk trådlös spelmus.','2.4GHz, 8000 DPI, 8 programmerbara knappar och RGB. 70h batteritid. Vertikal design för minskad handledsbelastning.',799.00,'1771915716902_9739.png',20,'2025-08-08'),(161,'Kyla pad för laptop 17\"','Kyl ner laptopen under intensivt arbete.','5 fläktar, USB-drivet och LED-belysning. Justerbar höjd och stöd för 10-17\". Tyst motor under 26dB.',349.00,'1771942613002_6641.png',47,'2025-06-15'),(162,'Smarthemkontroll Panel 8-vägs','Centralisera smarthemkontroll i ett panel.','WiFi, 8 strömbrytare och app-kontroll. Sceninprogrammering och schemaläggning. Kompatibel med Alexa och Google.',599.00,'1771943214423_4479.png',26,'2025-11-09'),(163,'USB-A till USB-C Adapter 5-pack','Anslut gamla kablar till nya enheter.','USB-A 3.0 till USB-C adapter, stöd för 5Gbps och 3A. 5-pack. Aluminium och plug-and-play.',99.00,'1771943617627_9831.png',183,'2025-09-26'),(164,'Spelmus RGB Trådbunden 6400 DPI','Pålitlig trådbunden spelmus.','6400 DPI optisk sensor, 6 knappar och RGB-belysning. Flätad USB-kabel och ergonomisk höger-grip. Vikt 95g.',299.00,'1771943806722_1914.png',53,'2025-07-30'),(165,'Bärbar laddningsstation 6-uttag','Ladda alla enheter på ett ställe.','6 AC-uttag och 4 USB-A samt 2 USB-C. Överspänningsskydd och 2m kabel. Kompakt och rese-vänlig.',499.00,'1771875082266_567.png',39,'2025-12-03'),(166,'Surfplatta Kids 8\" 32GB','Robust surfplatta för barn.','8\" IPS, 32GB, stöttåligt fodral och föräldrakontroll. Android 13 Kids, 5000mAh och WiFi. Inkl. styluspen.',1990.00,'1771914881057_9742.png',21,'2026-01-30'),(167,'Bildskärm 32\" 4K 144Hz OLED','Fantastisk OLED-skärm för gaming och kreativt arbete.','3840x2160, OLED, 144Hz, 0.1ms och HDR True Black. USB-C 90W PD, G-Sync och FreeSync Premium Pro.',12990.00,'1771942452172_3497.png',5,'2025-06-27'),(168,'CPU AMD Ryzen 7 7700X','Kraftfull 8-kärnig processor.','8 kärnor, 16 trådar, upp till 5.4GHz boost och 40MB cache. AM5-socket. Passar DDR5 och PCIe 5.0.',2790.00,'1771914953875_5079.png',12,'2025-10-15'),(169,'WiFi 6 PCIe Nätverkskort','Uppgradera stationären med WiFi 6.','AX3000, dual-band, Bluetooth 5.2 och externa antenner. PCIe x1. Plug-and-play med Windows 10/11.',399.00,'1771944679113_7513.png',33,'2025-08-21'),(170,'Tangentbordshandledsskydd Gel','Gel-handledsstöd för tangentbord.','43x10cm, minnesskum med gel-topp. Avtagbart och maskintvättbart tyg. Halkfri botten. Röd.',179.00,'1771944959422_5445.png',94,'2025-05-14'),(171,'Smarthögtalare Mini WiFi','Röststyrd smarthögtalare i miniformat.','WiFi, Bluetooth 5.0 och 360° ljud. Inbyggd Alexa, app-kontroll och smarthemkoppling. 10W effekt.',799.00,'1771945021992_4262.png',30,'2025-11-26'),(172,'USB-C Laddare 100W GaN 4-port','Ladda fyra enheter samtidigt.','100W totalt, 2x USB-C PD och 2x USB-A QC. GaN-teknik och kompakt format. Stöd för laptop, surfplatta och telefon.',699.00,'1771945166534_9930.png',42,'2026-02-08'),(173,'Kamera Dashcam 4K WiFi','Övervaka vägen framför med 4K-kamera.','4K/30fps, WiFi, GPS och parkerings-läge. 140° vidvinkel och nattseende. Loop-inspelning på microSD.',1790.00,'1771945215031_9830.png',18,'2025-07-07'),(174,'Skärm 27\" Curved 1440p 240Hz','Böjd 1440p-skärm för kompetitiv gaming.','2560x1440, VA-panel, 240Hz och 1ms. AMD FreeSync Premium och HDR400. DisplayPort och HDMI.',4490.00,'1771942433521_280.png',10,'2025-09-04'),(175,'Smart vattenkokare WiFi','Koka vatten till exakt rätt temperatur.','WiFi, app-kontroll och 5 temperaturinställningar (60-100°C). 1.7L, 2200W och håll-varm funktion. Rostfritt stål.',899.00,'1771945391215_2465.png',27,'2025-12-13'),(176,'Gaming-headset Trådlöst 2.4GHz','Trådlöst headset med låg latens.','2.4GHz, 30h batteritid, 50mm drivrutiner och avtagbar mikrofon. USB-C laddning och minnesskumkuddar.',1490.00,'1771914983344_5177.png',16,'2025-08-25'),(177,'Micro-ATX Chassi Kompakt','Kompakt chassi för Micro-ATX-byggen.','Glasfönster, mesh-front och plats för 240mm radiator. 2x USB-A, 1x USB-C på fronten. Inkl. 2 fläktar.',890.00,'1771945864452_9922.png',14,'2026-01-16'),(178,'Grafikkort RX 7600 8GB','AMD-GPU för 1080p gaming.','RX 7600, 8GB GDDR6, RDNA 3 och AV1-kodning. Dual HDMI och DisplayPort. Tyst dual-fan design.',3490.00,'1771917572580_593.png',9,'2025-06-11'),(179,'Kabelskyddsslang Spiralband 10m','Bunta ihop och skydda kablar.','Spiralband 10m, passar kablar 6-25mm. Skär till önskad längd. UV-beständig plast. Svart och vit variant.',129.00,'1771948002201_6589.png',167,'2025-10-01'),(180,'Laptop 17.3\" Gaming i7 RTX 4060','Kraftfull gaming-laptop för 1080p.','Intel i7, 16GB DDR5, 1TB NVMe, RTX 4060 och 17.3\" 144Hz FHD. RGB-tangentbord och Windows 11 Home.',16990.00,'1771917936401_9525.png',7,'2025-08-12'),(181,'Tangentbord Membran Tyst Full Size','Tyst membrantangentbord för kontoret.','Tyst membranswitchar, USB-A och sifferknappsats. Spilltålig design och ergonomisk lutning. Plug-and-play.',299.00,'1771916566420_8867.png',78,'2025-11-30'),(182,'Monitor 49\" Super Ultrawide 5K','Omslutande super-ultrawide för proffs.','5120x1440, IPS, 120Hz och HDR600. Inbyggd KVM, USB-C 90W PD och dual 5W-högtalare. Monteringsarm ingår.',17990.00,'1771942452172_3497.png',3,'2025-07-20'),(183,'Smarthems-sensor rörelsedetektor WiFi','Detektera rörelse och få notiser.','WiFi, 120° detektionsvinkel och app-notiser. Batteridrivet 12 månader. Kompatibel med smarthemshubbar.',249.00,'1771948652056_2801.png',61,'2025-09-10'),(184,'Extern GPU-box Thunderbolt','Anslut ett externt grafikkort till din laptop.','Thunderbolt 3/4, 550W PSU och PCIe x16. Passar de flesta eGPU-kompatibla laptops. Aluminium och tyst fläkt.',5990.00,'1771964199451_7856.jpg',5,'2025-12-07'),(185,'Mus Pad Trä Naturlig 400x300','Naturlig träyta som musmatta.','400x300mm, naturligt trä med halkfri gummibotten. Sömnad kant och slät yta för optiska och lasersmöss.',299.00,'1771963818570_4487.jpg',44,'2025-06-01'),(186,'Kabelkanal Skrivbord Plast Vit','Dölj och skydda kablar under skrivbordet.','1m kabelkanal med lock och självhäftande tejp. Klipp till önskad längd. Passar 3-4 standardkablar.',99.00,'1771963649476_2234.png',112,'2025-10-23'),(187,'Smart kylskåpstermometer Bluetooth','Övervaka temperaturen i kylskåp och frys.','Bluetooth, app-larm och historiklogg. Magnetsensor och -30 till +70°C mätområde. 12 månaders batteritid.',199.00,'1771948612995_2129.png',55,'2026-01-03'),(188,'Skärm 24\" FHD 165Hz IPS Gaming','Snabb IPS-panel för esport.','1920x1080, IPS, 165Hz och 1ms. FreeSync Premium och HDR200. HDMI och DisplayPort. Tunn ram.',2490.00,'1771942433521_280.png',19,'2025-08-09'),(189,'Tangentbord Mekaniskt 65% RGB','Kompakt 65% layout med piltangenter.','Gateron Yellow-switchar, RGB och aluminiumram. USB-C avtagbar kabel och PBT keycaps. Hot-swap-socklar.',1090.00,'1771916555367_5913.png',23,'2025-11-15'),(190,'Nätverksswitch 16-port PoE Gigabit','16-portars PoE-switch för kontor och nätverk.','16x Gigabit PoE+, 2x SFP uplink och 250W total PoE. Webgränssnitt och VLAN-stöd. Rack-monterbar.',3990.00,'1771917319584_7627.png',8,'2025-07-13'),(191,'Bärbar skanner A4 USB','Skanna dokument var du vill.','A4, 600 DPI, USB-drivet och plug-and-play. Skannar ett A4 på 4 sekunder. Kompatibel med Windows och Mac.',1290.00,'1771962477990_1447.jpg',17,'2025-09-21'),(192,'Smart hem säkerhetskamera Utomhus','Övervaka utsidan av hemmet dygnet runt.','2K/4MP, IP67, nattseende och rörelsedetektion. WiFi, app-notiser och molnlagring. Solpanel-kompatibel.',1490.00,'1771962481155_3888.jpg',24,'2026-01-24'),(193,'Gaming-mus Ambidextrous RGB 16000 DPI','Symmetrisk spelmus för alla händer.','16000 DPI, RGB, 8 knappar och flätad USB. Passar höger- och vänsterhänta. Optisk sensor med 500IPS.',549.00,'1771921907513_6722.png',36,'2025-06-18'),(194,'Bildskärm 32\" 1440p 75Hz IPS','Stor IPS-skärm för arbete och underhållning.','2560x1440, IPS, 75Hz och 5ms. HDMI, DisplayPort och USB-hubb. Justerbart stativ och VESA 100x100.',3990.00,'1771942452172_3497.png',13,'2025-10-06'),(195,'Powerbank Solar 20000mAh','Ladda med solenergi var du vill.','Solpanel, 20000mAh, USB-C PD och USB-A QC. LED-ficklampa och vattentålig IP65. Perfekt för utomhusbruk.',699.00,'1771962596666_1636.jpg',29,'2025-08-15'),(196,'Konverter DisplayPort till HDMI','Anslut DisplayPort till HDMI-skärm.','DP 1.2 till HDMI 2.0, stöd för 4K/60Hz. Plug-and-play och passiv adapter. Aluminium med 20cm kabel.',149.00,'1771943652166_6753.png',97,'2025-12-19'),(197,'Skrivbordsmikrofon XLR Kondensator','Professionell XLR-mikrofon för studio.','Kardioid kondensatormikrofon, 20Hz-20kHz och -38dB känslighet. Krom finish och shockmount ingår. XLR-anslutning.',1990.00,'1771874183292_8952.jpg',11,'2025-07-23'),(198,'Kabel Optisk Toslink 3m','Digital ljudkabel för hifi och TV.','Toslink optisk kabel 3m, stöd för Dolby Digital och DTS. Guldpläterade kontakter och robust hölje.',99.00,'1771943617627_9831.png',133,'2025-09-29'),(199,'Laptop Sleeve 15.6\" Neopren','Skydda laptopen med mjukt neoprenväska.','15.6\" neopren sleeve med dragkedja och extra ficka. Vatten-resistent och stöttålig. Svart och grå variant.',199.00,'1771962662651_6709.jpg',86,'2026-02-10'),(200,'Smart glödlampa GU10 WiFi RGB','Styr spotlighten med röst och app.','GU10, 5W RGBW, WiFi och app-kontroll. Kompatibel med Alexa och Google Home. 50 000h livslängd.',129.00,'1771875022643_8280.png',108,'2025-07-02'),(201,'Grafikkort RX 7900 XTX 24GB','AMD:s flagship GPU för 4K gaming.','RX 7900 XTX, 24GB GDDR6, RDNA 3 och raytracing. Tre DisplayPort 2.1 och ett HDMI 2.1. Trefläkts design.',12990.00,'1771917596936_9103.png',4,'2025-11-19'),(202,'Mobil tripod Bluetooth-utlösare','Kompakt tripod med Bluetooth-fjärr.','Justerbar 20-160cm, kulled och Bluetooth-utlösare. Passar telefoner och kompaktkameror. Väger 500g.',349.00,'1771962759414_6594.jpg',57,'2025-08-26'),(203,'Bärbar Bluetooth-mus Tyst','Tyst och kompakt mus för resor.','Bluetooth 5.0, 3 anslutningar och tyst klick. 1600 DPI och 12 månaders batteritid. Vikbar design.',399.00,'1771921878013_680.png',45,'2025-06-22'),(204,'Skrivbord Kabeldragning Korg','Organisera kablar under skrivbordet.','Metallkorg med kabelbindare, montering utan verktyg. 50x12cm, max 5kg. Vitt pulverlackat stål.',249.00,'1771962848240_1724.jpg',63,'2025-10-18'),(205,'USB-C Dockningsstation 15-i-1','Komplett arbetsstation via ett USB-C.','Dubbel 4K HDMI, DisplayPort, 4x USB-A, 2x USB-C, SD, Ethernet och 100W PD. Aluminium och plug-and-play.',1690.00,'1771875082266_567.png',16,'2025-12-28'),(206,'Spelkonsol Retro Handheld 10000 spel','Spela klassiska spel från NES, SNES, Mega Drive m.fl.','3.5\" IPS, 10 000+ förinstallerade spel och upp till 64GB microSD. HDMI-utgang och 2 kontroller ingår.',699.00,'1771918369684_2716.png',33,'2025-09-07'),(207,'Trådlösa hörlurar Neckband ANC','ANC-hörlurar med bekvämt neckband.','Hybrid ANC, 16h batteritid och magnetiska öronproppar. Bluetooth 5.0 och inbyggd mikrofon. IPX4.',799.00,'1771962930450_827.jpg',28,'2025-07-17'),(208,'WiFi-extender AX1800','Förstärk WiFi-signalen i hela hemmet.','AX1800, dual-band och mesh-kompatibel. Gigabit Ethernet-port och app-hantering. Räckvidd upp till 120m².',599.00,'1771917327858_8994.png',37,'2026-01-10'),(209,'Bärbar HDD 5TB USB-C','Stor portabel lagring för backup och media.','5TB, USB 3.0 och USB-C-kabel ingår. Självdrivande och drop-testad. 3 års garanti.',1290.00,'1771874170453_3366.jpg',22,'2025-08-19'),(210,'Gaming-stol LED RGB','Spelstol med inbyggd RGB-belysning.','PU-läder, RGB ländryggsbelysning, 4D-armstöd och nackdyna. Max 150kg. Fjärrkontroll för RGB.',3990.00,'1771874928778_1836.png',7,'2025-11-23'),(211,'Kabelbox Bambu XL','Stor bambulåda för kablar och grenuttag.','38x19x14cm, naturlig bambu och metalllock. Tre kabelingångar. Döljer upp till 2m kabel och grenuttag.',449.00,'1771875589352_1018.png',31,'2025-06-07'),(212,'Smart dörrsensor WiFi','Få notis när dörren öppnas.','WiFi, magnetisk sensor och app-larm. Batteridrivet 12 månader. Kompatibel med smarthemshubbar och Alexa.',199.00,'1771948652056_2801.png',73,'2025-10-24'),(213,'Bildskärm 27\" 1080p 240Hz IPS','Snabb IPS-skärm för esport på budget.','1920x1080, IPS, 240Hz och 1ms. FreeSync och HDMI/DP. Tunn ram och tiltjusterbar fot.',2990.00,'1771942452172_3497.png',18,'2025-08-02'),(214,'CPU-kylare Luftkyld Tower 280W TDP','Stor tornkylare för kraftiga processorer.','280W TDP, dubbla 140mm fläktar och nickelpläteradekopparrör. Kompatibel med AM5, AM4 och LGA1700. Tyst.',790.00,'1771915440952_7077.png',21,'2025-12-24'),(215,'Smarthemkontroll Infraröd WiFi','Styr TV, AC och annat med IR via appen.','WiFi IR-sändare, app-kontroll och scenprogrammering. Kompatibel med de flesta IR-enheter. Alexa/Google.',299.00,'1771918282183_8028.png',48,'2025-07-06'),(216,'Tangentbord Trådlöst Ergonomisk Delat','Delat ergonomiskt tangentbord för bättre hållning.','Bluetooth 5.0, delad design och handledsstöd ingår. 6 månaders batteritid. Passar Windows och Mac.',1490.00,'1771916566420_8867.png',13,'2025-09-16'),(217,'USB 3.0 Minnessticka 256GB','Snabb USB-sticka för dataöverföring.','USB 3.0, upp till 100 MB/s och retraktabel kontakt. 256GB. Kompatibel med PC, Mac och TV.',199.00,'1771915593092_5010.png',121,'2026-01-28'),(218,'Bildskärm 32\" 4K 60Hz IPS','Stor 4K-skärm för produktivitet.','3840x2160, IPS, 60Hz och 99% sRGB. HDMI, DisplayPort och USB-C. Justerbart stativ och HDR400.',5490.00,'1771942433521_280.png',11,'2025-06-28'),(219,'Kamera Webcam 720p Clip','Enkel webbkamera för videosamtal.','720p/30fps, klämfäste och plug-and-play USB-A. Inbyggd mikrofon. Passar bärbara och stationära datorer.',199.00,'1771874906731_4401.png',94,'2025-10-13'),(220,'Spiralnotebook Digitalt Smart','Digitalisera handskrivna anteckningar direkt.','Smart penna, A5-block och app för iOS/Android. Synka anteckningar till Evernote, OneNote och Google Drive.',1190.00,'1771963214828_2266.jpg',20,'2025-08-22'),(221,'Smartklocka Sport GPS 2 veckor','GPS-klocka för löpning och cykling.','GPS, puls, syresensor och 14 dagars batteritid. Vattentålig 5ATM och 50+ sportlägen. iOS och Android.',2990.00,'1771963249323_5575.jpg',16,'2025-11-08'),(222,'Trådlös laddningsplatta Dubbel','Ladda två enheter trådlöst samtidigt.','2x 10W Qi, kompakt design och LED-indikator. Passar iPhone och Android. USB-C-ingång och adapter ingår.',349.00,'1771874188773_180.jpg',52,'2025-07-12'),(223,'Nätverks-KVM Switch 4-port HDMI','Styr 4 datorer med en skärm och tangentbord.','4-port HDMI KVM, USB 2.0 och hotkey-switching. 4K/30Hz stöd. Kablar ingår.',1490.00,'1771917327858_8994.png',9,'2025-12-05'),(224,'Laptop Sleeve 13\" Canvas','Tygväska för 13\" laptop.','Canvas med dragkedja och extra ficka. Passar 13\" MacBook och PC-laptops. Vatten-resistent material.',179.00,'1771962662651_6709.jpg',67,'2026-02-14'),(225,'SSD M.2 NVMe 2TB Gen3','Stor och snabb M.2-lagring.','Upp till 3500 MB/s läshastighet, Gen3 PCIe och fem års garanti. Passar de flesta moderna moderkort.',1490.00,'1770901787682_3558.jpg',26,'2025-08-30'),(226,'Bärbar Bluetooth-högtalare Vattentålig 10W','Kompakt vattentålig högtalare.','IPX6, 10W, 12h batteritid och Bluetooth 5.0. Inbyggd mikrofon och USB-C-laddning. Karabinkrok ingår.',599.00,'1771945046753_2202.png',43,'2025-06-16'),(227,'Grafikkort GTX 1660 Super 6GB','Prisvärd GPU för 1080p gaming.','GTX 1660 Super, 6GB GDDR6 och HDMI/DP/DVI. Tyst dual-fan design. Perfekt budget-GPU för 1080p.',1990.00,'1771917572580_593.png',11,'2025-10-20'),(228,'Smart brevlådesensor WiFi','Få notis när posten kommer.','WiFi-sensor, magnetisk och batteridrivet 18 månader. App-notiser och kompatibel med smarthemshubbar.',249.00,'1771963332507_4107.jpg',49,'2025-09-14'),(229,'In-ear Kabel Hörlurar 3.5mm Hi-Fi','Balanserat Hi-Fi-ljud med kabel.','10mm dynamic driver, 3.5mm L-jack och mikrofon. 1.2m flätad kabel. Inkl. 6 öronproppar i olika storlekar.',249.00,'1771962930450_827.jpg',82,'2025-07-26'),(230,'USB-A till Ethernet Adapter','Anslut till kabelnat via USB-A.','USB 3.0 till Gigabit Ethernet, plug-and-play och kompatibel med Windows/Mac/Linux. Aluminium.',199.00,'1771917077313_6731.png',77,'2025-12-17'),(231,'Smart innomhuskamera 2K Pan-Tilt','Övervaka hemmet med rörlig kamera.','2K, 360° pan och 90° tilt, rörelsespårning och nattseende. WiFi, app och tvåvägskommunikation.',799.00,'1771963395202_7215.jpg',28,'2026-01-22'),(232,'Minneskort SD 64GB V60','Snabbt SD-kort för kameror.','UHS-II V60, upp till 280 MB/s läs och 100 MB/s skrivhastighet. 64GB. Passar mirrorless och DSLR.',399.00,'1771917022151_3247.png',61,'2025-08-05'),(233,'Spelstol barnstorlek RGB','Ergonomisk spelstol för barn 120-160cm.','Justerbar höjd och armstöd, RGB-belysning och nackdyna. PU-läder och max 80kg. Hopfällbar design.',1990.00,'1771963546634_6245.png',12,'2025-11-01'),(234,'Bärbar Bluetooth-mus 3-knapp','Enkel trådlös mus för resor.','Bluetooth 5.0, 3 knappar och 1200 DPI. 12 månaders batteritid. Ultra-kompakt och passar alla laptops.',249.00,'1771921920797_5039.png',69,'2025-06-24'),(235,'Skärm Arm Single Gasfedrad','Gasfedrad skärmarm för enkel justering.','Passar skärmar 17-32\" och upp till 9kg. VESA 75/100. 360° rotation, tilt och swivel. Klämfäste.',699.00,'1771963454239_5263.jpg',22,'2025-09-25'),(236,'Laptop 13\" Ryzen 5 OLED 2.8K','Kompakt laptop med OLED-skärm.','Ryzen 5 7530U, 16GB RAM, 512GB SSD och 13.3\" 2880x1800 OLED. 10h batteritid och WiFi 6.',11990.00,'1771917917932_7640.png',8,'2025-12-31');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_categories`
--

DROP TABLE IF EXISTS `products_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_categories` (
  `products_id` int(11) NOT NULL,
  `categories_id` int(11) NOT NULL,
  PRIMARY KEY (`products_id`,`categories_id`),
  KEY `fk_products_categories_products1_idx` (`products_id`),
  KEY `fk_products_categories_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_products_categories_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_products_categories_products1` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_categories`
--

LOCK TABLES `products_categories` WRITE;
/*!40000 ALTER TABLE `products_categories` DISABLE KEYS */;
INSERT INTO `products_categories` VALUES (32,23),(32,24),(32,25),(33,23),(33,24),(34,23),(34,26),(35,23),(35,24),(35,114),(36,27),(36,28),(37,27),(37,29),(38,23),(38,30),(38,31),(39,23),(39,32),(39,34),(40,23),(40,32),(40,33),(41,35),(41,36),(42,39),(43,23),(43,40),(44,41),(44,42),(45,43),(45,44),(52,24),(52,25),(53,24),(53,46),(54,26),(54,118),(55,41),(55,133),(56,31),(57,121),(58,112),(59,124),(60,153),(61,149),(62,33),(63,111),(64,110),(65,120),(66,26),(67,141),(68,138),(69,115),(70,152),(71,147),(72,138),(73,25),(74,142),(75,140),(76,119),(77,44),(78,25),(79,151),(80,112),(81,132),(82,37),(83,46),(84,153),(85,28),(86,24),(87,117),(88,128),(89,157),(90,120),(91,28),(92,142),(93,141),(94,155),(95,148),(96,29),(97,113),(98,153),(99,42),(100,153),(101,143),(102,40),(103,30),(104,153),(105,133),(106,156),(107,153),(108,140),(109,120),(110,144),(111,25),(112,24),(113,40),(114,152),(115,136),(116,115),(116,156),(117,25),(117,46),(118,121),(119,116),(120,129),(121,38),(122,38),(123,107),(124,108),(125,109),(126,111),(127,34),(128,123),(129,125),(130,141),(131,156),(132,46),(133,46),(134,157),(135,24),(136,121),(137,124),(138,145),(139,153),(140,25),(141,153),(142,133),(143,150),(144,154),(145,126),(146,116),(147,44),(148,107),(149,40),(150,122),(151,153),(152,145),(153,146),(154,135),(155,46),(156,156),(157,26),(158,28),(159,24),(160,46),(161,139),(162,145),(163,155),(164,46),(165,39),(166,38),(167,26),(168,108),(169,131),(170,153),(171,144),(172,39),(173,134),(174,118),(175,24),(176,121),(177,34),(178,107),(179,24),(180,40),(181,25),(182,118),(183,143),(184,24),(185,153),(186,153),(187,143),(188,26),(189,25),(190,129),(191,24),(192,136),(193,46),(194,26),(195,140),(196,156),(197,120),(198,24),(199,137),(200,142),(201,107),(202,37),(203,46),(204,153),(205,114),(206,146),(207,28),(208,130),(209,125),(210,147),(211,153),(212,143),(213,26),(214,111),(215,145),(216,25),(217,127),(218,26),(219,133),(220,37),(221,36),(222,141),(223,129),(224,137),(225,31),(226,29),(227,107),(228,143),(229,28),(230,156),(231,136),(232,126),(233,147),(234,46),(235,116),(236,40);
/*!40000 ALTER TABLE `products_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_filters`
--

DROP TABLE IF EXISTS `products_filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_filters` (
  `filters_id` int(11) NOT NULL,
  `products_id` int(11) NOT NULL,
  `int_value` int(11) DEFAULT NULL,
  `str_value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`filters_id`,`products_id`),
  KEY `fk_products_filters_filters1_idx` (`filters_id`),
  KEY `fk_products_filters_products1_idx` (`products_id`),
  CONSTRAINT `fk_products_filters_filters1` FOREIGN KEY (`filters_id`) REFERENCES `filters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_products_filters_products1` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_filters`
--

LOCK TABLES `products_filters` WRITE;
/*!40000 ALTER TABLE `products_filters` DISABLE KEYS */;
INSERT INTO `products_filters` VALUES (1,40,32,NULL),(1,43,16,NULL),(1,58,32,NULL),(1,62,16,NULL),(1,80,64,NULL),(1,97,16,NULL),(1,102,16,NULL),(1,113,16,NULL),(1,121,8,NULL),(1,122,8,NULL),(1,123,8,NULL),(1,148,16,NULL),(1,149,8,NULL),(1,153,12,NULL),(1,178,8,NULL),(1,180,16,NULL),(1,201,24,NULL),(1,227,6,NULL),(1,236,16,NULL),(2,34,27,NULL),(2,43,14,NULL),(2,54,34,NULL),(2,66,27,NULL),(2,76,15,NULL),(2,86,27,NULL),(2,102,15,NULL),(2,112,27,NULL),(2,113,14,NULL),(2,119,32,NULL),(2,121,6,NULL),(2,122,10,NULL),(2,149,13,NULL),(2,153,7,NULL),(2,157,24,NULL),(2,166,8,NULL),(2,167,32,NULL),(2,174,27,NULL),(2,180,17,NULL),(2,182,49,NULL),(2,188,24,NULL),(2,194,32,NULL),(2,199,15,NULL),(2,206,3,NULL),(2,213,27,NULL),(2,218,32,NULL),(2,224,13,NULL),(2,236,13,NULL),(4,41,NULL,'Android'),(4,43,NULL,'Windows'),(4,58,NULL,'Windows'),(4,80,NULL,'Windows'),(4,97,NULL,'Windows'),(4,102,NULL,'Windows'),(4,113,NULL,'Windows'),(4,121,NULL,'Android'),(4,122,NULL,'Android'),(4,149,NULL,'IOS'),(4,153,NULL,'Android'),(4,166,NULL,'Android'),(4,180,NULL,'Windows'),(4,220,NULL,'Android'),(4,236,NULL,'Windows'),(5,38,2000,NULL),(5,43,1000,NULL),(5,56,1000,NULL),(5,58,1000,NULL),(5,59,2000,NULL),(5,80,2000,NULL),(5,88,8000,NULL),(5,97,512,NULL),(5,102,512,NULL),(5,113,512,NULL),(5,121,128,NULL),(5,122,128,NULL),(5,128,500,NULL),(5,129,4000,NULL),(5,137,500,NULL),(5,145,256,NULL),(5,149,256,NULL),(5,153,256,NULL),(5,166,32,NULL),(5,180,1000,NULL),(5,206,64,NULL),(5,209,5000,NULL),(5,217,256,NULL),(5,225,2000,NULL),(5,232,64,NULL),(5,236,512,NULL),(6,33,NULL,'Bluetooth 4.2'),(6,36,NULL,'Bluetooth 5'),(6,53,NULL,'2.4GHz'),(6,61,NULL,'Trådad'),(6,73,NULL,'Trådad'),(6,74,NULL,'Trådad'),(6,78,NULL,'Trådad'),(6,82,NULL,'Bluetooth 3'),(6,85,NULL,'Bluetooth 3'),(6,91,NULL,'Bluetooth 3'),(6,92,NULL,'Bluetooth 3'),(6,96,NULL,'Trådad'),(6,99,NULL,'Trådad'),(6,101,NULL,'Bluetooth 3'),(6,102,NULL,'Trådad'),(6,110,NULL,'Trådad'),(6,115,NULL,'Bluetooth 3'),(6,117,NULL,'2.4GHz'),(6,121,NULL,'Bluetooth 5'),(6,122,NULL,'Bluetooth 5'),(6,131,NULL,'Bluetooth 5'),(6,140,NULL,'Bluetooth 5'),(6,152,NULL,'Bluetooth 5'),(6,153,NULL,'Bluetooth 5'),(6,154,NULL,'Bluetooth 5'),(6,160,NULL,'2.4GHz'),(6,162,NULL,'Wifi'),(6,166,NULL,'Bluetooth 3'),(6,171,NULL,'Bluetooth 3'),(6,173,NULL,'Bluetooth 5'),(6,175,NULL,'Wifi'),(6,176,NULL,'2.4GHz'),(6,183,NULL,'Wifi'),(6,187,NULL,'Bluetooth 2.1'),(6,192,NULL,'Trådad'),(6,200,NULL,'Bluetooth 3'),(6,202,NULL,'Bluetooth 3'),(6,203,NULL,'Wifi'),(6,207,NULL,'Bluetooth 5'),(6,212,NULL,'Bluetooth 4.2'),(6,215,NULL,'Bluetooth 4.2'),(6,216,NULL,'Bluetooth 5'),(6,221,NULL,'Bluetooth 4.2'),(6,226,NULL,'Bluetooth 2.1'),(6,228,NULL,'Bluetooth 2.1'),(6,231,NULL,'Bluetooth 2.1'),(6,234,NULL,'Bluetooth 2.1'),(7,34,144,NULL),(7,54,165,NULL),(7,66,60,NULL),(7,76,60,NULL),(7,157,75,NULL),(7,167,144,NULL),(7,174,240,NULL),(7,180,144,NULL),(7,182,120,NULL),(7,188,165,NULL),(7,194,75,NULL),(7,213,240,NULL),(7,218,60,NULL),(8,32,NULL,'USB-C'),(8,34,NULL,'HDMI'),(8,35,NULL,'USB-C'),(8,38,NULL,'PCIe'),(8,42,NULL,'USB-C'),(8,43,NULL,'HDMI'),(8,52,NULL,'USB-C'),(8,54,NULL,'USB-C'),(8,55,NULL,'USB-C'),(8,56,NULL,'M.2'),(8,57,NULL,'USB-A'),(8,59,NULL,'USB-C'),(8,60,NULL,'USB-A'),(8,65,NULL,'USB-A'),(8,66,NULL,'USB-C'),(8,69,NULL,'USB-A'),(8,70,NULL,'USB-A'),(8,76,NULL,'USB-C'),(8,83,NULL,'USB-A'),(8,87,NULL,'USB-A'),(8,103,NULL,'USB-A'),(8,105,NULL,'USB-A'),(8,106,NULL,'HDMI'),(8,107,NULL,'USB-A'),(8,109,NULL,'XLR'),(8,111,NULL,'USB-C'),(8,114,NULL,'USB-A'),(8,116,NULL,'USB-C'),(8,118,NULL,'USB-A'),(8,123,NULL,'PCIe'),(8,125,NULL,'PCIe'),(8,128,NULL,'PCIe'),(8,129,NULL,'PCIe'),(8,130,NULL,'USB-C'),(8,131,NULL,'USB-A'),(8,132,NULL,'USB-A'),(8,133,NULL,'USB-A'),(8,136,NULL,'USB-C'),(8,137,NULL,'USB-C'),(8,142,NULL,'USB-C'),(8,144,NULL,'HDMI'),(8,148,NULL,'PCIe'),(8,150,NULL,'USB-A'),(8,155,NULL,'USB-A'),(8,156,NULL,'USB-A'),(8,158,NULL,'PCIe'),(8,159,NULL,'USB-C'),(8,163,NULL,'USB-A'),(8,164,NULL,'USB-A'),(8,167,NULL,'USB-C'),(8,169,NULL,'PCIe'),(8,178,NULL,'PCIe'),(8,181,NULL,'USB-A'),(8,182,NULL,'USB-C'),(8,184,NULL,'PCIe'),(8,189,NULL,'USB-C'),(8,191,NULL,'USB-A'),(8,193,NULL,'USB-A'),(8,196,NULL,'HDMI'),(8,197,NULL,'XLR'),(8,198,NULL,'TosLink'),(8,201,NULL,'PCIe'),(8,205,NULL,'USB-C'),(8,209,NULL,'USB-C'),(8,217,NULL,'USB-A'),(8,218,NULL,'USB-C'),(8,219,NULL,'USB-A'),(8,225,NULL,'DisplayPort'),(8,227,NULL,'PCIe'),(8,229,NULL,'DisplayPort'),(8,230,NULL,'USB-A'),(9,37,30,NULL),(9,64,850,NULL),(9,67,15,NULL),(9,74,24,NULL),(9,75,65,NULL),(9,92,9,NULL),(9,93,15,NULL),(9,96,20,NULL),(9,108,7,NULL),(9,110,10,NULL),(9,123,115,NULL),(9,130,10,NULL),(9,143,400,NULL),(9,148,285,NULL),(9,161,10,NULL),(9,165,65,NULL),(9,171,10,NULL),(9,172,100,NULL),(9,175,2200,NULL),(9,178,165,NULL),(9,195,18,NULL),(9,200,5,NULL),(9,201,355,NULL),(9,205,100,NULL),(9,214,280,NULL),(9,222,10,NULL),(9,226,10,NULL),(9,227,125,NULL),(10,40,NULL,'2'),(10,62,NULL,'2'),(12,44,60,NULL),(12,55,30,NULL),(12,89,60,NULL),(12,99,60,NULL),(12,105,60,NULL),(12,134,30,NULL),(12,142,30,NULL),(12,154,30,NULL),(12,173,30,NULL),(12,219,30,NULL),(13,44,8,NULL),(13,54,4,NULL),(13,55,4,NULL),(13,115,2,NULL),(13,154,24,NULL),(13,192,4,NULL),(13,231,4,NULL),(14,45,3000,NULL),(14,77,7800,NULL),(14,81,40000,NULL),(14,88,1000,NULL),(14,120,1000,NULL),(14,147,1800,NULL),(14,190,1000,NULL),(14,208,1800,NULL),(15,45,NULL,'Wi-Fi 6'),(15,77,NULL,'IEEE 802.11g'),(15,138,NULL,'Wi-Fi 6'),(15,147,NULL,'IEEE 802.11b'),(15,162,NULL,'Wi-Fi 6E'),(15,169,NULL,'IEEE 802.11b'),(15,175,NULL,'IEEE 802.11ac'),(15,183,NULL,'IEEE 802.11n'),(15,208,NULL,'IEEE 802.11'),(16,52,950,NULL),(16,53,85,NULL),(16,57,350,NULL),(16,68,600,NULL),(16,71,25000,NULL),(16,83,95,NULL),(16,118,300,NULL),(16,119,9,NULL),(16,132,130,NULL),(16,133,90,NULL),(16,155,80,NULL),(16,158,270,NULL),(16,160,120,NULL),(16,164,95,NULL),(16,176,300,NULL),(16,185,400,NULL),(16,193,85,NULL),(16,229,20,NULL),(16,235,9,NULL),(17,53,70,NULL),(17,61,20,NULL),(17,85,8,NULL),(17,91,30,NULL),(17,96,15,NULL),(17,102,8,NULL),(17,113,10,NULL),(17,134,2,NULL),(17,149,18,NULL),(17,153,8,NULL),(17,160,70,NULL),(17,176,30,NULL),(17,207,16,NULL),(17,221,14,NULL),(17,226,12,NULL),(17,236,10,NULL),(19,69,NULL,'8'),(19,116,NULL,'6'),(19,120,NULL,'8'),(19,165,NULL,'6'),(19,172,NULL,'4'),(19,190,NULL,'4'),(19,205,NULL,'12'),(19,223,NULL,'4'),(20,54,NULL,'VA'),(20,66,NULL,'IPS'),(20,76,NULL,'IPS'),(20,113,NULL,'IPS'),(20,157,NULL,'IPS'),(20,167,NULL,'OLED'),(20,174,NULL,'VA'),(20,180,NULL,'IPS'),(20,182,NULL,'IPS'),(20,188,NULL,'IPS'),(20,194,NULL,'IPS'),(20,213,NULL,'IPS'),(20,218,NULL,'IPS'),(20,236,NULL,'OLED'),(21,52,NULL,'Cherry MX Red'),(21,78,NULL,'Gateron Red'),(21,111,NULL,'Gateron Red'),(21,181,NULL,'Membran'),(21,189,NULL,'Gateron Yellow'),(22,52,NULL,'Full Size'),(22,73,NULL,'Full Size'),(22,78,NULL,'60%'),(22,117,NULL,'Full Size'),(22,125,NULL,'ATX'),(22,127,NULL,'ATX'),(22,140,NULL,'60%'),(22,177,NULL,'Micro-ATX'),(22,181,NULL,'Full Size'),(22,189,NULL,'65%'),(22,216,NULL,'Full Size'),(23,58,NULL,'Intel Core i7'),(23,80,NULL,'AMD Ryzen 9'),(23,97,NULL,'Intel N100'),(23,102,NULL,'Intel Core i5'),(23,113,NULL,'AMD Ryzen 5'),(23,124,NULL,'Intel Core i5'),(23,149,NULL,'Apple M3'),(23,168,NULL,'AMD Ryzen 7'),(23,180,NULL,'Intel Core i7'),(23,236,NULL,'AMD Ryzen 5'),(24,58,16,NULL),(24,80,16,NULL),(24,124,14,NULL),(24,168,8,NULL),(25,124,5,NULL),(25,168,5,NULL),(26,63,250,NULL),(26,124,125,NULL),(26,126,280,NULL),(26,168,105,NULL),(26,214,280,NULL),(27,75,26800,NULL),(27,108,5000,NULL),(27,195,20000,NULL),(28,56,7000,NULL),(28,59,1050,NULL),(28,128,560,NULL),(28,137,1000,NULL),(28,145,100,NULL),(28,217,100,NULL),(28,225,3500,NULL),(28,232,280,NULL),(29,53,25600,NULL),(29,83,16000,NULL),(29,132,3200,NULL),(29,133,12000,NULL),(29,155,1000,NULL),(29,160,8000,NULL),(29,164,6400,NULL),(29,193,16000,NULL),(29,203,1600,NULL),(29,234,1200,NULL),(30,70,500,NULL),(30,89,3500,NULL),(30,92,800,NULL),(30,134,500,NULL),(30,200,400,NULL),(31,54,1,NULL),(31,157,5,NULL),(31,167,1,NULL),(31,174,1,NULL),(31,188,1,NULL),(31,194,5,NULL),(31,213,1,NULL),(32,85,NULL,'IPX5'),(32,99,NULL,'IPX7'),(32,121,NULL,'IP67'),(32,192,NULL,'IP67'),(32,195,NULL,'IP65'),(32,207,NULL,'IPX4'),(32,221,NULL,'IP67'),(32,226,NULL,'IPX6'),(33,32,NULL,'Ja'),(33,52,NULL,'Ja'),(33,53,NULL,'Ja'),(33,58,NULL,'Ja'),(33,60,NULL,'Ja'),(33,63,NULL,'Ja'),(33,66,NULL,'Ja'),(33,74,NULL,'Ja'),(33,78,NULL,'Ja'),(33,83,NULL,'Ja'),(33,92,NULL,'Ja'),(33,104,NULL,'Ja'),(33,111,NULL,'Ja'),(33,126,NULL,'Ja'),(33,133,NULL,'Ja'),(33,139,NULL,'Ja'),(33,160,NULL,'Ja'),(33,164,NULL,'Ja'),(33,180,NULL,'Ja'),(33,189,NULL,'Ja'),(33,193,NULL,'Ja'),(33,200,NULL,'Ja'),(33,210,NULL,'Ja'),(33,218,NULL,'Ja'),(33,233,NULL,'Ja'),(34,94,200,NULL),(34,131,2000,NULL),(34,179,1000,NULL),(34,186,100,NULL);
/*!40000 ALTER TABLE `products_filters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `products_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`products_id`,`users_id`),
  KEY `fk_reviews_products1_idx` (`products_id`),
  KEY `fk_reviews_users1_idx` (`users_id`),
  CONSTRAINT `fk_reviews_products1` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_reviews_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userdata`
--

DROP TABLE IF EXISTS `userdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userdata` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_userdata_users1_idx` (`user_id`),
  CONSTRAINT `fk_userdata_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdata`
--

LOCK TABLES `userdata` WRITE;
/*!40000 ALTER TABLE `userdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `userdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registered` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-26 13:41:16
