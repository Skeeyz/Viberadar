-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2026 at 03:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `viberadar_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') DEFAULT 'movie',
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `tmdb_id`, `media_type`, `added_at`) VALUES
(1, 1, 872585, 'movie', '2026-03-28 14:43:46'),
(2, 1, 569094, 'movie', '2026-03-28 14:43:46'),
(3, 1, 603692, 'movie', '2026-03-28 14:43:46'),
(4, 1, 671, 'movie', '2026-03-28 14:43:46'),
(5, 1, 1396, 'tv', '2026-03-28 14:43:46'),
(6, 1, 155, 'movie', '2026-03-28 14:43:46'),
(7, 1, 27205, 'movie', '2026-03-28 14:43:46'),
(8, 1, 667538, 'movie', '2026-03-28 14:43:46'),
(9, 1, 718930, 'movie', '2026-03-28 14:43:46'),
(10, 1, 912649, 'movie', '2026-03-28 14:43:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `created_at`) VALUES
(1, 'Skeeyzi', 'admin@viberadar.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=1', '2026-03-28 14:43:46'),
(2, 'Hoàng Nam', 'nam.hoang@sgu.edu.vn', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=2', '2026-03-28 14:43:46'),
(3, 'Minh Thư', 'thu.minh@gmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=3', '2026-03-28 14:43:46'),
(4, 'Thành Đạt', 'dat.thanh@outlook.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=4', '2026-03-28 14:43:46'),
(5, 'Khánh Linh', 'linh.khanh@viberadar.io', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=5', '2026-03-28 14:43:46'),
(6, 'Tuấn Kiệt', 'kiet.tuan@yahoo.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=6', '2026-03-28 14:43:46'),
(7, 'Bảo Ngọc', 'ngoc.bao@sgu.vn', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=7', '2026-03-28 14:43:46'),
(8, 'Hữu Phước', 'phuoc.huu@hotmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=8', '2026-03-28 14:43:46'),
(9, 'Thùy Dương', 'duong.thuy@gmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=9', '2026-03-28 14:43:46'),
(10, 'Quốc Bảo', 'bao.quoc@viberadar.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=10', '2026-03-28 14:43:46');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) NOT NULL,
  `media_type` enum('movie','tv') DEFAULT 'movie',
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `user_id`, `tmdb_id`, `media_type`, `added_at`) VALUES
(1, 1, 157336, 'movie', '2026-03-28 14:43:46'),
(2, 1, 299536, 'movie', '2026-03-28 14:43:46'),
(3, 1, 496243, 'movie', '2026-03-28 14:43:46'),
(4, 1, 13, 'movie', '2026-03-28 14:43:46'),
(5, 1, 76600, 'movie', '2026-03-28 14:43:46'),
(6, 1, 438631, 'movie', '2026-03-28 14:43:46'),
(7, 1, 670292, 'movie', '2026-03-28 14:43:46'),
(8, 1, 940721, 'movie', '2026-03-28 14:43:46'),
(9, 1, 1011985, 'movie', '2026-03-28 14:43:46'),
(10, 1, 823464, 'movie', '2026-03-28 14:43:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
