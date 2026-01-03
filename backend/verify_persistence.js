const fetch = require('node-fetch');

async function testPersistence() {
    const baseUrl = 'http://localhost:3000/api/subscriptions';
    const testSub = {
        serviceName: 'Verification Test Service',
        amount: 99.99,
        category: 'OTHER',
        billingFrequency: 'MONTHLY',
        billingDate: new Date().toISOString()
    };

    try {
        console.log('1. Creating Subscription...');
        const createRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testSub)
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`);
        const created = await createRes.json();
        console.log('   Created ID:', created.id);

        console.log('2. Verifying Retrieval...');
        const getRes = await fetch(baseUrl);
        const list = await getRes.json();
        const found = list.find(s => s.id === created.id);

        if (found) {
            console.log('   SUCCESS: Subscription found in DB.');
        } else {
            throw new Error('   FAILURE: Subscription not found after creation.');
        }

        console.log('3. Cleanup...');
        await fetch(`${baseUrl}/${created.id}`, { method: 'DELETE' });
        console.log('   Cleanup complete.');

    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    }
}

testPersistence();
