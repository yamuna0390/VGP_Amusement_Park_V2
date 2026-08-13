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
async function createSession(user) {
    // 1. Generate secure random token
    const rawToken = generateToken();
    
    // 2. Hash token
    const sessionTokenHash = hashToken(rawToken);

    // 3. Determine user_id
    const userId = user && user.id ? user.id : null;

    // Calculate expiry (30 mins from now)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // We do NOT use a long transaction for everything, just simple independent queries as requested.
    
    // 4. Create booking session
    const sessionId = await bookingSessionRepository.createSession({
        sessionTokenHash,
        userId,
        expiresAt: expiresAt
    });

    // Load catalogue
    // 5. Load ticket types (only active ones for booking UI)
    const tickets = await ticketRepository.getRegularTickets();
    
    // 6. Load offers
    const offers = await offerRepository.getAllActiveOffers();

    // 7. Load offer ticket mappings
    const offerMappings = await offerRepository.getOfferTicketMappings();

    // 8. Load offer schedule rules
    const offerSchedules = await offerRepository.getOfferScheduleRules();

    // 9. Load active addons
    const addons = await addonRepository.getActiveAddons();

    // 10. Return raw token and raw data 
    // The Controller will pass this to DTO.
    return {
        rawToken,
        data: {
            sessionId,
            expiresAt: expiresAt,
            tickets,
            offers,
            offerMappings,
            offerSchedules,
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
    const visitDayOfWeek = new Date(vDateUTC).getDay(); 
    
    // Helper to extract YYYY-MM-DD from mysql Date (which is local time)
    const toYMD = (d) => {
        if (!d) return null;
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
                    const daysMap = {0:"Sundays", 1:"Mondays", 2:"Tuesdays", 3:"Wednesdays", 4:"Thursdays", 5:"Fridays", 6:"Saturdays"};
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
async function updateSession(rawToken, payload) {
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
        err.statusCode = 403;
        err.code = "SESSION_EXPIRED";
        throw err;
    }

    // Validate Visit Date
    const vDate = new Date(payload.visitDate);
    if (isNaN(vDate.getTime())) {
        const err = new Error("Invalid visit date format.");
        err.statusCode = 400;
        err.code = "INVALID_VISIT_DATE";
        throw err;
    }

    const today = new Date();
    const tDateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    if (payload.visitDate < tDateStr) {
        const err = new Error("The selected visit date cannot be in the past.");
        err.statusCode = 400;
        err.code = "VISIT_DATE_IN_PAST";
        throw err;
    }

    // Load ALL catalogues for evaluation
    const tickets = await ticketRepository.getRegularTickets();
    const rawOffers = await offerRepository.getAllActiveOffers();
    const offerMappings = await offerRepository.getOfferTicketMappings();
    const offerSchedules = await offerRepository.getOfferScheduleRules();
    const addons = await addonRepository.getActiveAddons();

    const evaluatedOffers = evaluateOffers(rawOffers, payload.visitDate, offerMappings, offerSchedules);

    // Validate OFFER selection
    if (payload.bookingType === 'OFFER') {
        const selectedOffer = evaluatedOffers.find(o => o.id === payload.offerId);
        if (!selectedOffer) {
            const err = new Error("Offer not found");
            err.statusCode = 404;
            err.code = "OFFER_NOT_FOUND";
            throw err;
        }
        if (!selectedOffer.eligible) {
            const err = new Error("This offer is not available for the selected visit date.");
            err.statusCode = 400;
            err.code = "OFFER_NOT_AVAILABLE";
            throw err;
        }
    }

    // Transactional Update
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check Conflict (REGULAR vs OFFER) if items exist
        const itemsCount = await bookingSessionRepository.getSessionItemsCount(session.id, connection);
        if (itemsCount > 0 && session.booking_type !== payload.bookingType) {
            const err = new Error("Regular tickets and offer tickets cannot be combined in the same booking.");
            err.statusCode = 400;
            err.code = "BOOKING_TYPE_CONFLICT";
            throw err;
        }

        // Update booking_sessions
        await bookingSessionRepository.updateSession(session.id, {
            visit_date: payload.visitDate,
            booking_type: payload.bookingType,
            offer_id: payload.offerId || null,
            current_step: 1,
            last_activity_at: new Date()
        }, connection);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    // Return the updated session logic (pass back to controller)
    const updatedSession = await bookingSessionRepository.getSessionByHash(sessionTokenHash);

    // We pass evaluatedOffers directly so DTO can include the 'eligible' and 'reason' flags
    return {
        sessionId: updatedSession.id,
        visitDate: updatedSession.visit_date,
        bookingType: updatedSession.booking_type,
        offerId: updatedSession.offer_id,
        expiresAt: updatedSession.expires_at,
        tickets,
        offers: evaluatedOffers,
        offerMappings,
        offerSchedules,
        addons
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
        err.statusCode = 403;
        err.code = "SESSION_EXPIRED";
        throw err;
    }

    if (!session.visit_date || !session.booking_type) {
        const err = new Error("Booking step incomplete. Visit date and booking type are required.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    // 1. Fetch requested tickets and addons from DB
    const ticketIds = payload.tickets.map(t => t.ticketTypeId);
    const dbTickets = await ticketRepository.getTicketsByIds(undefined, ticketIds); // using default connection

    // Validate tickets
    for (const requestedTicket of payload.tickets) {
        const dbTicket = dbTickets.find(t => t.id === requestedTicket.ticketTypeId);
        if (!dbTicket) {
            const err = new Error("Ticket not found.");
            err.statusCode = 404;
            err.code = "TICKET_NOT_FOUND";
            throw err;
        }
        // getTicketsByIds already filters by 'Active', but just in case
    }
    if (dbTickets.length !== ticketIds.length) {
        const err = new Error("One or more tickets are not available.");
        err.statusCode = 400;
        err.code = "TICKET_NOT_AVAILABLE";
        throw err;
    }

    // Validate addons
    const addonIds = payload.addons ? payload.addons.map(a => a.addonId) : [];
    let dbAddons = [];
    if (addonIds.length > 0) {
        dbAddons = await addonRepository.getActiveAddonsByIds(undefined, addonIds);
        if (dbAddons.length !== addonIds.length) {
            const err = new Error("One or more addons are not available.");
            err.statusCode = 400;
            err.code = "ADDON_NOT_AVAILABLE";
            throw err;
        }
    }

    // 2. Offer Validation (if booking_type === 'OFFER')
    let offer = null;
    let offerMappings = [];
    if (session.booking_type === 'OFFER') {
        const allOffers = await offerRepository.getAllActiveOffers();
        offerMappings = await offerRepository.getOfferTicketMappings();
        const offerSchedules = await offerRepository.getOfferScheduleRules();

        const evaluatedOffers = evaluateOffers(allOffers, session.visit_date, offerMappings, offerSchedules);
        offer = evaluatedOffers.find(o => o.id === session.offer_id);

        if (!offer) {
            const err = new Error("Offer not found.");
            err.statusCode = 404;
            err.code = "OFFER_NOT_FOUND";
            throw err;
        }
        if (!offer.eligible) {
            const err = new Error(offer.reason || "This offer is not available for the selected visit date.");
            err.statusCode = 400;
            err.code = "OFFER_NOT_AVAILABLE";
            throw err;
        }
    }

    const itemsToInsert = [];

    // 3. Process Tickets
    for (const reqTicket of payload.tickets) {
        const dbTicket = dbTickets.find(t => t.id === reqTicket.ticketTypeId);
        const quantity = reqTicket.quantity;
        let paidQuantity = quantity;
        let freeQuantity = 0;

        if (session.booking_type === 'OFFER') {
            const mapping = offerMappings.find(m => m.offerId === offer.id && m.ticketTypeId === dbTicket.id);
            if (mapping) {
                if (offer.promotion_type === 'BUY_X_GET_Y') {
                    const minQty = mapping.minQty;
                    const freeQty = mapping.freeQty;
                    if (minQty > 0) {
                        freeQuantity = Math.floor(quantity / minQty) * freeQty;
                    }
                }
            }
        }

        itemsToInsert.push({
            sessionId: session.id,
            itemType: 'TICKET',
            ticketTypeId: dbTicket.id,
            addonId: null,
            itemCode: dbTicket.code,
            itemName: dbTicket.name,
            quantity,
            paidQuantity,
            freeQuantity,
            unitPriceSnapshot: dbTicket.price
        });
    }

    // 4. Process Addons
    if (payload.addons) {
        for (const reqAddon of payload.addons) {
            const dbAddon = dbAddons.find(a => a.id === reqAddon.addonId);
            const quantity = reqAddon.quantity;
            itemsToInsert.push({
                sessionId: session.id,
                itemType: 'ADDON',
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
            await bookingSessionRepository.insertSessionItem(item, connection);
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
        err.statusCode = 403;
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
