class BookingSessionResponseDTO {
    /**
     * API 1
     * POST /api/booking/session
     *
     * Creates the clean initial booking-session response.
     *
     * API 1 intentionally does NOT return:
     * - tickets
     * - offers
     * - offerMappings
     * - offerSchedules
     *
     * Those are fetched through separate APIs.
     */
    static fromEntities({
        sessionId,
        visitDate,
        bookingType,
        offerId,
        expiresAt,
        addons
    }) {
        // Build addons
        const addonsList = (addons || []).map(a => ({
            id: Number(a.id),
            code: a.code,
            name: a.name,
            description: a.description,
            addonType: a.addonType,
            price: Number(a.price),
            displayOrder: Number(a.displayOrder)
        }));

        return {
            session: {
                sessionId: sessionId,
                visitDate: visitDate || null,
                bookingType: bookingType || "REGULAR",
                offerId: offerId || null,
                currentStep: 1,
                status: "ACTIVE",
                expiresAt: expiresAt
            },
            addons: addonsList
        };
    }

    /**
     * PUT /api/booking/session/items
     *
     * Returns the updated ticket/addon selections.
     */
    static fromSessionItems(session, items, offerMappings = []) {
        return {
            session: {
                visitDate: session.visit_date,
                bookingType: session.booking_type,
                offerId: session.offer_id,
                currentStep: session.current_step,
                status: session.status,
                expiresAt: session.expires_at
            },
            items: {
                tickets: items
                    .filter(i => i.item_type === 'TICKET')
                    .map(i => ({
                        ticketTypeId: Number(i.ticket_type_id),
                        code: i.item_code,
                        name: i.item_name,
                        quantity: Number(i.quantity),
                        paidQuantity: Number(i.paid_quantity),
                        freeQuantity: Number(i.free_quantity),
                        unitPrice: Number(i.unit_price_snapshot),
                        pricingType:
                            session.booking_type === 'OFFER' &&
                            offerMappings.some(
                                m =>
                                    m.offerId === session.offer_id &&
                                    m.ticketTypeId === Number(i.ticket_type_id)
                            )
                                ? "OFFER"
                                : "REGULAR"
                    })),

                addons: items
                    .filter(i => i.item_type === 'ADDON')
                    .map(i => ({
                        addonId: Number(i.addon_id),
                        code: i.item_code,
                        name: i.item_name,
                        quantity: Number(i.quantity),
                        paidQuantity: Number(i.paid_quantity),
                        freeQuantity: Number(i.free_quantity),
                        unitPrice: Number(i.unit_price_snapshot)
                    }))
            }
        };
    }

    /**
     * PUT /api/booking/session/customer
     *
     * Returns updated customer information.
     */
    static fromCustomerItems(session, customer) {
        return {
            customer: {
                leadTravellerName: customer.leadTravellerName,
                email: customer.email,
                mobile: customer.mobile,
                whatsappDelivery: customer.whatsappDelivery
            },
            session: {
                currentStep: session.current_step,
                status: session.status
            }
        };
    }
}

module.exports = BookingSessionResponseDTO;