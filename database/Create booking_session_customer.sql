USE amusement_park;

CREATE TABLE IF NOT EXISTS booking_session_customer (
    id BIGINT NOT NULL AUTO_INCREMENT,

    session_id BIGINT NOT NULL,

    lead_traveller_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,

    whatsapp_delivery TINYINT(1) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_session_customer_session (session_id),

    CONSTRAINT fk_session_customer_session
        FOREIGN KEY (session_id)
        REFERENCES booking_sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;