require('dotenv').config();
const { sendWhatsAppText } = require('./src/services/whatsapp/whatsappService');

async function runTest() {
    console.log("Starting QikChat WhatsApp connection test...");
    
    if (!process.env.QIKCHAT_API_KEY) {
        console.error("ERROR: QIKCHAT_API_KEY is missing from .env");
        process.exit(1);
    }

    const testNumber = process.argv[2];
    
    if (!testNumber) {
        console.error("Usage: node testWhatsapp.js <TEST_WHATSAPP_NUMBER>");
        console.error("Please provide the number in international format without '+', e.g. 919876543210");
        process.exit(1);
    }

    console.log(`Sending test message to ${testNumber}...`);
    
    const message = "VGP Universal Kingdom WhatsApp API test successful.";
    
    const result = await sendWhatsAppText(testNumber, message);
    
    console.log("=== QIKCHAT DIAGNOSTIC REPORT ===");
    console.log("Recipient Sent To QikChat:", testNumber);
    console.log("HTTP Status:", result.status || "N/A");
    
    if (result.success) {
        console.log("Service Result: SUCCESS (HTTP 200 OK)");
        const data = result.providerResponse || {};
        console.log("Provider Status:", data.status || "N/A");
        console.log("Provider Message:", data.message || "N/A");
        console.log("Message ID:", result.messageId || data.message_id || data.id || "N/A");
        console.log("Queue Status:", data.queue_status || data.delivery_status || "N/A");
        console.log("Full Provider Response:", JSON.stringify(data, null, 2));
    } else {
        console.error("Service Result: FAILED");
        console.error("Error Detail:", result.error);
        const data = result.providerResponse || {};
        console.log("Full Provider Response:", JSON.stringify(data, null, 2));
    }
    console.log("=================================");
}

runTest();
