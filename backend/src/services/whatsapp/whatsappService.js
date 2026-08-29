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

        let data = {};
        const textResponse = await response.text();
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            data = { error: "Non-JSON response", raw: textResponse };
        }

        const logicalStatus = data.status || 'N/A';
        const providerMessage = data.message || data.error || data.raw || "N/A";
        
        let messageId = data.message_id || data.id || null;
        if (!messageId && data.data && Array.isArray(data.data) && data.data.length > 0) {
            messageId = data.data[0].id || null;
        }

        console.log(`[QikChat API - Text] HTTP: ${response.status} | Status: ${logicalStatus} | Message: ${providerMessage} | MsgID: ${messageId || 'N/A'}`);

        if (!response.ok || logicalStatus === "error" || logicalStatus === "failed") {
            return {
                success: false,
                status: response.status,
                error: providerMessage !== "N/A" ? providerMessage : "Failed to send WhatsApp message"
            };
        }

        return {
            success: true,
            messageId: messageId,
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

        const logicalStatus = data.status || 'N/A';
        const providerMessage = data.message || data.error || data.raw || "N/A";
        
        let messageId = data.message_id || data.id || null;
        if (!messageId && data.data && Array.isArray(data.data) && data.data.length > 0) {
            messageId = data.data[0].id || null;
        }

        console.log(`[QikChat API - Document] HTTP: ${response.status} | Status: ${logicalStatus} | Message: ${providerMessage} | MsgID: ${messageId || 'N/A'}`);

        if (!response.ok || logicalStatus === "error" || logicalStatus === "failed") {
            return {
                success: false,
                status: response.status,
                error: providerMessage !== "N/A" ? providerMessage : "Failed to send WhatsApp document"
            };
        }

        return {
            success: true,
            messageId: messageId,
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

async function sendWhatsAppBookingTemplate(toContact, customerName, bookingNumber, visitDate, pdfUrl) {
    const apiKey = process.env.QIKCHAT_API_KEY;
    
    if (!apiKey) {
        return {
            success: false,
            error: "QIKCHAT_API_KEY is not configured in the environment."
        };
    }

    if (!toContact || !customerName || !bookingNumber || !visitDate || !pdfUrl) {
        return {
            success: false,
            error: "toContact, customerName, bookingNumber, visitDate, and pdfUrl are required."
        };
    }

    try {
        const payload = {
            to_contact: toContact,
            type: "template",
            template: {
                name: "vgp_ticket_pdf",
                language: "en",
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "document",
                                document: {
                                    link: pdfUrl,
                                    filename: "VGP_Ticket.pdf"
                                }
                            }
                        ]
                    },
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: String(customerName) },
                            { type: "text", text: String(bookingNumber) },
                            { type: "text", text: String(visitDate) }
                        ]
                    }
                ]
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

        const logicalStatus = data.status || 'N/A';
        const providerMessage = data.message || data.error || data.raw || "N/A";
        
        let messageId = data.message_id || data.id || null;
        if (!messageId && data.data && Array.isArray(data.data) && data.data.length > 0) {
            messageId = data.data[0].id || null;
        }

        console.log(`[QikChat API - Template] HTTP: ${response.status} | Status: ${logicalStatus} | Message: ${providerMessage} | MsgID: ${messageId || 'N/A'}`);

        if (!response.ok || logicalStatus === "error" || logicalStatus === "failed") {
            return {
                success: false,
                status: response.status,
                error: providerMessage !== "N/A" ? providerMessage : "Failed to send WhatsApp template"
            };
        }

        return {
            success: true,
            messageId: messageId,
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
    sendWhatsAppDocument,
    sendWhatsAppBookingTemplate
};
