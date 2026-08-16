const fs = require('fs');
const path = require('path');
const bookingRepository = require('../../repositories/booking/bookingRepository');
const { generateBookingPdf } = require('../pdf/pdfService');
const emailService = require('../notification/emailService');
const whatsappService = require('../whatsapp/whatsappService');

function normalizeWhatsAppNumber(mobile) {
    if (!mobile) return null;
    let num = String(mobile).trim();
    if (num.startsWith('+')) {
        num = num.substring(1);
    }
    num = num.replace(/\D/g, ''); // Remove non-digits
    
    if (num.length === 10) {
        return '91' + num;
    } else if (num.length === 12 && num.startsWith('91')) {
        return num;
    }
    return null;
}

/**
 * Service to handle post-booking notifications (Email, WhatsApp, etc.)
 */
async function sendBookingConfirmation(bookingId) {
    let outputPath = null;

    try {
        const booking = await bookingRepository.getBookingById(bookingId);
        if (!booking) {
            console.error(`[BOOKING NOTIFICATION] Booking ID ${bookingId} not found.`);
            return;
        }

        if (!booking.guest_email) {
            console.warn(`[BOOKING NOTIFICATION] No guest email found for Booking ID ${bookingId}. Skipping email.`);
            return;
        }

        // Generate PDF
        const tempFilename = `email_ticket_${booking.id}_${Date.now()}.pdf`;
        outputPath = path.join(__dirname, '../../../tmp', tempFilename);

        const tmpDir = path.dirname(outputPath);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        try {
            await generateBookingPdf(booking.id, outputPath);
        } catch (error) {
            console.error(`[BOOKING EMAIL] PDF generation failed: ${error.message}`);
            return; // Exit if PDF fails, we don't send the email without the attachment
        }

        // Format dates safely
        const visitDateStr = booking.visit_date
            ? new Date(booking.visit_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })
            : 'N/A';

        // Prepare email
        const subject = `Your VGP Universal Kingdom Ticket Confirmation - Booking ${booking.booking_number}`;
        
        const text = `Hi ${booking.guest_name},\n\nYour booking at VGP Universal Kingdom has been confirmed successfully.\n\nBooking ID: ${booking.booking_number}\nVisit Date: ${visitDateStr}\n\nPlease find your Tax Invoice · E-Ticket PDF attached to this email.\n\nPlease present the e-ticket PDF at the park entrance for scanning.\n\nThank you for booking with VGP Universal Kingdom!`;
        
        const html = `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <p>Hi ${booking.guest_name},</p>
                <p>Your booking at VGP Universal Kingdom has been confirmed successfully.</p>
                <p>
                    <strong>Booking ID:</strong> ${booking.booking_number}<br/>
                    <strong>Visit Date:</strong> ${visitDateStr}
                </p>
                <p>Please find your <strong>Tax Invoice · E-Ticket PDF</strong> attached to this email.</p>
                <p>Please present the e-ticket PDF at the park entrance for scanning.</p>
                <p>Thank you for booking with VGP Universal Kingdom!</p>
            </div>
        `;

        try {
            await emailService.sendEmail({
                to: booking.guest_email,
                subject: subject,
                text: text,
                html: html,
                attachments: [
                    {
                        filename: 'VGP_Ticket.pdf',
                        path: outputPath
                    }
                ]
            });
            console.log(`[BOOKING EMAIL] Confirmation email sent successfully to ${booking.guest_email}`);
        } catch (error) {
            console.error(`[BOOKING EMAIL] Email sending failed: ${error.message}`);
        }

        try {
            if (booking.guest_mobile && booking.whatsapp_delivery) {
                const normalizedMobile = normalizeWhatsAppNumber(booking.guest_mobile);
                
                if (!normalizedMobile) {
                    console.log(`[BOOKING WHATSAPP] Invalid customer mobile number`);
                } else if (!process.env.PUBLIC_DOMAIN) {
                    console.log(`[BOOKING WHATSAPP] PUBLIC_DOMAIN is not configured`);
                } else if (!booking.qr_token) {
                    console.log(`[BOOKING WHATSAPP] qr_token is missing for Booking ID ${bookingId}`);
                } else {
                    const pdfUrl = `${process.env.PUBLIC_DOMAIN}/api/tickets/pdf/${booking.qr_token}`;
                    
                    const whatsappResult = await whatsappService.sendWhatsAppBookingTemplate(
                        normalizedMobile,
                        booking.guest_name || 'Guest',
                        booking.booking_number,
                        visitDateStr,
                        pdfUrl
                    );
                    
                    if (whatsappResult.success) {
                        console.log(`[BOOKING WHATSAPP] WhatsApp template queued (Message ID: ${whatsappResult.messageId})`);
                    } else {
                        console.error(`[BOOKING WHATSAPP] WhatsApp notification failed: ${whatsappResult.error}`);
                    }
                }
            } else {
                console.log(`[BOOKING WHATSAPP] No guest mobile found for Booking ID ${bookingId}. Skipping WhatsApp.`);
            }
        } catch (error) {
            console.error(`[BOOKING WHATSAPP] WhatsApp notification failed: ${error.message}`);
        }

    } catch (error) {
        console.error(`[BOOKING NOTIFICATION] Unexpected error during notification workflow: ${error.message}`);
    } finally {
        // Cleanup temporary PDF if it exists
        if (outputPath && fs.existsSync(outputPath)) {
            try {
                fs.unlinkSync(outputPath);
            } catch (cleanupError) {
                console.error(`[BOOKING EMAIL] Temporary PDF cleanup failed: ${cleanupError.message}`);
            }
        }
    }
}

module.exports = {
    sendBookingConfirmation
};
