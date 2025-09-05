CREATE DATABASE media_platform;
USE media_platform;

-- Admin users
CREATE TABLE AdminUser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media metadata
CREATE TABLE MediaAsset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('video', 'audio') NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE MediaViewLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    media_id INT NOT NULL,
    viewed_by_ip VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES MediaAsset(id)
);
