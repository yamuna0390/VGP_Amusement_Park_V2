USE amusement_park;

CREATE TABLE IF NOT EXISTS booking_session_items (
    id BIGINT NOT NULL AUTO_INCREMENT,

    session_id BIGINT NOT NULL,

    item_type ENUM(
        'TICKET',
        'ADDON'
    ) NOT NULL,

    ticket_type_id BIGINT NULL,
    addon_id BIGINT NULL,

    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    unit_price_snapshot DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_session_items_session (session_id),
    KEY idx_session_items_ticket (ticket_type_id),
    KEY idx_session_items_addon (addon_id),

    CONSTRAINT fk_session_items_session
        FOREIGN KEY (session_id)
        REFERENCES booking_sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_session_items_ticket
        FOREIGN KEY (ticket_type_id)
        REFERENCES ticket_types(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_session_items_addon
        FOREIGN KEY (addon_id)
        REFERENCES addons(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_session_item_quantity
        CHECK (quantity > 0)

) ENGINE=InnoDB;