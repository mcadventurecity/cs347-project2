DROP DATABASE IF EXISTS mcyt;
DROP USER IF EXISTS mcyt_user@localhost;

CREATE DATABASE mcyt CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER mcyt_user@localhost IDENTIFIED WITH mysql_native_password BY 'REDACTED';
GRANT ALL PRIVILEGES ON mcyt.* TO mcyt_user@localhost;