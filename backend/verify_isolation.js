const http = require('http');

function request(method, path, headers, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: body ? JSON.parse(body) : {}
                });
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testIsolation() {
    try {
        console.log('1. User A creating subscription...');
        const createRes = await request('POST', '/api/subscriptions', { 'x-user-id': 'user_A' }, {
            serviceName: 'User A Secret Service',
            amount: 100,
            category: 'TEST'
        });
        const subId = createRes.body.id;
        console.log('   Created ID:', subId);

        console.log('2. User B trying to see subscriptions...');
        const readResB = await request('GET', '/api/subscriptions', { 'x-user-id': 'user_B' });
        const foundB = Array.isArray(readResB.body) && readResB.body.find(s => s.id === subId);

        if (!foundB) {
            console.log('   SUCCESS: User B cannot see User A\'s subscription.');
        } else {
            throw new Error('   FAILURE: User B SAW User A\'s subscription!');
        }

        console.log('3. User B trying to delete User A\'s subscription...');
        const deleteResB = await request('DELETE', `/api/subscriptions/${subId}`, { 'x-user-id': 'user_B' });
        if (deleteResB.statusCode === 404) {
            console.log('   SUCCESS: User B failed to delete (404 Not Found).');
        } else if (deleteResB.statusCode === 204) {
            // Technically 204 means success, but we need to verify if it's actually gone for A
            console.warn('   WARNING: User B got 204. Checking if data persisted for A...');
        }

        console.log('4. User A verifying data still exists...');
        const readResA = await request('GET', '/api/subscriptions', { 'x-user-id': 'user_A' });
        const foundA = readResA.body.find(s => s.id === subId);

        if (foundA) {
            console.log('   SUCCESS: Subscription still exists for User A.');
        } else {
            throw new Error('   FAILURE: Subscription was deleted!');
        }

        console.log('5. Cleanup (User A deleting)...');
        await request('DELETE', `/api/subscriptions/${subId}`, { 'x-user-id': 'user_A' });
        console.log('   Cleanup complete.');

    } catch (err) {
        console.error('TEST FAILED:', err.message);
        process.exit(1);
    }
}

testIsolation();
