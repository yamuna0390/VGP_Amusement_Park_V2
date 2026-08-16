CREATE TABLE IF NOT EXISTS group_quotes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    organisation_name VARCHAR(255) NOT NULL,
    group_size INT NOT NULL,
    preferred_date DATE NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Phase 4B: Add email column
ALTER TABLE group_quotes
ADD COLUMN email VARCHAR(255) NULL AFTER contact_number;
