const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf16le').trim();

fetch('http://localhost:5000/api/admin/bookings?limit=5', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then(res => res.json()).then(data => {
    console.log("Bookings API Response:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.data && data.data.length > 0) {
        const id = data.data[0].id;
        return fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(details => {
            console.log("Booking Details API Response:");
            console.log(JSON.stringify(details, null, 2));
        });
    }
}).catch(console.error);
