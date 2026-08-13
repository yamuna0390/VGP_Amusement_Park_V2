const http = require('http');

function request(method, path, data = null, cookie = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (cookie) {
            options.headers['Cookie'] = cookie;
        }

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                let parsed;
                try {
                    parsed = JSON.parse(resData);
                } catch (e) {
                    parsed = resData;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: parsed
                });
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    try {
        console.log("1. Creating session...");
        const res1 = await request('POST', '/api/booking/session');
        const cookieStr = res1.headers['set-cookie'] ? res1.headers['set-cookie'][0] : null;
        if (!cookieStr) throw new Error("No cookie received.");
        const cookie = cookieStr.split(';')[0];
        console.log("   Cookie:", cookie);

        const visitDateStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        console.log("2. Updating session date...");
        const res2 = await request('PATCH', '/api/booking/session', {
            visitDate: visitDateStr,
            bookingType: "REGULAR"
        }, cookie);
        if (!res2.data.success) throw new Error("Update session failed.");

        console.log("3. Updating items...");
        const res3 = await request('PUT', '/api/booking/session/items', {
            tickets: [{ ticketTypeId: 4, quantity: 2 }],
            addons: []
        }, cookie);
        if (!res3.data.success) throw new Error("Update items failed.");

        console.log("4. Updating customer...");
        const res4 = await request('PUT', '/api/booking/session/customer', {
            leadTravellerName: "Malavika",
            email: "malu9809@gmail.com",
            mobile: "9809448856",
            whatsappDelivery: true
        }, cookie);
        if (!res4.data.success) throw new Error("Update customer failed.");

        console.log("5. Generating quote...");
        const res5 = await request('POST', '/api/booking/session/quote', null, cookie);
        if (!res5.data.success) throw new Error("Generate quote failed.");
        console.log("   Quote:", JSON.stringify(res5.data.data.quote));

        console.log("6. Creating payment order...");
        const res6 = await request('POST', '/api/booking/payment/order', null, cookie);
        console.log("   Payment Order Response:", res6.status, JSON.stringify(res6.data));

        if (res6.data.success) {
            console.log("\nSuccess! Order created.");
        } else {
            console.log("\nFailed to create order.");
        }
    } catch (e) {
        console.error("Test failed:", e);
    }
}

run();
