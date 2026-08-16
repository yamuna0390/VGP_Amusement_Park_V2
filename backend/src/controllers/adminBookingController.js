const bookingRepository = require('../repositories/booking/bookingRepository');

async function getAdminBookings(req, res, next) {
    try {
        const { page = 1, limit = 10, search, visit_date, payment_status, booking_status, created_date } = req.query;

        const parsedPage = Math.max(1, parseInt(page));
        const parsedLimit = Math.max(1, parseInt(limit));
        const offset = (parsedPage - 1) * parsedLimit;

        const filters = {
            search: search ? String(search).trim() : null,
            visit_date: visit_date || null,
            payment_status: payment_status || null,
            booking_status: booking_status || null,
            created_date: created_date || null,
            limit: parsedLimit,
            offset
        };

        const { data, total } = await bookingRepository.getAllBookings(filters);

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit)
            }
        });
    } catch (error) {
        next(error);
    }
}

async function getAdminBookingDetails(req, res, next) {
    try {
        const { id } = req.params;
        const bookingId = parseInt(id);

        if (isNaN(bookingId)) {
            return res.status(400).json({ success: false, message: "Invalid booking ID" });
        }

        const bookingDetails = await bookingRepository.getAdminBookingDetailsById(bookingId);

        if (!bookingDetails) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        return res.status(200).json({
            success: true,
            data: bookingDetails
        });
    } catch (error) {
        next(error);
    }
}

const fs = require('fs');
const path = require('path');
const { generateBookingPdf } = require('../services/pdf/pdfService');

async function getAdminTicketPdf(req, res, next) {
    try {
        const { id } = req.params;
        const bookingId = parseInt(id);

        if (isNaN(bookingId)) {
            return res.status(400).json({ success: false, message: "Invalid booking ID" });
        }

        const booking = await bookingRepository.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const tempFilename = `admin_ticket_${booking.id}_${Date.now()}.pdf`;
        const outputPath = path.join(__dirname, '../../tmp', tempFilename);

        const tmpDir = path.dirname(outputPath);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        await generateBookingPdf(booking.id, outputPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Ticket_${booking.booking_number}.pdf"`);

        const readStream = fs.createReadStream(outputPath);
        readStream.pipe(res);

        readStream.on('end', () => {
            fs.unlink(outputPath, (err) => {});
        });
        
        readStream.on('error', (err) => {
            next(err);
        });

    } catch (error) {
        next(error);
    }
}

// Similarly for invoice if there's a generateInvoicePdf function, but if there isn't we can just reuse generateBookingPdf as the invoice. Wait, is there a generateInvoicePdf in pdfService? Let's check what's exported.
// I will check pdfService later, but for now I will export getAdminTicketPdf
module.exports = {
    getAdminBookings,
    getAdminBookingDetails,
    getAdminTicketPdf
};
