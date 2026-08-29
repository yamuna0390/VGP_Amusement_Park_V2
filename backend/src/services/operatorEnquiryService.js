const operatorEnquiryRepository = require("../repositories/operatorEnquiryRepository");
const whatsappService = require("./whatsapp/whatsappService");
const emailService = require("./notification/emailService");
const notificationService = require("./notificationService");

/**
 * Creates a new Operator Enquiry.
 * 
 * @param {Object} data 
 * @param {string} data.operator_name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.message
 */
async function createOperatorEnquiry(data) {
    const { operator_name, email, phone, message } = data;

    // 1. Validate operator_name
    if (!operator_name || typeof operator_name !== "string" || !operator_name.trim()) {
        throw { statusCode: 400, message: "Operator name is required." };
    }

    // 2. Validate email
    if (!email || typeof email !== "string" || !email.trim()) {
        throw { statusCode: 400, message: "Email is required." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw { statusCode: 400, message: "Please provide a valid email address." };
    }

    // 3. Validate phone
    if (!phone || typeof phone !== "string" || !phone.trim()) {
        throw { statusCode: 400, message: "Phone number is required." };
    }

    // 4. Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
        throw { statusCode: 400, message: "Message is required." };
    }

    // Normalize
    const insertData = {
        operatorName: operator_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim()
    };

    // 5. Save to DB
    const id = await operatorEnquiryRepository.createOperatorEnquiry(insertData);
    console.log(`[OPERATOR ENQUIRY] Database saved: ${id}`);

    // 6. Fire Notifications asynchronously so we do not fail the API request if one fails
    await sendNotifications(id, insertData);

    return { id };
}

async function sendNotifications(id, insertData) {
    const receivedDate = new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

    // --- WhatsApp Notification ---
    const waNumber = process.env.OPERATOR_ENQUIRY_WHATSAPP_TO || process.env.GROUP_QUOTE_WHATSAPP_TO;

    if (waNumber) {
        try {
            const waMessage = `🔔 Message from Operator\n\nOperator Name: ${insertData.operatorName}\nEmail: ${insertData.email}\nPhone: ${insertData.phone}\n\nMessage:\n${insertData.message}\n\nEnquiry ID: ${id}`;
            const waRes = await whatsappService.sendWhatsAppText(waNumber, waMessage);
            if (waRes.success) {
                console.log("[OPERATOR ENQUIRY] WhatsApp notification sent");
            } else {
                console.error(`[OPERATOR ENQUIRY] WhatsApp notification failed: ${waRes.error}`);
            }
        } catch (error) {
            console.error(`[OPERATOR ENQUIRY] WhatsApp notification failed: ${error.message}`);
        }
    } else {
        console.log("[OPERATOR ENQUIRY] WHATSAPP_TO not configured, skipping WhatsApp.");
    }

    // --- Email Notification ---
    const emailTo = process.env.OPERATOR_ENQUIRY_EMAIL_TO || process.env.GROUP_QUOTE_EMAIL_TO;
    if (emailTo) {
        try {
            const emailText = `Message from Operator\n\nOperator Name: ${insertData.operatorName}\nEmail: ${insertData.email}\nPhone: ${insertData.phone}\n\nMessage:\n${insertData.message}\n\nEnquiry ID: ${id}\nSubmitted At: ${receivedDate}`;
            const emailHtml = `
                <h2>Message from Operator</h2>
                <p><strong>Operator Name:</strong> ${insertData.operatorName}</p>
                <p><strong>Email:</strong> ${insertData.email}</p>
                <p><strong>Phone:</strong> ${insertData.phone}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                    ${insertData.message.replace(/\n/g, '<br>')}
                </blockquote>
                <br/>
                <p><small>Enquiry ID: ${id}</small></p>
                <p><small>Submitted At: ${receivedDate}</small></p>
            `;
            await emailService.sendEmail({
                to: emailTo,
                subject: "Message from Operator",
                text: emailText,
                html: emailHtml
            });
            console.log("[OPERATOR ENQUIRY] Email notification sent");
        } catch (error) {
            console.error(`[OPERATOR ENQUIRY] Email notification failed: ${error.message}`);
        }
    } else {
        console.log("[OPERATOR ENQUIRY] EMAIL_TO not configured, skipping Email.");
    }

    // --- Admin Notification (Internal System) ---
    try {
        await notificationService.createNotification({
            type: "OPERATOR_ENQUIRY",
            title: "Message from Operator",
            message: `Operator Name: ${insertData.operatorName}\nEmail: ${insertData.email}\nPhone: ${insertData.phone}\nMessage: ${insertData.message}`,
            referenceId: id
        });
        console.log("[OPERATOR ENQUIRY] Admin notification created");
    } catch (error) {
        console.error(`[OPERATOR ENQUIRY] Admin notification failed: ${error.message}`);
    }
}

module.exports = {
    createOperatorEnquiry
};
