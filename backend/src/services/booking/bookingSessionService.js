const db = require("../../config/database");
const { generateToken, hashToken } = require("../../utils/bookingSessionToken");
const bookingSessionRepository = require("../../repositories/booking/bookingSessionRepository");
const ticketRepository = require("../../repositories/catalog/ticketRepository");
const offerRepository = require("../../repositories/catalog/offerRepository");
const addonRepository = require("../../repositories/catalog/addonRepository");

/**
 * Creates a new booking session and loads the initial catalogue data.
 * 
 * @param {Object} user - The authenticated user (optional)
 * @returns {Promise<Object>} An object containing the raw sessionToken and catalogue data
 */
/**
 * Creates a new booking session.
 *
 * API 1
 * POST /api/booking/session
 *
 * Initial database state:
 * - visit_date    = NULL
 * - booking_type  = REGULAR
 * - offer_id      = NULL
 * - current_step  = 1
 * - status        = ACTIVE
 *
 * API 1 returns only:
 * - session
 * - addons
 *
 * Tickets and offers are loaded by later APIs.
 *
 * @param {Object} user - The authenticated user (optional)
 * @returns {Promise<Object>}
 */
async function createSession(user) {
    // 1. Generate secure random token
    const rawToken = generateToken();

    // 2. Hash token for database storage
    const sessionTokenHash = hashToken(rawToken);

    // 3. Determine user_id
    const userId = user && user.id ? user.id : null;

    // 4. Calculate session expiry
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // 5. Create booking session
    const sessionId = await bookingSessionRepository.createSession({
        sessionTokenHash,
        userId,
        expiresAt
    });

    // 6. API 1 needs only active addons
    const addons = await addonRepository.getActiveAddons();

    // 7. Return only data required by API 1
    return {
        rawToken,
        data: {
            sessionId,
            visitDate: null,
            bookingType: "REGULAR",
            offerId: null,
            currentStep: 1,
            status: "ACTIVE",
            expiresAt,
            addons
        }
    };
}

/**
 * Validates offer eligibility against the visit date.
 * 
 * @param {Array} offers 
 * @param {string} visitDate 
 * @param {Array} mappings 
 * @param {Array} schedules 
 * @returns {Array} List of offers with eligibility info
 */
function evaluateOffers(offers, visitDate, mappings, schedules) {
    let vDateStr = visitDate;
    if (visitDate instanceof Date) {
        vDateStr = visitDate.getFullYear() + "-" + String(visitDate.getMonth() + 1).padStart(2, '0') + "-" + String(visitDate.getDate()).padStart(2, '0');
    }
    const vDate = new Date(vDateStr);
    
    // Calculate advance days difference using UTC midnights to avoid DST issues
    const today = new Date();
    const tDateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    
    const vDateUTC = Date.UTC(Number(vDateStr.slice(0,4)), Number(vDateStr.slice(5,7))-1, Number(vDateStr.slice(8,10)));
    const tDateUTC = Date.UTC(Number(tDateStr.slice(0,4)), Number(tDateStr.slice(5,7))-1, Number(tDateStr.slice(8,10)));
    const diffTime = vDateUTC - tDateUTC;
    const advanceDays = diffTime >= 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : -1;

    // In JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat.
    // Database check constraint requires 1-7. Map 0 (Sunday) to 7.
    const jsDayOfWeek = new Date(vDateUTC).getDay(); 
    const visitDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek;
    
    // Helper to extract YYYY-MM-DD from mysql Date (which is local time) or string
    const toYMD = (d) => {
        if (!d) return null;
        if (typeof d === 'string') return d.substring(0, 10);
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
    };

    return offers.map(o => {
        let eligible = true;
        let reason = null;

        // 1. Offer inactive
        if (o.status !== 'Active') {
            eligible = false;
            reason = "Offer is no longer active.";
        }

        // 2. Outside offer validity period
        const validFromStr = toYMD(o.valid_from);
        const validToStr = toYMD(o.valid_to);

        if (eligible && validFromStr && vDateStr < validFromStr) {
            eligible = false;
            reason = "Offer is not valid for the selected visit date.";
        }
        if (eligible && validToStr && vDateStr > validToStr) {
            eligible = false;
            reason = "Offer is not valid for the selected visit date.";
        }

        // 3. Minimum advance requirement
        if (eligible && advanceDays < (o.min_advance_days || 0)) {
            eligible = false;
            reason = "Offer requires advance booking.";
        }

        // 4. Weekday schedule restriction
        if (eligible) {
            const rules = schedules.filter(s => s.offerId === o.id);
            if (rules.length > 0) {
                // Must match at least one rule
                const matchesRule = rules.some(r => {
                    const matchesDay = r.dayOfWeek === visitDayOfWeek;
                    const rFrom = toYMD(r.validFrom);
                    const rUntil = toYMD(r.validUntil);
                    const matchesFrom = !rFrom || vDateStr >= rFrom;
                    const matchesUntil = !rUntil || vDateStr <= rUntil;
                    return matchesDay && matchesFrom && matchesUntil;
                });
                
                if (!matchesRule) {
                    eligible = false;
                    const daysMap = {1:"Mondays", 2:"Tuesdays", 3:"Wednesdays", 4:"Thursdays", 5:"Fridays", 6:"Saturdays", 7:"Sundays"};
                    const days = [...new Set(rules.map(r => daysMap[r.dayOfWeek]))];
                    reason = `Offer is available only on ${days.join(" and ")}.`;
                }
            }
        }

        // 5. No active ticket mapping
        if (eligible) {
            const hasMapping = mappings.some(m => m.offerId === o.id);
            if (!hasMapping) {
                eligible = false;
                reason = "Offer has no applicable tickets.";
            }
        }

        return {
            ...o,
            eligible,
            reason
        };
    });
}

/**
 * Handles Step 1 API request.
 * 
 * @param {string} rawToken 
 * @param {Object} payload 
 */
/**
 * Handles API 2.
 *
 * PATCH /api/booking/session
 *
 * API 2 only validates and saves the selected visit date.
 *
 * Request:
 * {
 *   "visitDate": "YYYY-MM-DD"
 * }
 *
 * It does NOT:
 * - require bookingType
 * - require offerId
 * - load tickets
 * - load offers
 * - load offer mappings
 * - load offer schedules
 * - load addons
 */
async function updateSession(rawToken, payload) {
    if (!rawToken) {
        const err = new Error("Session cookie missing");
        err.statusCode = 401;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    const sessionTokenHash = hashToken(rawToken);

    const session = await bookingSessionRepository.getSessionByHash(
        sessionTokenHash
    );

    if (!session) {
        const err = new Error("Session not found");
        err.statusCode = 404;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    if (
        session.status !== "ACTIVE" ||
        new Date(session.expires_at) <= new Date()
    ) {
        const err = new Error("Session has expired");
        err.statusCode = 401;
        err.code = "SESSION_EXPIRED";
        throw err;
    }

    // Validate visit date
    const vDate = new Date(`${payload.visitDate}T00:00:00`);

    if (isNaN(vDate.getTime())) {
        const err = new Error("Invalid visit date format.");
        err.statusCode = 400;
        err.code = "INVALID_VISIT_DATE";
        throw err;
    }

    // Build today's date as YYYY-MM-DD
    const today = new Date();

    const todayStr =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

    // Reject past dates
    if (payload.visitDate < todayStr) {
        const err = new Error(
            "The selected visit date cannot be in the past."
        );
        err.statusCode = 400;
        err.code = "VISIT_DATE_IN_PAST";
        throw err;
    }

    // Save ONLY the visit date.
    // booking_type remains REGULAR from API 1.
    // offer_id remains NULL until the user selects an offer.
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await bookingSessionRepository.updateSession(
            session.id,
            {
                visit_date: payload.visitDate,
                current_step: 1,
                last_activity_at: new Date()
            },
            connection
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    // Fetch the updated session
    const updatedSession =
        await bookingSessionRepository.getSessionByHash(
            sessionTokenHash
        );

    return {
        sessionId: updatedSession.id,
        visitDate: updatedSession.visit_date,
        bookingType: updatedSession.booking_type,
        offerId: updatedSession.offer_id,
        expiresAt: updatedSession.expires_at
    };
}
/**
 * Handles Step 2 API request (PUT /api/booking/session/items).
 * 
 * @param {string} rawToken 
 * @param {Object} payload 
 */
async function updateSessionItems(rawToken, payload) {
    if (!rawToken) {
        const err = new Error("Session cookie missing");
        err.statusCode = 401;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    const sessionTokenHash = hashToken(rawToken);
    const session = await bookingSessionRepository.getSessionByHash(sessionTokenHash);

    if (!session) {
        const err = new Error("Session not found");
        err.statusCode = 404;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    if (session.status !== 'ACTIVE' || new Date(session.expires_at) <= new Date()) {
        const err = new Error("Session has expired");
        err.statusCode = 401;
        err.code = "SESSION_EXPIRED";
        throw err;
    }

    if (!session.visit_date || !session.booking_type) {
        const err = new Error("Booking step incomplete. Visit date and booking type are required.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    // 1. Fetch all tickets and addons from DB
    const allDbTickets = await ticketRepository.getActiveTickets();
    
    // Validate addons
    const addonIds = payload.addons ? payload.addons.map(a => a.addonId) : [];
    let dbAddons = [];
    if (addonIds.length > 0) {
        dbAddons = await addonRepository.getActiveAddonsByIds(undefined, addonIds);
    }

    // 2. Offer Validation (if booking_type === 'OFFER')
    let offer = null;
    let offerMappings = [];
    if (session.booking_type === 'OFFER' || payload.offerTickets) {
        const allOffers = await offerRepository.getAllActiveOffers();
        offerMappings = await offerRepository.getOfferTicketMappings();
        const offerSchedules = await offerRepository.getOfferScheduleRules();

        const evaluatedOffers = evaluateOffers(allOffers, session.visit_date, offerMappings, offerSchedules);
        offer = evaluatedOffers.find(o => o.id === session.offer_id);
    }

    const itemsToInsert = [];

    // 3. Process Regular Tickets
    if (payload.tickets) {
        for (const reqTicket of payload.tickets) {
            const dbTicket = allDbTickets.find(t => t.id === reqTicket.ticketTypeId);
            if (!dbTicket) continue;
            itemsToInsert.push({
                sessionId: session.id,
                itemType: 'TICKET',
                pricingType: 'REGULAR',
                ticketTypeId: dbTicket.id,
                addonId: null,
                itemCode: dbTicket.code,
                itemName: dbTicket.name,
                quantity: reqTicket.quantity,
                paidQuantity: reqTicket.quantity,
                freeQuantity: 0,
                unitPriceSnapshot: dbTicket.price
            });
        }
    }

    // 3.5 Process Offer Tickets
    if (payload.offerTickets) {
        for (const reqOffer of payload.offerTickets) {
            const mapping = offerMappings.find(m => m.id === reqOffer.offerTicketId);
            if (mapping) {
                const dbTicket = allDbTickets.find(t => t.id === mapping.buyTicketId);
                if (!dbTicket) continue;

                let quantity = reqOffer.quantity;
                let buyQuantity = mapping.buyQuantity || 1;
                let freeQuantity = mapping.freeQuantity || 0;
                
                let paidQuantity = quantity * buyQuantity;
                let totalFreeQuantity = quantity * freeQuantity;
                
                // The price snapshot MUST be the offer price.
                let offerPrice = mapping.offerPrice ?? dbTicket.price;

                const parentItem = {
                    sessionId: session.id,
                    itemType: 'TICKET',
                    pricingType: 'OFFER',
                    ticketTypeId: dbTicket.id, // we save the underlying buyTicketId
                    addonId: null,
                    offerId: mapping.offerId,
                    offerTicketId: mapping.id,
                    itemCode: dbTicket.code,
                    itemName: mapping.displayName || dbTicket.name,
                    quantity,
                    paidQuantity,
                    freeQuantity: totalFreeQuantity, 
                    unitPriceSnapshot: offerPrice,
                    components: []
                };

                // BUY component
                parentItem.components.push({
                    componentType: 'BUY',
                    ticketTypeId: dbTicket.id,
                    quantity: paidQuantity,
                    unitPriceSnapshot: dbTicket.price
                });

                // FREE component
                if (mapping.freeTicketId && totalFreeQuantity > 0) {
                    const freeDbTicket = allDbTickets.find(t => t.id === mapping.freeTicketId);
                    parentItem.components.push({
                        componentType: 'FREE',
                        ticketTypeId: mapping.freeTicketId,
                        quantity: totalFreeQuantity,
                        unitPriceSnapshot: freeDbTicket ? freeDbTicket.price : 0
                    });
                }

                itemsToInsert.push(parentItem);
            }
        }
    }

    // 4. Process Addons
    if (payload.addons) {
        for (const reqAddon of payload.addons) {
            const dbAddon = dbAddons.find(a => a.id === reqAddon.addonId);
            const quantity = reqAddon.quantity;
            itemsToInsert.push({
                sessionId: session.id,
                itemType: 'ADDON',
                pricingType: 'ADDON',
                ticketTypeId: null,
                addonId: dbAddon.id,
                itemCode: dbAddon.code,
                itemName: dbAddon.name,
                quantity,
                paidQuantity: quantity,
                freeQuantity: 0,
                unitPriceSnapshot: dbAddon.price
            });
        }
    }

    // 5. Transactional Update
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // DELETE existing session items
        await bookingSessionRepository.deleteSessionItems(session.id, connection);

        // INSERT all new session items
        for (const item of itemsToInsert) {
            const insertedId = await bookingSessionRepository.insertSessionItem(item, connection);
            if (item.components && item.components.length > 0) {
                for (const comp of item.components) {
                    comp.sessionItemId = insertedId;
                    await bookingSessionRepository.insertSessionItemComponent(comp, connection);
                }
            }
        }

        // UPDATE booking_sessions (current_step = 2, last_activity_at = NOW)
        await bookingSessionRepository.updateSession(session.id, {
            current_step: 2,
            last_activity_at: new Date()
        }, connection);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    // 6. Retrieve fresh data for response
    const updatedSession = await bookingSessionRepository.getSessionByHash(sessionTokenHash);
    const updatedItems = await bookingSessionRepository.getSessionItems(session.id);

    return { updatedSession, updatedItems, offerMappings };
}

const bookingSessionCustomerRepository = require("../../repositories/booking/bookingSessionCustomerRepository");

/**
 * Handles Step 3 API request (PUT /api/booking/session/customer).
 * 
 * @param {string} rawToken 
 * @param {Object} payload 
 */
async function updateCustomer(rawToken, payload) {
    if (!rawToken) {
        const err = new Error("Session cookie missing");
        err.statusCode = 401;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    const sessionTokenHash = hashToken(rawToken);
    const session = await bookingSessionRepository.getSessionByHash(sessionTokenHash);

    if (!session) {
        const err = new Error("Session not found");
        err.statusCode = 404;
        err.code = "SESSION_NOT_FOUND";
        throw err;
    }

    if (session.status !== 'ACTIVE' || new Date(session.expires_at) <= new Date()) {
        const err = new Error("Session has expired");
        err.statusCode = 401;
        err.code = "SESSION_EXPIRED";
        throw err;
    }

    // Verify Step 2 is completed
    if (session.current_step < 2 || !session.visit_date) {
        const err = new Error("Please complete ticket selection before entering customer information.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    // Verify booking_session_items contains at least one ticket
    const items = await bookingSessionRepository.getSessionItems(session.id);
    const hasTickets = items.some(i => i.item_type === 'TICKET');
    if (!hasTickets) {
        const err = new Error("Please complete ticket selection before entering customer information.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. UPSERT Customer
        await bookingSessionCustomerRepository.upsertCustomer(connection, session.id, payload);

        // 2. Update session step
        await bookingSessionRepository.updateSession(session.id, {
            current_step: 3,
            last_activity_at: new Date()
        }, connection);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    // Retrieve fresh data for response
    const updatedSession = await bookingSessionRepository.getSessionByHash(sessionTokenHash);
    const updatedCustomer = await bookingSessionCustomerRepository.getCustomerBySessionId(session.id);

    return { updatedSession, updatedCustomer };
}

module.exports = {
    createSession,
    updateSession,
    updateSessionItems,
    updateCustomer
};
