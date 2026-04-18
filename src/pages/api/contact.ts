import type { APIRoute } from 'astro';
import { EXTERNAL_URLS } from '../../constants';
import { json } from '../../utils/http';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const formData = await request.formData();

        // Return fake success so bots can't detect the honeypot
        if (formData.get('botcheck')) {
            return json({ success: true });
        }

        const accessKey = locals.runtime?.env?.WEB3FORMS_ACCESS_KEY || import.meta.env.WEB3FORMS_ACCESS_KEY;

        if (!accessKey) {
            console.error('WEB3FORMS_ACCESS_KEY not configured');
            return json({ success: false, error: 'Server configuration error' }, 500);
        }

        formData.append("access_key", accessKey);

        const response = await fetch(EXTERNAL_URLS.services.web3forms, {
            method: "POST",
            body: formData,
        });

        const data = await response.json() as { success?: boolean; message?: string };

        if (!data.success) {
            return json({ success: false, error: 'Submission failed. Please try again.' }, response.status);
        }

        return json({ success: true });

    } catch (error) {
        console.error('Contact form error:', error);
        return json({ success: false, error: 'Submission failed' }, 500);
    }
};
