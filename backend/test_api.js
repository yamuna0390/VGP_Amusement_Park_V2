const mysql = require('mysql2/promise');

async function runTest(quantity) {
    console.log('\n--- Testing Little Legend x' + quantity + ' ---');
    let res = await fetch('http://localhost:5000/api/booking/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitDate: '2026-10-10' }) // Assume Saturday
    });
    let sessionData = await res.json();
    let sessionId = sessionData.data.id;
    let cookie = res.headers.get('set-cookie');
    let cookieStr = cookie ? cookie.split(';')[0] : '';
    
    let offersRes = await fetch('http://localhost:5000/api/offers?visitDate=2026-10-10');
    let offersDataResponse = await offersRes.json();
    let offersData = offersDataResponse.data || offersDataResponse;
    let littleLegend = offersData.find(o => o.displayName && o.displayName.toLowerCase().includes('little legend')) || offersData[0];
    
    let ticketsRes = await fetch('http://localhost:5000/api/tickets');
    let ticketsData = await ticketsRes.json();
    let adultTicket = ticketsData.find(t => t.name && t.name.toLowerCase().includes('adult')) || ticketsData[0];
    
    let itemsPayload = {
        tickets: [{ ticketTypeId: adultTicket.id, quantity: 1 }],
        offerTickets: [{ offerTicketId: littleLegend.id, quantity: quantity }],
        addons: []
    };
    
    let itemsRes = await fetch('http://localhost:5000/api/booking/session/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieStr },
        body: JSON.stringify(itemsPayload)
    });
    let itemsResData = await itemsRes.json();
    if (!itemsResData.success) {
        console.log("ITEMS FAILED:", itemsResData);
    }
    
    let customerPayload = {
        leadTravellerName: 'Test User', email: 'test@example.com', mobile: '9999999999'
    };
    let custRes = await fetch('http://localhost:5000/api/booking/session/customer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieStr },
        body: JSON.stringify(customerPayload)
    });
    let custResData = await custRes.json();
    if (!custResData.success) {
        console.log("CUST FAILED:", custResData);
    }
    
    res = await fetch('http://localhost:5000/api/booking/session/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieStr }
    });
    let quoteData = await res.json();
    console.log("QUOTE DATA:");
    console.log(JSON.stringify(quoteData, null, 2));
    
    // DB inspection
    require('dotenv').config();
    const db = mysql.createPool({ 
        host: process.env.DB_HOST || 'localhost', 
        user: process.env.DB_USER || 'root', 
        password: process.env.DB_PASSWORD || '', 
        database: process.env.DB_NAME || 'vgp_park' 
    });
    const [items] = await db.query('SELECT * FROM booking_session_items WHERE session_id = ?', [sessionId]);
    if(items.length > 0) {
        const [components] = await db.query('SELECT * FROM booking_session_item_components WHERE session_item_id IN (?)', [items.map(i => i.id)]);
        console.log('\nCOMPONENTS ROWS:');
        console.log(components);
    }
    await db.end();
}

async function main() {
    await runTest(1);
    await runTest(2);
}
main().catch(console.error);
