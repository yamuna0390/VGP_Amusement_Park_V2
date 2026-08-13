/**
 * Service to handle WhatsApp communication using QikChat API.
 */
async function sendWhatsAppText(toContact, message) {
    const apiKey = process.env.QIKCHAT_API_KEY;
    
    if (!apiKey) {
        return {
            success: false,
            error: "QIKCHAT_API_KEY is not configured in the environment."
        };
    }

    if (!toContact || !message) {
        return {
            success: false,
            error: "toContact and message are required."
        };
    }

    try {
        const payload = {
            to_contact: toContact,
            type: "text",
            text: {
                body: message
            }
        };

        const response = await fetch("https://api.qikchat.in/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "QIKCHAT-API-KEY": apiKey
            },
            body: JSON.stringify(payload)
        });

        // Try to parse JSON safely
        let data = {};
        const textResponse = await response.text();
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            data = { error: "Non-JSON response", raw: textResponse };
        }

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: data.message || data.error || data.raw || "Failed to send WhatsApp message"
            };
        }

        return {
            success: true,
            messageId: data.message_id || data.id || null,
            status: response.status,
            providerResponse: data
        };

    } catch (error) {
        // Handle network errors or other unexpected exceptions cleanly
        return {
            success: false,
            error: error.message || "A network or unexpected error occurred"
        };
    }
}

async function sendWhatsAppDocument(toContact, documentLink, documentFilename) {
    const apiKey = process.env.QIKCHAT_API_KEY;
    
    if (!apiKey) {
        return {
            success: false,
            error: "QIKCHAT_API_KEY is not configured in the environment."
        };
    }

    if (!toContact || !documentLink) {
        return {
            success: false,
            error: "toContact and documentLink are required."
        };
    }

    try {
        const payload = {
            to_contact: toContact,
            type: "document",
            document: {
                link: documentLink,
                filename: documentFilename || "Document.pdf"
            }
        };

        const response = await fetch("https://api.qikchat.in/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "QIKCHAT-API-KEY": apiKey
            },
            body: JSON.stringify(payload)
        });

        let data = {};
        const textResponse = await response.text();
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            data = { error: "Non-JSON response", raw: textResponse };
        }

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: data.message || data.error || data.raw || "Failed to send WhatsApp document"
            };
        }

        return {
            success: true,
            messageId: data.message_id || data.id || null,
            status: response.status,
            providerResponse: data
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || "A network or unexpected error occurred"
        };
    }
}

module.exports = {
    sendWhatsAppText,
    sendWhatsAppDocument
};
