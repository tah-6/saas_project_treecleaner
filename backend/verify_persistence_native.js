const http = require('http');

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(body ? JSON.parse(body) : {});
                } else {
                    reject(new Error(`Request failed: ${res.statusCode} ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    try {
        console.log('1. Creating Subscription...');
        const created = await request('POST', '/api/subscriptions', {
            serviceName: 'NativeNodeTest',
            amount: 10.50,
            category: 'TEST'
        });
        console.log('   Created ID:', created.id);

        console.log('2. Verifying Retrieval...');
        const list = await request('GET', '/api/subscriptions');
        const found = list.find(s => s.id === created.id);

        if (found) {
            console.log('   SUCCESS: Found in DB.');
        } else {
            throw new Error('   FAILURE: Not found.');
        }

        console.log('3. Cleaning up...');
        await request('DELETE', `/api/subscriptions/${created.id}`);
        console.log('   Cleanup complete.');

    } catch (err) {
        console.error('TEST FAILED:', err.message);
        process.exit(1);
    }
}

test();
