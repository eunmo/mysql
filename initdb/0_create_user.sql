CREATE USER 'dummy_user'@'%' IDENTIFIED WITH mysql_native_password BY 'dummy_password';
CREATE DATABASE dummy;
GRANT ALL PRIVILEGES ON dummy.* TO 'dummy_user'@'%';
