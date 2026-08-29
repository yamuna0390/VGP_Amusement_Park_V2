const db = require("../../config/database");
const { hashToken } = require("../../utils/bookingSessionToken");
const bookingSessionRepository = require("../../repositories/booking/bookingSessionRepository");
const bookingSessionCustomerRepository = require("../../repositories/booking/bookingSessionCustomerRepository");
const bookingSessionQuoteRepository = require("../../repositories/booking/bookingSessionQuoteRepository");
const ticketRepository = require("../../repositories/catalog/ticketRepository");
const offerRepository = require("../../repositories/catalog/offerRepository");
const addonRepository = require("../../repositories/catalog/addonRepository");

function round2(num) {
    return Math.round(num * 100) / 100;
}

/**
 * Handles API #5 (POST /api/booking/session/quote).
 * 
 * @param {string} rawToken 
 */
async function generateQuote(rawToken) {
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

    // Step validation
    if (!session.visit_date) {
        const err = new Error("Booking step incomplete. Missing visit date.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    const items = await bookingSessionRepository.getSessionItems(session.id);
    const hasTickets = items.some(i => i.item_type === 'TICKET');
    if (!hasTickets) {
        const err = new Error("Booking step incomplete. Missing tickets.");
        err.statusCode = 400;
        err.code = "BOOKING_STEP_INCOMPLETE";
        throw err;
    }

    // Load full details for addons to determine addon_type
    const addonItems = items.filter(i => i.item_type === 'ADDON');
    let dbAddons = [];
    if (addonItems.length > 0) {
        const addonIds = addonItems.map(a => a.addon_id);
        dbAddons = await addonRepository.getActiveAddonsByIds(undefined, addonIds);
    }

    // Load components for OFFER tickets
    const offerItems = items.filter(i => i.item_type === 'TICKET' && i.pricing_type === 'OFFER');
    let offerComponents = [];
    let componentTicketDefs = [];
    if (offerItems.length > 0) {
        const offerItemIds = offerItems.map(i => i.id);
        offerComponents = await bookingSessionRepository.getSessionItemComponents(offerItemIds);
        
        const uniqueTicketTypeIds = [...new Set(offerComponents.map(c => c.ticket_type_id))];
        if (uniqueTicketTypeIds.length > 0) {
            componentTicketDefs = await ticketRepository.getTicketsByIds(undefined, uniqueTicketTypeIds);
        }
    }

    let ticketSubtotal = 0;
    let addonSubtotal = 0;
    let offerDiscount = 0;
    let totalPaidTickets = 0;
    let totalFreeTickets = 0;
    
    // Compute amounts and sub-totals
    const ticketDetails = [];
    const addonDetails = [];

    for (const item of items) {
        if (item.item_type === 'TICKET') {
            const pricingType = item.pricing_type || 'REGULAR';
            
            let amount = 0;
            if (pricingType === 'OFFER') {
                amount = item.quantity * item.unit_price_snapshot;
            } else {
                amount = item.paid_quantity * item.unit_price_snapshot;
            }
            
            ticketSubtotal += amount;

            totalPaidTickets += item.paid_quantity;
            totalFreeTickets += item.free_quantity;

            const ticketDetail = {
                ticketTypeId: item.ticket_type_id,
                code: item.item_code,
                name: item.item_name,
                quantity: item.quantity,
                paidQuantity: item.paid_quantity,
                freeQuantity: item.free_quantity,
                unitPrice: Number(item.unit_price_snapshot),
                pricingType,
                amount: Number(amount.toFixed(2))
            };

            if (pricingType === 'OFFER') {
                const itemComponents = offerComponents.filter(c => c.session_item_id === item.id);
                ticketDetail.components = itemComponents.map(c => {
                    const tDef = componentTicketDefs.find(t => t.id === c.ticket_type_id);
                    return {
                        componentType: c.component_type,
                        ticketTypeId: c.ticket_type_id,
                        code: tDef ? tDef.code : null,
                        name: tDef ? tDef.name : null,
                        quantity: c.quantity
                    };
                });
            }

            ticketDetails.push(ticketDetail);
        } else if (item.item_type === 'ADDON') {
            const amount = item.quantity * item.unit_price_snapshot;
            addonSubtotal += amount;

            const dbAddon = dbAddons.find(a => a.id === item.addon_id);
            const addonType = dbAddon ? dbAddon.addonType : 'OTHER';

            addonDetails.push({
                addonId: item.addon_id,
                code: item.item_code,
                name: item.item_name,
                addonType,
                quantity: item.quantity,
                unitPrice: Number(item.unit_price_snapshot),
                amount: Number(amount.toFixed(2))
            });
        }
    }

    offerDiscount = round2(offerDiscount);
    ticketSubtotal = round2(ticketSubtotal);
    addonSubtotal = round2(addonSubtotal);

    let taxableTicketAmount = ticketSubtotal - offerDiscount;
    if (taxableTicketAmount < 0) taxableTicketAmount = 0;
    taxableTicketAmount = round2(taxableTicketAmount);
    
    // Ticket GST 18%
    let ticketTax = round2(taxableTicketAmount * 0.18);

    // Addon GST 5% only on MEAL_COUPON
    let mealAddonAmount = 0;
    for (const ad of addonDetails) {
        if (ad.addonType === 'MEAL_COUPON') {
            mealAddonAmount += ad.amount;
        }
    }
    let addonTax = round2(mealAddonAmount * 0.05);

    const subtotal = round2(ticketSubtotal + addonSubtotal);
    const couponDiscount = 0; // Not implemented yet
    const totalDiscount = round2(offerDiscount + couponDiscount);
    const totalTax = round2(ticketTax + addonTax);
    const convenienceFee = 40.00;

    let grandTotal = round2(subtotal - totalDiscount + totalTax + convenienceFee);
    if (grandTotal < 0) grandTotal = 0;

    // Transaction to insert quote and update last_activity_at
    const connection = await db.getConnection();
    let quoteVersion = 1;
    let quoteExpiresAt = session.expires_at;

    try {
        await connection.beginTransaction();

        quoteVersion = await bookingSessionQuoteRepository.getNextQuoteVersion(session.id, connection);
        
        await bookingSessionQuoteRepository.insertQuote({
            sessionId: session.id,
            quoteVersion,
            ticketSubtotal,
            addonSubtotal,
            subtotal,
            offerDiscount,
            couponDiscount,
            totalDiscount,
            ticketTax,
            addonTax,
            totalTax,
            convenienceFee,
            grandTotal,
            currency: 'INR',
            expiresAt: quoteExpiresAt
        }, connection);

        // Do not update current_step beyond 3
        const updateQuery = "UPDATE booking_sessions SET last_activity_at = NOW() WHERE id = ?";
        await connection.execute(updateQuery, [session.id]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    const totalVisitors = totalPaidTickets + totalFreeTickets;

    return {
        session: {
            visitDate: session.visit_date,
            bookingType: session.booking_type,
            offerId: session.offer_id,
            currentStep: session.current_step,
            status: session.status
        },
        purchaseSummary: {
            tickets: ticketDetails,
            addons: addonDetails,
            totalPaidTickets,
            totalFreeTickets,
            totalVisitors
        },
        quote: {
            quoteVersion,
            ticketSubtotal,
            addonSubtotal,
            subtotal,
            offerDiscount,
            couponDiscount,
            totalDiscount,
            ticketTax,
            addonTax,
            totalTax,
            convenienceFee,
            grandTotal,
            currency: 'INR',
            expiresAt: quoteExpiresAt
        }
    };
}

module.exports = {
    generateQuote
};
