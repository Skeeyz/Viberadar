CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `favorites` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `tmdb_id` INT NOT NULL,
  `media_type` ENUM ('movie', 'tv') DEFAULT 'movie',
  `title` VARCHAR(255),
  `poster_path` VARCHAR(255),
  `added_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `watchlist` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `tmdb_id` INT NOT NULL,
  `media_type` ENUM ('movie', 'tv') DEFAULT 'movie',
  `title` VARCHAR(255),
  `poster_path` VARCHAR(255),
  `added_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `favorites` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `watchlist` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

INSERT INTO users (name, email, password, avatar) VALUES
('Skeeyzi', 'admin@viberadar.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=1'),
('Hoàng Nam', 'nam.hoang@sgu.edu.vn', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=2'),
('Minh Thư', 'thu.minh@gmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=3'),
('Thành Đạt', 'dat.thanh@outlook.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=4'),
('Khánh Linh', 'linh.khanh@viberadar.io', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=5'),
('Tuấn Kiệt', 'kiet.tuan@yahoo.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=6'),
('Bảo Ngọc', 'ngoc.bao@sgu.vn', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=7'),
('Hữu Phước', 'phuoc.huu@hotmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=8'),
('Thùy Dương', 'duong.thuy@gmail.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=9'),
('Quốc Bảo', 'bao.quoc@viberadar.com', '$2a$10$X7...', 'https://i.pravatar.cc/150?u=10');

INSERT INTO favorites (user_id, tmdb_id, media_type, title, poster_path) VALUES
(1, 872585, 'movie', 'Oppenheimer', '/8Gxv8Z7uo91YyC3NSRE2B3Uj2S8.jpg'),
(1, 569094, 'movie', 'Spider-Man: Across the Spider-Verse', '/8Vt9m9cTqt9pBv8vDTn94jezqS6.jpg'),
(1, 603692, 'movie', 'John Wick: Chapter 4', '/vZloYm7pS72MGvWmOQ3N3vI9QYx.jpg'),
(1, 671, 'movie', 'Harry Potter and the Philosopher\'s Stone', '/wuMc0YST6AIfsRTU7IBvftLs9v1.jpg'),
(1, 1396, 'tv', 'Breaking Bad', '/ztkUQvB1W79S9H9Afv9oJh9YvIQ.jpg'),
(1, 155, 'movie', 'The Dark Knight', '/qJ2tW6WMUDp9sWvksTUj696ORSI.jpg'),
(1, 27205, 'movie', 'Inception', '/ljsZTbVsrYJySZfU6nyS62sKFv4.jpg'),
(1, 667538, 'movie', 'Transformers: Rise of the Beasts', '/gPb2UHugehpAxhSfiB6p6KyC49G.jpg'),
(1, 718930, 'movie', 'Bullet Train', '/tVx9zYPkgCbaRdkWjMC6o2C4FWX.jpg'),
(1, 912649, 'movie', 'Venom: The Last Dance', '/aosm8N9REHgsxq9MvS9tbsTNvM.jpg');


INSERT INTO watchlist (user_id, tmdb_id, media_type, title, poster_path) VALUES
(1, 157336, 'movie', 'Interstellar', '/gEU2QniE6E77NI6lCU6MxlSv7rP.jpg'),
(1, 299536, 'movie', 'Avengers: Infinity War', '/7WsyChvRStv9Oid7Pcygn7396Rj.jpg'),
(1, 496243, 'movie', 'Parasite', '/7IiTTjSaMvU7YvS2S9He9jvYpvm.jpg'),
(1, 13, 'movie', 'Forrest Gump', '/arS66SVSm789m88I86v99Wv90T7.jpg'),
(1, 76600, 'movie', 'Avatar: The Way of Water', '/t6pE3vIuT0sTMzLvTnzp9RfkRqy.jpg'),
(1, 438631, 'movie', 'Dune', '/d5NXSklfzG0ndGxtp9m2G5oYI91.jpg'),
(1, 670292, 'movie', 'The Creator', '/vBZ0qvaRxqEhZwhv6YvsqqsT7S9.jpg'),
(1, 940721, 'movie', 'Godzilla Minus One', '/hkxxMIGaiCTmrEArK7J56oI0Sphi.jpg'),
(1, 1011985, 'movie', 'Kung Fu Panda 4', '/kDp1vUBiR1RQqb6jsqDEgo7aRwS.jpg'),
(1, 823464, 'movie', 'Godzilla x Kong: The New Empire', '/v4uvIat97YpS7u6AOm6mB3M96S7.jpg');
