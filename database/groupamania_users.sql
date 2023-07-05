-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: groupamania
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profileImg` varchar(255) DEFAULT ' http://localhost:3000/images/profile.png',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `followers` int DEFAULT '0',
  `following` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `name_31` (`name`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `name_32` (`name`),
  UNIQUE KEY `email_31` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,' http://localhost:3000/images/profile.png','ryan','ryanmambou@gmail.com','$2b$10$f7jIDNOCveLpiuE2GdnW9OnFXJssyxCDfkC3eG260Ou0MbFcoMble',1,1,'2023-04-18 03:59:27','2023-04-18 04:05:37'),(2,' http://localhost:3000/images/profile.png','eren','erenyaeger@gmail.com','$2b$10$LBueLYlIlvYH70zGuavGluF2Eqd..EzQmVdF7QGKhqVVcFOzAFeJW',1,1,'2023-04-18 04:00:24','2023-04-18 04:05:37'),(3,' http://localhost:3000/images/profile.png','ahmat','aadoum042@gmail.com','$2b$10$OXmM3MKq/LIIFpbFE63iRuWu/2bHWNuaPqWZdGm7.TaKnbqtVZWO.',0,0,'2023-06-15 07:58:27','2023-06-15 07:58:27');
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

-- Dump completed on 2023-07-05 10:01:13
