-- VGP Amusement Park Schema Updates & Seeding
USE amusement_park;

-- 1. Update Booking & Payment Status ENUMs in bookings table
-- Disable checks temporarily to avoid constraint issues during column alter
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE bookings 
MODIFY COLUMN payment_status ENUM('Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Partially Refunded') DEFAULT 'Pending';

-- Temporarily include 'Pending' to prevent truncation errors on existing data
ALTER TABLE bookings 
MODIFY COLUMN booking_status ENUM('Pending', 'Pending Payment', 'Confirmed', 'Cancelled', 'Used', 'Expired', 'Refunded') DEFAULT 'Pending';

-- Update existing 'Pending' statuses to 'Pending Payment'
UPDATE bookings SET booking_status = 'Pending Payment' WHERE booking_status = 'Pending';

-- Re-alter column to enforce 'Pending Payment' as the default and remove 'Pending' if we want, or keep 'Pending' for historical compatibility.
-- Let's keep 'Pending' in the ENUM list just in case, but change default to 'Pending Payment'
ALTER TABLE bookings 
MODIFY COLUMN booking_status ENUM('Pending', 'Pending Payment', 'Confirmed', 'Cancelled', 'Used', 'Expired', 'Refunded') DEFAULT 'Pending Payment';

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Add rule columns to offers table
ALTER TABLE offers
ADD COLUMN offer_rule ENUM('PERCENTAGE', 'FLAT', 'BOGO', 'B2G1', 'KIDS_FREE') NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN applicable_tickets VARCHAR(255) DEFAULT NULL,
ADD COLUMN min_qty INT DEFAULT 1,
ADD COLUMN free_qty INT DEFAULT 1,
ADD COLUMN priority INT DEFAULT 1;

-- 3. Align ticket pricing in ticket_types table with the frontend
UPDATE ticket_types SET price = 828.75 WHERE code = 'adult';
UPDATE ticket_types SET price = 648.55 WHERE code = 'child';
UPDATE ticket_types SET price = 648.55 WHERE code = 'senior';
UPDATE ticket_types SET price = 780.00 WHERE code = 'student';
UPDATE ticket_types SET price = 1313.00 WHERE code = 'dfpa';
UPDATE ticket_types SET price = 1128.00 WHERE code = 'dfpc';
UPDATE ticket_types SET price = 0.00 WHERE code = 'below90';

-- 4. Align food pricing in meal_types table with the frontend
UPDATE meal_types SET price = 250.00 WHERE code = 'veg';
UPDATE meal_types SET price = 300.00 WHERE code = 'nonveg';
UPDATE meal_types SET price = 199.00 WHERE code = 'kids';
UPDATE meal_types SET price = 149.00 WHERE code = 'snacks';

-- 5. Seed default promotional offers into the database
INSERT INTO offers 
  (offer_name, offer_code, discount_type, discount_value, minimum_amount, valid_from, valid_to, status, offer_rule, applicable_tickets, min_qty, free_qty, priority)
VALUES
  ('Online Booking Offer', 'ONLINE15', 'Percentage', 15.00, 0.00, '2026-07-01', '2026-12-31', 'Active', 'PERCENTAGE', 'adult,child,senior', 1, 0, 1),
  ('Campus Thrill Deal', 'CAMPUS20', 'Percentage', 20.00, 0.00, '2026-07-01', '2026-12-31', 'Active', 'PERCENTAGE', 'student', 1, 0, 3),
  ('Birthday Buddy Treat', 'BIRTHDAYBOGO', 'Flat', 0.00, 0.00, '2026-07-01', '2026-12-31', 'Active', 'BOGO', 'adult,child,senior,student', 1, 1, 4),
  ('Adi Thalubadi', 'ADITHALUBADI', 'Flat', 0.00, 0.00, '2026-07-21', '2026-08-12', 'Active', 'B2G1', 'adult,child,senior,student', 2, 1, 7),
  ('Friendship Trio Fun Pass', 'FRIENDTRIO', 'Flat', 0.00, 0.00, '2026-08-02', '2026-08-02', 'Active', 'B2G1', 'adult,child,senior,student', 2, 1, 6),
  ('Freedom Fun Fest', 'FREEDOM800', 'Flat', 175.00, 0.00, '2026-08-15', '2026-08-15', 'Active', 'FLAT', 'adult', 1, 0, 6)
ON DUPLICATE KEY UPDATE 
  offer_rule = VALUES(offer_rule),
  applicable_tickets = VALUES(applicable_tickets),
  min_qty = VALUES(min_qty),
  free_qty = VALUES(free_qty),
  priority = VALUES(priority);
