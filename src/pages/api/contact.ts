import type { APIRoute } from 'astro';
import { EXTERNAL_URLS } from '../../constants';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const formData = await request.formData();

        // Fast path: Honeypot check
        if (formData.get('botcheck')) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const accessKey = (locals as any).runtime?.env?.WEB3FORMS_ACCESS_KEY || import.meta.env.WEB3FORMS_ACCESS_KEY;

        if (!accessKey) {
            console.error('WEB3FORMS_ACCESS_KEY not configured');
            return new Response(JSON.stringify({ success: false, error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Attach secret key server-side
        formData.append("access_key", accessKey);

        const response = await fetch(EXTERNAL_URLS.services.web3forms, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Submission failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
