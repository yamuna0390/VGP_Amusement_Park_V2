const groupQuoteRepository = require("../repositories/groupQuoteRepository");
const whatsappService = require("./whatsapp/whatsappService");
const emailService = require("./notification/emailService");
const notificationService = require("./notificationService");

/**
 * Creates a new Group Quote request.
 * 
 * @param {Object} data 
 * @param {string} data.organisationName
 * @param {number} data.groupSize
 * @param {string} data.preferredDate (YYYY-MM-DD)
 * @param {string} data.contactNumber
 */
async function createGroupQuote(data) {
    const { organisationName, groupSize, preferredDate, contactNumber, email } = data;

    // 1. Validate required fields
    if (!organisationName || typeof organisationName !== "string" || !organisationName.trim()) {
        throw { statusCode: 400, message: "Organisation name is required." };
    }

    if (groupSize === undefined || groupSize === null || isNaN(groupSize)) {
        throw { statusCode: 400, message: "Group size must be a valid number." };
    }

    // 2. Validate group_size is a positive number
    const parsedSize = parseInt(groupSize, 10);
    if (parsedSize <= 0) {
        throw { statusCode: 400, message: "Group size must be a positive number." };
    }

    // 3. Validate preferred_date
    if (!preferredDate) {
        throw { statusCode: 400, message: "Preferred date is required." };
    }
    const parsedDate = new Date(preferredDate);
    if (isNaN(parsedDate.getTime())) {
        throw { statusCode: 400, message: "Invalid preferred date." };
    }
    
    // 4. Reject past dates (must be today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pref = new Date(parsedDate);
    pref.setHours(0, 0, 0, 0);
    if (pref < today) {
        throw { statusCode: 400, message: "Preferred date cannot be in the past." };
    }

    // 5. Validate contact_number
    if (!contactNumber || typeof contactNumber !== "string" || !contactNumber.trim()) {
        throw { statusCode: 400, message: "Contact number is required." };
    }

    // 5b. Validate optional email
    let validEmail = null;
    if (email && typeof email === "string" && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw { statusCode: 400, message: "Please provide a valid email address." };
        }
        validEmail = email.trim();
    }

    const insertData = {
        organisationName: organisationName.trim(),
        groupSize: parsedSize,
        preferredDate: preferredDate, 
        contactNumber: contactNumber.trim(),
        email: validEmail
    };

    // 6. Save to DB
    const id = await groupQuoteRepository.createGroupQuote(insertData);
    console.log(`[GROUP QUOTE] Database saved: ${id}`);

    // 7. Fire Notifications asynchronously so we do not fail the API request if one fails
    // We await it here so that the logs appear sequentially during tests,
    // but internal errors are swallowed so the API still succeeds.
    await sendNotifications(id, insertData);

    return { id };
}

async function sendNotifications(id, insertData) {
    const formattedDate = new Date(insertData.preferredDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const receivedDate = new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

    // --- WhatsApp Notification ---
    const waNumber = process.env.GROUP_QUOTE_WHATSAPP_TO;
    const displayEmail = insertData.email || "Not provided";

    if (waNumber) {
        try {
            const waMessage = `🔔 New Group Quote Request\n\nOrganisation: ${insertData.organisationName}\nGroup Size: ${insertData.groupSize}\nPreferred Date: ${formattedDate}\nContact: ${insertData.contactNumber}\nEmail: ${displayEmail}`;
            const waRes = await whatsappService.sendWhatsAppText(waNumber, waMessage);
            if (waRes.success) {
                console.log("[GROUP QUOTE] WhatsApp notification sent");
            } else {
                console.error(`[GROUP QUOTE] WhatsApp notification failed: ${waRes.error}`);
            }
        } catch (error) {
            console.error(`[GROUP QUOTE] WhatsApp notification failed: ${error.message}`);
        }
    } else {
        console.log("[GROUP QUOTE] GROUP_QUOTE_WHATSAPP_TO not configured, skipping WhatsApp.");
    }

    // --- Email Notification ---
    const emailTo = process.env.GROUP_QUOTE_EMAIL_TO;
    if (emailTo) {
        try {
            const emailText = `New Group Quote Request\n\nOrganisation: ${insertData.organisationName}\nGroup Size: ${insertData.groupSize}\nPreferred Date: ${formattedDate}\nContact Number: ${insertData.contactNumber}\nCustomer Email: ${displayEmail}\n\nReceived: ${receivedDate}`;
            const emailHtml = `
                <h2>New Group Quote Request</h2>
                <p><strong>Organisation:</strong> ${insertData.organisationName}</p>
                <p><strong>Group Size:</strong> ${insertData.groupSize}</p>
                <p><strong>Preferred Date:</strong> ${formattedDate}</p>
                <p><strong>Contact Number:</strong> ${insertData.contactNumber}</p>
                <p><strong>Customer Email:</strong> ${displayEmail}</p>
                <br/>
                <p><small>Received: ${receivedDate}</small></p>
            `;
            await emailService.sendEmail({
                to: emailTo,
                subject: "New Group Quote Request",
                text: emailText,
                html: emailHtml
            });
            console.log("[GROUP QUOTE] Email notification sent");
        } catch (error) {
            console.error(`[GROUP QUOTE] Email notification failed: ${error.message}`);
        }
    } else {
        console.log("[GROUP QUOTE] GROUP_QUOTE_EMAIL_TO not configured, skipping Email.");
    }

    // --- Admin Notification (Internal System) ---
    try {
        await notificationService.createNotification({
            type: "GROUP_QUOTE",
            title: "New Group Quote Request",
            message: `${insertData.organisationName} — Group of ${insertData.groupSize}`,
            referenceId: id
        });
        console.log("[GROUP QUOTE] Admin notification created");
    } catch (error) {
        console.error(`[GROUP QUOTE] Admin notification failed: ${error.message}`);
    }
}

module.exports = {
    createGroupQuote
};
