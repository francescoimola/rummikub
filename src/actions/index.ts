import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

interface LoopsApiResponse {
  success: boolean;
  id?: string;
  message?: string;
}

export const server = {
  subscribeNewsletter: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Please enter a valid email address'),
      turnstileToken: z.string().min(1, 'Verification required'),
    }),
    handler: async ({ email, turnstileToken }, context) => {
      const env = context.locals.runtime.env;

      if (!env.TURNSTILE_SECRET_KEY) {
        console.error('TURNSTILE_SECRET_KEY is not defined');
        throw new Error('System configuration error');
      }

      // 1. Verify Turnstile token
      const formData = new FormData();
      formData.append('secret', env.TURNSTILE_SECRET_KEY);
      formData.append('response', turnstileToken);
      // Optional: append remoteip
      // formData.append('remoteip', context.request.headers.get('CF-Connecting-IP') || '');

      const turnstileRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: formData,
        }
      );

      const turnstile: TurnstileVerifyResponse = await turnstileRes.json();

      if (!turnstile.success) {
        console.error('Turnstile verification failed:', JSON.stringify(turnstile));
        throw new Error('Verification failed. Please try again.');
      }

      // 2. Add/update contact in Loops
      if (!env.LOOPS_API_KEY) {
        console.error('LOOPS_API_KEY is not defined');
        throw new Error('System configuration error');
      }

      const loopsRes = await fetch(
        'https://app.loops.so/api/v1/contacts/update',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!loopsRes.ok) {
        const errorData: LoopsApiResponse = await loopsRes.json();
        console.error('Loops API error:', JSON.stringify(errorData));
        throw new Error(errorData.message || 'Subscription failed. Please try again.');
      }

      return { success: true };
    },
  }),
};
