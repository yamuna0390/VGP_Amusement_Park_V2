const fs = require('fs');
const path = require('path');
const bookingRepository = require('../repositories/booking/bookingRepository');
const { generateBookingPdf } = require('../services/pdf/pdfService');

/**
 * GET /api/tickets/pdf/:qrToken
 * Securely generate and download the e-ticket PDF for a given QR token.
 */
const downloadPdf = async (req, res, next) => {
    try {
        const { qrToken } = req.params;

        if (!qrToken || qrToken.length < 32) {
            return res.status(400).json({ success: false, message: "Invalid authorization token format" });
        }

        const booking = await bookingRepository.getBookingByQrToken(qrToken);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Ticket not found or unauthorized" });
        }

        if (booking.booking_status !== 'CONFIRMED' || booking.payment_status !== 'SUCCESS') {
            return res.status(403).json({ success: false, message: "Ticket not found or unauthorized" });
        }

        const tempFilename = `ticket_${booking.id}_${Date.now()}.pdf`;
        const outputPath = path.join(__dirname, '../../tmp', tempFilename);

        const tmpDir = path.dirname(outputPath);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        await generateBookingPdf(booking.id, outputPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="VGP_Tickets.pdf"`);

        const readStream = fs.createReadStream(outputPath);
        readStream.pipe(res);

        readStream.on('end', () => {
            fs.unlink(outputPath, (err) => {
                // Ignore cleanup errors
            });
        });
        
        readStream.on('error', (err) => {
            next(err);
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    downloadPdf
};
