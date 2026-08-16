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
            `SELECT id, ticket_id, display_name, min_qty, free_qty, max_qty, display_order, is_active FROM offer_tickets WHERE offer_id = ? ORDER BY display_order ASC`,
            [id]
        );
        const [offer_schedule_rules] = await db.query(
            `SELECT id, day_of_week, valid_from, valid_until FROM offer_schedule_rules WHERE offer_id = ?`,
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
            offer_name, description, instruction, offer_code, promotion_type, discount_type, discount_value,
            minimum_amount, valid_from, valid_to, min_advance_days, status, priority,
            offer_tickets, offer_schedule_rules
        } = req.body;

        const [offerResult] = await connection.query(
            `INSERT INTO offers (
                offer_name, description, instruction, offer_code, promotion_type, discount_type, discount_value,
                minimum_amount, valid_from, valid_to, min_advance_days, status, priority, offer_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                offer_name, description || null, instruction || null, offer_code || null, promotion_type, discount_type, discount_value || 0,
                minimum_amount || 0, valid_from, valid_to, min_advance_days || 1, status || 'Active', priority || 1, 'PROMO'
            ]
        );

        const offerId = offerResult.insertId;

        if (offer_tickets && Array.isArray(offer_tickets)) {
            for (let i = 0; i < offer_tickets.length; i++) {
                const tk = offer_tickets[i];
                await connection.query(
                    `INSERT INTO offer_tickets (offer_id, ticket_id, display_name, min_qty, free_qty, max_qty, display_order, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        offerId, tk.ticket_id, tk.display_name, tk.min_qty || 1, tk.free_qty || 0, tk.max_qty || null, tk.display_order || (i + 1), tk.is_active !== undefined ? tk.is_active : 1
                    ]
                );
            }
        }

        if (offer_schedule_rules && Array.isArray(offer_schedule_rules)) {
            for (const rule of offer_schedule_rules) {
                await connection.query(
                    `INSERT INTO offer_schedule_rules (offer_id, day_of_week, valid_from, valid_until)
                     VALUES (?, ?, ?, ?)`,
                    [
                        offerId, rule.day_of_week, rule.valid_from || null, rule.valid_until || null
                    ]
                );
            }
        }

        await connection.commit();
        return success(res, "Offer created successfully", { id: offerId });
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
            offer_name, description, instruction, offer_code, promotion_type, discount_type, discount_value,
            minimum_amount, valid_from, valid_to, min_advance_days, status, priority,
            offer_tickets, offer_schedule_rules
        } = req.body;

        await connection.query(
            `UPDATE offers SET 
                offer_name=?, description=?, instruction=?, offer_code=?, promotion_type=?, discount_type=?, discount_value=?,
                minimum_amount=?, valid_from=?, valid_to=?, min_advance_days=?, status=?, priority=?
            WHERE id=?`,
            [
                offer_name, description || null, instruction || null, offer_code || null, promotion_type, discount_type, discount_value || 0,
                minimum_amount || 0, valid_from, valid_to, min_advance_days || 1, status || 'Active', priority || 1,
                id
            ]
        );

        await connection.query(`DELETE FROM offer_tickets WHERE offer_id = ?`, [id]);
        if (offer_tickets && Array.isArray(offer_tickets)) {
            for (let i = 0; i < offer_tickets.length; i++) {
                const tk = offer_tickets[i];
                await connection.query(
                    `INSERT INTO offer_tickets (offer_id, ticket_id, display_name, min_qty, free_qty, max_qty, display_order, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id, tk.ticket_id, tk.display_name, tk.min_qty || 1, tk.free_qty || 0, tk.max_qty || null, tk.display_order || (i + 1), tk.is_active !== undefined ? tk.is_active : 1
                    ]
                );
            }
        }

        await connection.query(`DELETE FROM offer_schedule_rules WHERE offer_id = ?`, [id]);
        if (offer_schedule_rules && Array.isArray(offer_schedule_rules)) {
            for (const rule of offer_schedule_rules) {
                await connection.query(
                    `INSERT INTO offer_schedule_rules (offer_id, day_of_week, valid_from, valid_until)
                     VALUES (?, ?, ?, ?)`,
                    [
                        id, rule.day_of_week, rule.valid_from || null, rule.valid_until || null
                    ]
                );
            }
        }

        await connection.commit();
        return success(res, "Offer updated successfully");
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
