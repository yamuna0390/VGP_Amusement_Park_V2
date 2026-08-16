const jwt = require("jsonwebtoken");
require('dotenv').config();

const adminToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

fetch('http://localhost:5000/api/admin/bookings?limit=5', {
    headers: {
        'Authorization': `Bearer ${adminToken}`
    }
}).then(res => res.json()).then(data => {
    console.log("Bookings API Response:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.data && data.data.length > 0) {
        const id = data.data[0].id;
        return fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        }).then(res => res.json()).then(details => {
            console.log("Booking Details API Response:");
            console.log(JSON.stringify(details, null, 2));
        });
    }
}).catch(console.error);
