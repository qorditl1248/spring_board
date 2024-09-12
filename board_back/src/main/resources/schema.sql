----DROP TABLE IF EXISTS USER;
----DROP TABLE IF EXISTS ROLE;
----DROP TABLE IF EXISTS USER_ROLES;
----drop table if exists  OAUTH2_USER;
--drop table if exists  board_like;

--CREATE TABLE USER (
--    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255) UNIQUE not null,
--    password VARCHAR(255) not null,
--    name VARCHAR(255) not null,
--    email varchar(255) not null,
--    img text not null default 'https://firebasestorage.googleapis.com/v0/b/userprofile-65cb0.appspot.com/o/user%2Fdefault1.png?alt=media&token=21aef133-7839-46e0-8066-e2201eb9a90e'
--);
--
--CREATE TABLE ROLE (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(255) UNIQUE not null
--);
--
--INSERT INTO ROLE
--VALUES
--(DEFAULT, 'ROLE_USER'),
--(DEFAULT, 'ROLE_MANAGER'),
--(DEFAULT, 'ROLE_ADMIN');
--
--CREATE TABLE USER_ROLES (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    role_id BIGINT not null
--);
--
--CREATE TABLE OAUTH2_USER (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    oauth2_name VARCHAR(255) UNIQUE NOT NULL,
--    provider VARCHAR(255) NOT NULL
--);

-- 게시판 테이블
--CREATE TABLE BOARD (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    title VARCHAR(255) NOT NULL,
--    content LONGTEXT NOT NULL,
--    user_id BIGINT NOT NULL,
--    view_count INT NOT NULL DEFAULT 0
--);


--alter table board add column view_count int not null default 0;


--alter table `USER` add column `email` varchar(255) not null;

--CREATE TABLE board_like(
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    board_id BIGINT not null,
--    user_id BIGINT not null
--);

--create table COMMENT (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    board_id BIGINT NOT NULL,
--    parent_id BIGINT NULL,
--    content TEXT NOT NULl,
--    writer_id BIGINT NOT NULL,
--    create_date DATETIME NOT NULL
--);

--CREATE TRIGGER before_delete_comment
--BEFORE DELETE ON comment
--FOR EACH ROW
--    DELETE FROM comment WHERE parent_id = OLD.id;