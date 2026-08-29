const db = require("../config/database");
const { success } = require("../utils/response");

const getAdminOffers = async (req, res, next) => {
    try {
        const [offers] = await db.query(
            `SELECT * FROM offers ORDER BY id DESC`
        );
        return success(res, "Offers retrieved successfully", offers);
    } catch (error) {
        next(error);
    }
};

const getAdminOfferById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [offers] = await db.query(`SELECT * FROM offers WHERE id = ?`, [id]);
        if (offers.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found." });
        }
        
        const offer = offers[0];
      const [offer_tickets] = await db.query(
    `SELECT
        id,
        buy_ticket_id,
        free_ticket_id,
        display_name,
        display_subname,
        buy_quantity,
        free_quantity,
        offer_price,
        max_qty,
        display_order,
        is_active
     FROM offer_tickets
     WHERE offer_id = ?
     ORDER BY display_order ASC`,
    [id]
);
     const [offer_schedule_rules] = await db.query(
    `SELECT
        id,
        day_of_week
     FROM offer_schedule_rules
     WHERE offer_id = ?`,
    [id]
);

        offer.offer_tickets = offer_tickets;
        offer.offer_schedule_rules = offer_schedule_rules;

        return success(res, "Offer retrieved successfully", offer);
    } catch (error) {
        next(error);
    }
};

const createAdminOffer = async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

     const {
    offer_name,
    description,
    instruction,
    offer_code,
    offer_type_id,
    discount_percentage,
    flat_discount,
    minimum_booking_value,
    valid_from,
    valid_to,
    min_advance_days,
    status,
    display_order,
    offer_tickets,
    offer_schedule_rules
} = req.body;

        // ---------------------------------------------------------
        // 1. Create main offer
        // ---------------------------------------------------------
        const [offerResult] = await connection.query(
            `INSERT INTO offers (
    offer_name,
    description,
    instruction,
    offer_code,
    offer_type_id,
    discount_percentage,
    flat_discount,
    minimum_booking_value,
    valid_from,
    valid_to,
    min_advance_days,
    status,
    display_order
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
    offer_name,
    description || null,
    instruction || null,
    offer_code || null,
    offer_type_id,
    discount_percentage !== undefined
        ? discount_percentage
        : null,
    flat_discount !== undefined
        ? flat_discount
        : null,
    minimum_booking_value !== undefined
        ? minimum_booking_value
        : null,
    valid_from,
    valid_to,
    min_advance_days !== undefined
        ? min_advance_days
        : 1,
    status || "Active",
    display_order !== undefined
        ? display_order
        : 0
]
        );

        const offerId = offerResult.insertId;

        // ---------------------------------------------------------
        // 2. Create offer ticket mappings
        // ---------------------------------------------------------
        if (Array.isArray(offer_tickets)) {
            for (let i = 0; i < offer_tickets.length; i++) {
                const tk = offer_tickets[i];

                await connection.query(
                    `INSERT INTO offer_tickets (
                        offer_id,
                        buy_ticket_id,
                        free_ticket_id,
                        display_name,
                        display_subname,
                        buy_quantity,
                        free_quantity,
                        offer_price,
                        max_qty,
                        display_order,
                        is_active
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        offerId,

                        tk.buy_ticket_id,

                        tk.free_ticket_id !== undefined
                            ? tk.free_ticket_id
                            : null,

                        tk.display_name,

                        tk.display_subname !== undefined
                            ? tk.display_subname
                            : null,

                        tk.buy_quantity !== undefined
                            ? tk.buy_quantity
                            : 1,

                        tk.free_quantity !== undefined
                            ? tk.free_quantity
                            : 0,

                        tk.offer_price !== undefined
                            ? Math.round(Number(tk.offer_price))
                            : 0,

                        tk.max_qty !== undefined
                            ? tk.max_qty
                            : null,

                        tk.display_order !== undefined
                            ? tk.display_order
                            : i + 1,

                        tk.is_active !== undefined
                            ? tk.is_active
                            : 1
                    ]
                );
            }
        }

        // ---------------------------------------------------------
        // 3. Create schedule rules
        // ---------------------------------------------------------
        if (Array.isArray(offer_schedule_rules)) {
            for (const rule of offer_schedule_rules) {
                await connection.query(
                    `INSERT INTO offer_schedule_rules (
                        offer_id,
                        day_of_week
                    )
                    VALUES (?, ?)`,
                    [
                        offerId,
                        rule.day_of_week
                    ]
                );
            }
        }

        await connection.commit();

        return success(
            res,
            "Offer created successfully",
            { id: offerId },
            201
        );

    } catch (error) {
        await connection.rollback();
        next(error);

    } finally {
        connection.release();
    }
};
const updateAdminOffer = async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;

        const {
            offer_name,
            description,
            instruction,
            offer_code,
            offer_type_id,
            discount_percentage,
            flat_discount,
            minimum_booking_value,
            valid_from,
            valid_to,
            min_advance_days,
            status,
            display_order,
            offer_tickets,
            offer_schedule_rules
        } = req.body;

        // ---------------------------------------------------------
        // 1. Update main offer
        // ---------------------------------------------------------
        await connection.query(
            `UPDATE offers SET
                offer_name = ?,
                description = ?,
                instruction = ?,
                offer_code = ?,
                offer_type_id = ?,
                discount_percentage = ?,
                flat_discount = ?,
                minimum_booking_value = ?,
                valid_from = ?,
                valid_to = ?,
                min_advance_days = ?,
                status = ?,
                display_order = ?
             WHERE id = ?`,
            [
                offer_name,
                description || null,
                instruction || null,
                offer_code || null,
                offer_type_id,

                discount_percentage !== undefined
                    ? discount_percentage
                    : null,

                flat_discount !== undefined
                    ? flat_discount
                    : null,

                minimum_booking_value !== undefined
                    ? minimum_booking_value
                    : null,

                valid_from,
                valid_to,

                min_advance_days !== undefined
                    ? min_advance_days
                    : 1,

                status || "Active",

                display_order !== undefined
                    ? display_order
                    : 0,

                id
            ]
        );

        // ---------------------------------------------------------
        // 2. Replace offer ticket mappings
        // ---------------------------------------------------------
        await connection.query(
            `DELETE FROM offer_tickets
             WHERE offer_id = ?`,
            [id]
        );

        if (Array.isArray(offer_tickets)) {
            for (let i = 0; i < offer_tickets.length; i++) {
                const tk = offer_tickets[i];

                await connection.query(
                    `INSERT INTO offer_tickets (
                        offer_id,
                        buy_ticket_id,
                        free_ticket_id,
                        display_name,
                        display_subname,
                        buy_quantity,
                        free_quantity,
                        offer_price,
                        max_qty,
                        display_order,
                        is_active
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,

                        tk.buy_ticket_id,

                        tk.free_ticket_id !== undefined
                            ? tk.free_ticket_id
                            : null,

                        tk.display_name,

                        tk.display_subname !== undefined
                            ? tk.display_subname
                            : null,

                        tk.buy_quantity !== undefined
                            ? tk.buy_quantity
                            : 1,

                        tk.free_quantity !== undefined
                            ? tk.free_quantity
                            : 0,

                        tk.offer_price !== undefined
                            ? Math.round(Number(tk.offer_price))
                            : 0,

                        tk.max_qty !== undefined
                            ? tk.max_qty
                            : null,

                        tk.display_order !== undefined
                            ? tk.display_order
                            : i + 1,

                        tk.is_active !== undefined
                            ? tk.is_active
                            : 1
                    ]
                );
            }
        }

        // ---------------------------------------------------------
        // 3. Replace schedule rules
        // ---------------------------------------------------------
        await connection.query(
            `DELETE FROM offer_schedule_rules
             WHERE offer_id = ?`,
            [id]
        );

        if (Array.isArray(offer_schedule_rules)) {
            for (const rule of offer_schedule_rules) {
                await connection.query(
                    `INSERT INTO offer_schedule_rules (
                        offer_id,
                        day_of_week
                    )
                    VALUES (?, ?)`,
                    [
                        id,
                        rule.day_of_week
                    ]
                );
            }
        }

        await connection.commit();

        return success(
            res,
            "Offer updated successfully",
            { id }
        );

    } catch (error) {
        await connection.rollback();
        next(error);

    } finally {
        connection.release();
    }
};

const updateAdminOfferStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await db.query(
            `UPDATE offers SET status = ? WHERE id = ?`,
            [status, id]
        );
        
        return success(res, "Offer status updated successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminOffers,
    getAdminOfferById,
    createAdminOffer,
    updateAdminOffer,
    updateAdminOfferStatus
};
