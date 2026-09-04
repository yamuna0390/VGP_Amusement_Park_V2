-- Create customer_reviews table
USE amusement_park;

CREATE TABLE IF NOT EXISTS customer_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  status ENUM('Published', 'Unpublished') NOT NULL DEFAULT 'Unpublished',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_display_order (status, display_order)
);
