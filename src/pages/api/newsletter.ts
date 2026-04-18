import type { APIRoute } from 'astro';
import { EXTERNAL_URLS } from '../../constants';
import { json } from '../../utils/http';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const website = formData.get('website') as string;
        const timestamp = formData.get('timestamp') as string;

        // Return fake success so bots can't detect the honeypot or timing checks
        if (website) {
            return json({ success: true });
        }

        if (timestamp) {
            const elapsed = Date.now() - parseInt(timestamp, 10);
            if (elapsed < 2000) {
                return json({ success: true });
            }
        }

        if (!email || !email.includes('@')) {
            return json({ success: false, error: 'Please enter a valid email address' }, 400);
        }

        const formBody = `email=${encodeURIComponent(email)}&source=${encodeURIComponent('website')}`;

        const loopsResponse = await fetch(EXTERNAL_URLS.services.loops, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody,
        });

        const data = await loopsResponse.json() as { success?: boolean; message?: string };

        if (!data.success) {
            console.error('Loops API error:', data.message);
            return json({ success: false, error: data.message || 'Subscription failed. Please try again.' }, loopsResponse.status);
        }

        return json({ success: true });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
    }
};
