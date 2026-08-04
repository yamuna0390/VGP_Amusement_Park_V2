CREATE TABLE offer_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Relations
    offer_id INT NOT NULL,
    ticket_id INT NOT NULL,

    -- Customer UI
    display_name VARCHAR(150) NOT NULL,

    -- Pricing
    pricing_mode ENUM('AUTO','FIXED') NOT NULL DEFAULT 'AUTO',

    /*
      AUTO  -> backend calculates price
      FIXED -> admin enters selling price
    */

    offer_apply_value DECIMAL(10,2) DEFAULT NULL,

    /*
      AUTO
      ----
      Percentage -> 15
      Flat       -> 175
      BOGO/B2G1  -> NULL

      FIXED
      -----
      Final ticket price
      Example : 552.50
    */

    min_qty INT NOT NULL DEFAULT 1,

    /*
      Buy2Get1 => 2
      Birthday => 1
    */

    free_qty INT NOT NULL DEFAULT 0,

    /*
      Buy2Get1 => 1
      Buy1Get2 => 2
    */

    max_qty INT DEFAULT NULL,

    display_order INT DEFAULT 1,

    is_active TINYINT(1) DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_offer_ticket_offer
        FOREIGN KEY (offer_id)
        REFERENCES offers(id),

    CONSTRAINT fk_offer_ticket_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id),

    INDEX idx_offer_id (offer_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_active (is_active)
);