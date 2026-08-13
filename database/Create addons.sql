USE amusement_park;

CREATE TABLE IF NOT EXISTS addons (
    id BIGINT NOT NULL AUTO_INCREMENT,

    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,

    addon_type ENUM(
        'MEAL_COUPON',
        'LOCKER',
        'OTHER'
    ) NOT NULL DEFAULT 'OTHER',

    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    status ENUM(
        'Active',
        'Inactive'
    ) NOT NULL DEFAULT 'Active',

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_addon_code (code),

    KEY idx_addon_status (status),
    KEY idx_addon_type (addon_type),
    KEY idx_addon_display_order (display_order)
) ENGINE=InnoDB;