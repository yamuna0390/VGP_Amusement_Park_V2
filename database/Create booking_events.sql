USE amusement_park;

CREATE TABLE IF NOT EXISTS booking_events (
    id BIGINT NOT NULL AUTO_INCREMENT,

    session_id BIGINT NULL,
    booking_id BIGINT NULL,

    event_type VARCHAR(50) NOT NULL,

    actor_type ENUM(
        'CUSTOMER',
        'ADMIN',
        'SYSTEM'
    ) NOT NULL DEFAULT 'CUSTOMER',

    metadata JSON NULL,

    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_booking_events_session (session_id),
    KEY idx_booking_events_booking (booking_id),
    KEY idx_booking_events_type (event_type),
    KEY idx_booking_events_created (created_at),

    CONSTRAINT fk_booking_events_session
        FOREIGN KEY (session_id)
        REFERENCES booking_sessions(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_events_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

) ENGINE=InnoDB;