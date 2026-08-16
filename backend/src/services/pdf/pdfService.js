const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const bookingRepository = require('../../repositories/booking/bookingRepository');

/**
 * Generates an E-Ticket PDF for a given booking ID.
 * Reproduces the visual layout of the frontend ticket using authoritative backend data.
 * 
 * @param {number} bookingId 
 * @param {string} outputPath 
 * @returns {string} The path to the generated PDF
 */
async function generateBookingPdf(bookingId, outputPath) {
    const booking = await bookingRepository.getAdminBookingDetailsById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    const visitDateStr = booking.visit_date 
        ? new Date(booking.visit_date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) 
        : 'N/A';
    
    const bookingDateStr = booking.created_at
        ? new Date(booking.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })
        : 'N/A';

    const fmt = (val) => '₹' + Number(val).toFixed(2);
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(booking.qr_token || '')}`;

    const hasItems = booking.items && booking.items.length > 0;
    const ticketsHTML = hasItems && booking.items.some(i => i.item_type === 'TICKET')
        ? booking.items.filter(i => i.item_type === 'TICKET').map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td style="text-align: center">${item.quantity}</td>
                <td style="text-align: right">${fmt(item.unit_price)}</td>
                <td style="text-align: right">${fmt(item.subtotal)}</td>
            </tr>
        `).join('')
        : `
            <tr>
                <td>Paid Visitors</td>
                <td style="text-align: center">${booking.paid_visitors || 0}</td>
                <td style="text-align: right">-</td>
                <td style="text-align: right">${fmt(booking.ticket_subtotal || 0)}</td>
            </tr>
            ${booking.free_visitors > 0 ? `
            <tr>
                <td>Free Visitors</td>
                <td style="text-align: center">${booking.free_visitors}</td>
                <td style="text-align: right">-</td>
                <td style="text-align: right">₹0.00</td>
            </tr>
            ` : ''}
        `;

    const addonsHTML = hasItems && booking.items.some(i => i.item_type === 'MEAL' || i.item_type === 'ADDON')
        ? booking.items.filter(i => i.item_type === 'MEAL' || i.item_type === 'ADDON').map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td style="text-align: center">${item.quantity}</td>
                <td style="text-align: right">${fmt(item.unit_price)}</td>
                <td style="text-align: right">${fmt(item.subtotal)}</td>
            </tr>
        `).join('')
        : (booking.meal_subtotal > 0 ? `
            <tr>
                <td>Food / Addons</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
                <td style="text-align: right">${fmt(booking.meal_subtotal || 0)}</td>
            </tr>
        ` : '');

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 30px;
                background: #fff;
                color: #333;
            }
            .bk-invoice {
                border: 1.5px solid #eaeaea;
                border-radius: 12px;
                padding: 30px;
                max-width: 800px;
                margin: 0 auto;
            }
            .bk-inv__head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #5e35b1;
                padding-bottom: 14px;
                margin-bottom: 20px;
            }
            .bk-inv__brand {
                font-size: 1.35rem;
                font-weight: 900;
                color: #5e35b1;
            }
            .bk-inv__sub {
                font-size: 0.8rem;
                color: #666;
            }
            .bk-inv__badge {
                font-size: 0.85rem;
                font-weight: 800;
                background: #f3effa;
                color: #5e35b1;
                padding: 4px 10px;
                border-radius: 6px;
            }
            .bk-inv__meta {
                font-size: 0.85rem;
                color: #444;
                margin-bottom: 20px;
            }
            .bk-inv__hr {
                border: 0;
                border-top: 1px dashed #eaeaea;
                margin: 20px 0;
            }
            .bk-inv__two-auto {
                display: flex;
                justify-content: space-between;
            }
            .bk-inv__section-label {
                font-weight: 800;
                color: #888;
                margin-bottom: 6px;
                font-size: 0.75rem;
                letter-spacing: 0.5px;
            }
            .bk-inv__table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.85rem;
                margin-bottom: 20px;
            }
            .bk-inv__table th, .bk-inv__table td {
                padding: 8px 0;
                border-bottom: 1px solid #f3effa;
            }
            .bk-inv__table th {
                border-bottom: 2.5px solid #5e35b1;
                text-align: left;
                color: #5e35b1;
                font-weight: 800;
            }
            .bk-inv__total {
                display: flex;
                justify-content: space-between;
                font-size: 1.1rem;
                font-weight: 900;
                border-top: 2px solid #5e35b1;
                padding-top: 12px;
                margin-bottom: 30px;
                color: #5e35b1;
            }
            .bk-inv__qr-wrap {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .bk-inv__qr {
                border: 2px solid #5e35b1;
                padding: 10px;
                border-radius: 8px;
                background: #fff;
                margin-bottom: 8px;
            }
            .bk-inv__tc {
                font-size: 0.75rem;
                line-height: 1.4;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="bk-invoice">
            <div class="bk-inv__head">
                <div>
                    <div class="bk-inv__brand">👑 VGP UNIVERSAL KINGDOM</div>
                    <div class="bk-inv__sub">Family Amusement &amp; Water Park · ECR, Chennai</div>
                </div>
                <div class="bk-inv__badge">TAX INVOICE · E-TICKET</div>
            </div>

            <div class="bk-inv__meta">
                <strong>Invoice:</strong> ${booking.invoice_number || 'N/A'}<br/>
                <strong>Date:</strong> ${bookingDateStr}<br/>
                <strong>GSTIN:</strong> 33ABCDE1234F1Z5
            </div>

            <hr class="bk-inv__hr" />

            <div class="bk-inv__two-auto">
                <div>
                    <div class="bk-inv__section-label">BILLED TO</div>
                    <div>${booking.guest_name || 'N/A'}</div>
                    <div>${booking.guest_email || 'N/A'}</div>
                    <div>${booking.guest_mobile || 'N/A'}</div>
                </div>
                <div>
                    <div class="bk-inv__section-label">VISIT DETAILS</div>
                    <div>Visit date: <strong>${visitDateStr}</strong></div>
                    <div>Booking ID: <strong>${booking.booking_number}</strong></div>
                </div>
            </div>

            <hr class="bk-inv__hr" />

            <table class="bk-inv__table">
                <thead>
                    <tr>
                        <th>DESCRIPTION</th>
                        <th style="text-align: center">QTY</th>
                        <th style="text-align: right">RATE</th>
                        <th style="text-align: right">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${ticketsHTML}
                    ${addonsHTML}
                    <tr>
                        <td>Discounts</td>
                        <td style="text-align: center">-</td>
                        <td style="text-align: right">-</td>
                        <td style="text-align: right; color: #2e7d32;">-${fmt(booking.total_discount || 0)}</td>
                    </tr>
                    <tr>
                        <td>Taxes & Fees</td>
                        <td style="text-align: center">-</td>
                        <td style="text-align: right">-</td>
                        <td style="text-align: right">${fmt(Number(booking.total_tax || 0) + Number(booking.convenience_fee || 0))}</td>
                    </tr>
                </tbody>
            </table>

            <div class="bk-inv__total">
                <span>Total Payable</span>
                <strong>${fmt(booking.grand_total || 0)}</strong>
            </div>

            <div class="bk-inv__qr-wrap">
                <div class="bk-inv__qr">
                    ${booking.qr_token ? `<img src="${qrUrl}" width="120" height="120" alt="QR Code" />` : 'QR Unavailable'}
                </div>
                <div>
                    Scan at entry<br/><strong>${booking.booking_number}</strong>
                </div>
            </div>

            <div class="bk-inv__tc">
                <strong>Terms &amp; Conditions</strong>
                <ul style="padding-left: 15px; margin: 6px 0 0 0;">
                    <li>No cancellation/postponement after booking.</li>
                    <li>Entry free for children below 90 cm.</li>
                    <li>This QR code is unique to this transaction and is verified at the gate.</li>
                    <li>Official Tax Invoice issued by VGP Universal Kingdom.</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Wait until networkidle0 so external QR image can load
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();
    return outputPath;
}

module.exports = {
    generateBookingPdf
};
