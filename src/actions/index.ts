import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';



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
    }),
    handler: async ({ email }, context) => {
      const env = context.locals.runtime.env;

      // Add/update contact in Loops
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
