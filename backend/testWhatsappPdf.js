require('dotenv').config();
const { sendWhatsAppDocument } = require('./src/services/whatsapp/whatsappService');
const db = require('./src/config/database');

async function runTest() {
    console.log("Starting QikChat E-ticket PDF delivery test...");

    const bookingId = process.argv[2];
    const testNumber = process.argv[3];
    const publicDomain = process.env.PUBLIC_DOMAIN;

    if (!bookingId || !testNumber) {
        console.error("Usage: node testWhatsappPdf.js <BOOKING_ID> <WHATSAPP_NUMBER>");
        console.error("Please set PUBLIC_DOMAIN in your .env or run: $env:PUBLIC_DOMAIN='https://your-tunnel.trycloudflare.com'; node testWhatsappPdf.js ...");
        process.exit(1);
    }

    if (!publicDomain) {
        console.error("ERROR: PUBLIC_DOMAIN is missing. Start Cloudflare tunnel and set it in environment.");
        process.exit(1);
    }

    try {
        const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        const booking = rows[0];

        if (!booking) {
            console.error(`ERROR: Booking ID ${bookingId} not found.`);
            process.exit(1);
        }

        const qrToken = booking.qr_token;
        if (!qrToken) {
            console.error(`ERROR: Booking ID ${bookingId} does not have a qr_token.`);
            process.exit(1);
        }

        const pdfUrl = `${publicDomain}/api/tickets/pdf/${qrToken}`;
        
        // Mask token for display
        const maskedToken = qrToken.substring(0, 4) + '...' + qrToken.substring(qrToken.length - 4);
        console.log(`Public PDF URL: ${publicDomain}/api/tickets/pdf/${maskedToken}`);

        console.log(`Checking if URL is reachable...`);
        const checkRes = await fetch(pdfUrl);
        if (checkRes.status !== 200) {
            console.error(`ERROR: URL returned status ${checkRes.status}. Ensure backend is running and tunnel is active.`);
            process.exit(1);
        }
        console.log(`✅ URL is reachable and returned ${checkRes.status} (Content-Type: ${checkRes.headers.get('content-type')})`);

        console.log(`Sending PDF to ${testNumber} via QikChat...`);
        const filename = `VGP_Tickets.pdf`; // User specified exact filename
        const result = await sendWhatsAppDocument(testNumber, pdfUrl, filename);

        console.log("\n=== QIKCHAT DIAGNOSTIC REPORT ===");
        console.log("Recipient Sent To QikChat:", testNumber);
        console.log("HTTP Status:", result.status || "N/A");
        
        if (result.success) {
            console.log("Service Result: SUCCESS (HTTP 200 OK)");
            const data = result.providerResponse || {};
            console.log("Provider Status:", data.status || "N/A");
            console.log("Provider Message:", data.message || "N/A");
            
            let messageId = "N/A";
            let queueStatus = "N/A";
            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                messageId = data.data[0].id || "N/A";
                queueStatus = data.data[0].status || "N/A";
            }
            
            console.log("Message ID:", messageId);
            console.log("Queue Status:", queueStatus);
        } else {
            console.error("Service Result: FAILED");
            console.error("Error Detail:", result.error);
        }
        console.log("=================================\n");

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await db.end();
        process.exit(0);
    }
}

runTest();
