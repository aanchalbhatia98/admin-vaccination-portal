-- Create Database
CREATE DATABASE IF NOT EXISTS vaccination_portal;
USE vaccination_portal;

-- Drop existing tables in correct order (to avoid foreign key issues)
DROP TABLE IF EXISTS vaccination_status;
DROP TABLE IF EXISTS vaccination_drive;
DROP TABLE IF EXISTS student;

-- 1. Student Table
CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class INT NOT NULL
);

-- 2. Vaccination Drive Table
CREATE TABLE vaccination_drive (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    drive_date DATE NOT NULL,
    doses_available INT NOT NULL,
    classes_applicable TEXT NOT NULL -- Comma-separated integers like '5,6,7'
);

-- 3. Vaccination Status Table
CREATE TABLE vaccination_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    vaccination_date DATE NOT NULL,
    status ENUM('Pending', 'Completed', 'Missed') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (drive_id) REFERENCES vaccination_drive(id) ON DELETE CASCADE
);

-- Insert Students (10 rows)
INSERT INTO student (name, class) VALUES
('Aarav Sharma', 5),
('Isha Patel', 5),
('Rohan Verma', 6),
('Diya Mehta', 6),
('Aryan Joshi', 7),
('Anaya Reddy', 7),
('Kabir Nair', 8),
('Meera Desai', 8),
('Vivaan Rao', 9),
('Tara Kapoor', 9);

-- Insert Vaccination Drives (3 rows)
INSERT INTO vaccination_drive (name, drive_date, doses_available, classes_applicable) VALUES
('Polio', '2025-01-15', 100, '5,6'),
('Hepatitis B', '2025-03-10', 80, '6,7'),
('COVID Booster', '2025-05-05', 90, '8,9');

-- Insert Vaccination Status (20 rows)
INSERT INTO vaccination_status (student_id, drive_id, vaccination_date, status) VALUES
(1, 1, '2025-01-15', 'Completed'),
(2, 1, '2025-01-15', 'Completed'),
(3, 1, '2025-01-15', 'Missed'),
(4, 2, '2025-03-10', 'Completed'),
(5, 2, '2025-03-10', 'Pending'),
(6, 2, '2025-03-10', 'Completed'),
(7, 3, '2025-05-05', 'Completed'),
(8, 3, '2025-05-05', 'Completed'),
(9, 3, '2025-05-05', 'Pending'),
(10, 3, '2025-05-05', 'Completed'),
(3, 2, '2025-03-10', 'Missed'),
(5, 3, '2025-05-05', 'Pending'),
(2, 2, '2025-03-10', 'Completed'),
(6, 3, '2025-05-05', 'Missed'),
(1, 2, '2025-03-10', 'Completed'),
(4, 3, '2025-05-05', 'Pending'),
(7, 2, '2025-03-10', 'Completed'),
(8, 1, '2025-01-15', 'Missed'),
(9, 2, '2025-03-10', 'Completed'),
(10, 1, '2025-01-15', 'Completed');
