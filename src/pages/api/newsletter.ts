import type { APIRoute } from 'astro';

const LOOPS_FORM_ID = 'cmhepd87qfls01b0i7veoodr3';
const LOOPS_NEWSLETTER_URL = `https://app.loops.so/api/newsletter-form/${LOOPS_FORM_ID}`;

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const website = formData.get('website') as string; // honeypot
        const timestamp = formData.get('timestamp') as string;

        // Honeypot check - bots fill hidden fields
        if (website) {
            // Return fake success to not reveal detection
            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Time-based check - reject submissions faster than 2 seconds
        if (timestamp) {
            const elapsed = Date.now() - parseInt(timestamp, 10);
            if (elapsed < 2000) {
                // Return fake success to not reveal detection
                return new Response(
                    JSON.stringify({ success: true }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Validate email
        if (!email || !email.includes('@')) {
            return new Response(
                JSON.stringify({ success: false, error: 'Please enter a valid email address' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Send to Loops newsletter form (per docs: https://loops.so/docs/forms/custom-form)
        const formBody = `email=${encodeURIComponent(email)}&source=${encodeURIComponent('website')}`;

        const loopsResponse = await fetch(LOOPS_NEWSLETTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
        });

        const data = await loopsResponse.json();
        console.log('Loops response:', loopsResponse.status, data);

        if (!data.success) {
            console.error('Loops API error:', data.message);
            return new Response(
                JSON.stringify({ success: false, error: data.message || 'Subscription failed. Please try again.' }),
                { status: loopsResponse.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Something went wrong. Please try again.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
