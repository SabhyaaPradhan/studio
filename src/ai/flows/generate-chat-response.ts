'use server';

/**
 * @fileOverview A Genkit flow for generating a helpful AI chat response.
 *
 * - generateChatResponse - A function that generates a response to a user's message.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The generated AI response.'),
  confidence: z.number().describe('The confidence score of the response.'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;


export async function generateChatResponse(input: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are a professional and helpful AI assistant for a business owner. Your goal is to help them craft perfect responses to their clients.

Analyze the user's message and the conversation history. Based on this, generate a helpful and professional response.

CONVERSATION HISTORY:
{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{else}}
No history.
{{/if}}

USER MESSAGE:
{{{message}}}

Based on the user's message, provide a well-crafted response.
If the user's request is unclear, ask for clarification.
The response should be ready to be sent to a client.
Also provide a confidence score for your response based on how well you understood the request.
`,
});


const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
