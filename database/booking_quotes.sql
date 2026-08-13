USE amusement_park;

CREATE TABLE IF NOT EXISTS booking_quotes (
    id BIGINT NOT NULL AUTO_INCREMENT,

    session_id BIGINT NOT NULL,

    quote_version INT NOT NULL DEFAULT 1,

    ticket_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    addon_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    offer_discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    coupon_discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    ticket_tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    addon_tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    convenience_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    expires_at DATETIME NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_quote_version (
        session_id,
        quote_version
    ),

    KEY idx_quotes_session (session_id),
    KEY idx_quotes_expiry (expires_at),

    CONSTRAINT fk_quote_session
        FOREIGN KEY (session_id)
        REFERENCES booking_sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB;