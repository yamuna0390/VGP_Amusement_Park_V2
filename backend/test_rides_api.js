require('dotenv').config();
const request = require('supertest');
const app = require('./src/app');

async function runTests() {
    console.log("Testing GET /api/rides...");
    let res = await request(app).get('/api/rides');
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log(`Count: ${res.body.data.length}`);
        if (res.body.data.length > 0) {
            console.log(`First Ride: ${res.body.data[0].name}, Gallery: ${res.body.data[0].gallery.length}, Safety: ${res.body.data[0].safety_rules.length}`);
        }
    } else {
        console.log(res.body);
    }

    console.log("\nTesting GET /api/rides/castle-jet...");
    res = await request(app).get('/api/rides/castle-jet');
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
        const ride = res.body.data;
        console.log(`Ride Name: ${ride.name}`);
        console.log(`Category: ${ride.category}`);
        console.log(`Hero Type: ${ride.hero_type}`);
        console.log(`Gallery Count: ${ride.gallery.length}`);
        console.log(`Safety Count: ${ride.safety_rules.length}`);
    } else {
        console.log(res.body);
    }

    console.log("\nTesting GET /api/rides/non-existent-ride...");
    res = await request(app).get('/api/rides/non-existent-ride');
    console.log(`Status: ${res.statusCode}`);
    console.log(res.body);

    process.exit(0);
}

runTests();
