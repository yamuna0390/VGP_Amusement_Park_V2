require('dotenv').config();
const path = require('path');
const { generateBookingPdf } = require('./src/services/pdf/pdfService');

async function runTest() {
    console.log("Starting local PDF generation test...");
    const testBookingId = process.argv[2];
    
    if (!testBookingId) {
        console.error("Usage: node testPdf.js <EXISTING_BOOKING_ID>");
        console.error("Example: node testPdf.js 1");
        process.exit(1);
    }

    try {
        const outputPath = path.join(__dirname, `test_ticket_${testBookingId}.pdf`);
        console.log(`Generating PDF for booking ID ${testBookingId}...`);
        
        const finalPath = await generateBookingPdf(testBookingId, outputPath);
        
        console.log("✅ PDF Generated successfully!");
        console.log("Saved at:", finalPath);
        console.log("Please open the PDF manually and verify:");
        console.log("- Layout matches e-ticket");
        console.log("- Data matches booking");
        console.log("- QR code encodes the qr_token exactly");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to generate PDF:");
        console.error(error);
        process.exit(1);
    }
}

runTest();
