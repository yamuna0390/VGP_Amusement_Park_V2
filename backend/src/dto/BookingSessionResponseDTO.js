class BookingSessionResponseDTO {
    static fromEntities({
        sessionId,
        visitDate,
        bookingType,
        offerId,
        expiresAt,
        tickets,
        offers,
        offerMappings,
        offerSchedules,
        addons
    }) {
        // Build ticket types
        const ticketTypes = (tickets || []).map(t => ({
            id: Number(t.id),
            code: t.code,
            name: t.name,
            description: t.description,
            price: Number(t.price),
            displayOrder: Number(t.display_order)
        }));

        // Build offers with their nested mappings and schedules
        const offersList = (offers || []).map(o => {
            const mappings = (offerMappings || [])
                .filter(m => m.offerId === o.id)
                .map(m => ({
                    ticketTypeId: Number(m.ticketTypeId),
                    ticketCode: m.ticketCode,
                    ticketName: m.ticketName,
                    minQty: Number(m.minQty),
                    freeQty: Number(m.freeQty)
                }));

            const schedules = (offerSchedules || [])
                .filter(s => s.offerId === o.id)
                .map(s => ({
                    dayOfWeek: s.dayOfWeek,
                    validFrom: s.validFrom,
                    validUntil: s.validUntil
                }));

            return {
                id: Number(o.id),
                offerCode: o.offer_code,
                offerName: o.offer_name,
                instruction: o.instruction || "",
                promotionType: o.promotion_type,
                discountValue: Number(o.discount_value),
                validFrom: o.valid_from,
                validTo: o.valid_to,
                minAdvanceDays: Number(o.min_advance_days || 0),
                status: o.status,
                priority: Number(o.priority),
                eligible: o.eligible !== undefined ? o.eligible : true,
                reason: o.reason || null,
                ticketMappings: mappings,
                scheduleRules: schedules
            };
        });

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

        const selectedOffer = offerId ? offersList.find(o => o.id === offerId) : null;

        const response = {
            session: {
                visitDate: visitDate || null,
                bookingType: bookingType || "REGULAR",
                offerId: offerId || null,
                offerCode: selectedOffer ? selectedOffer.offerCode : null,
                offerName: selectedOffer ? selectedOffer.offerName : null,
                currentStep: 1,
                status: "ACTIVE",
                expiresAt: expiresAt
            },
            tickets: ticketTypes,
            offers: offersList,
            addons: addonsList
        };

        return response;
    }

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
                        pricingType: session.booking_type === 'OFFER' && offerMappings.some(m => m.offerId === session.offer_id && m.ticketTypeId === Number(i.ticket_type_id)) ? "OFFER" : "REGULAR"
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
