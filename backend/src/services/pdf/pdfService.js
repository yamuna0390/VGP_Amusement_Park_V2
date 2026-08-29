const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/**
 * Generates an E-Ticket PDF for a given booking ID.
 * Reproduces the visual layout of the frontend ticket using canonical rendering.
 * 
 * @param {number} bookingId 
 * @param {string} outputPath 
 * @returns {string} The path to the generated PDF
 */
async function generateBookingPdf(bookingId, outputPath) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const renderUrl = `${frontendUrl}/invoice/${bookingId}?secret=canonical-render-secret`;

    console.log(`[PDF] Generating canonical PDF from ${renderUrl}`);
    
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
    });

    try {
        const page = await browser.newPage();
        
        await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: 2 });
        
        await page.goto(renderUrl, { waitUntil: "networkidle0", timeout: 30000 });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" }
        });

        console.log(`[PDF] Successfully generated canonical PDF at ${outputPath}`);
    } catch (err) {
        console.error(`[PDF] Failed to generate PDF for booking ${bookingId}:`, err);
        throw err;
    } finally {
        await browser.close();
    }

    return outputPath;
}

module.exports = {
    generateBookingPdf
};

