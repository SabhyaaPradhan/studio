
'use server';

/**
 * @fileOverview A Genkit flow for generating an AI reply for the customer inbox.
 *
 * - generateInboxReply - A function that generates a reply to a customer's message.
 * - GenerateInboxReplyInput - The input type for the generateInboxReply function.
 * - GenerateInboxReplyOutput - The return type for the generateInboxReply function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInboxReplyInputSchema = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  replyType: z.enum(["apology", "order_update", "refund_request", "upsell", "custom"]),
  customInstructions: z.string().optional(),
  history: z.array(z.object({
      id: z.string(),
      messageType: z.enum(['incoming', 'outgoing']),
      senderName: z.string(),
      content: z.string(),
      createdAt: z.string(),
  })),
});
export type GenerateInboxReplyInput = z.infer<typeof GenerateInboxReplyInputSchema>;

const GenerateInboxReplyOutputSchema = z.object({
  generatedReply: z.string().describe('The AI-generated reply to the customer.'),
  confidence: z.number().describe('A confidence score (0-100) of how well the AI addressed the request.'),
});
export type GenerateInboxReplyOutput = z.infer<typeof GenerateInboxReplyOutputSchema>;

export async function generateInboxReply(input: GenerateInboxReplyInput): Promise<GenerateInboxReplyOutput> {
  return generateInboxReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInboxReplyPrompt',
  input: { schema: GenerateInboxReplyInputSchema },
  output: { schema: GenerateInboxReplyOutputSchema },
  prompt: `You are a professional and empathetic customer support agent for a business. Your goal is to craft a perfect, ready-to-send response to a customer's message based on the provided conversation history and specific instructions.

## CONTEXT
- **Business Name:** Savrii
- **Your Persona:** Helpful, clear, and professional. Avoid overly casual language unless the customer initiates it.

## CONVERSATION HISTORY
{{#each history}}
- **{{senderName}} ({{messageType}} at {{createdAt}}):** {{{content}}}
{{/each}}

## CURRENT TASK
- **Customer Message to Reply To (ID: {{messageId}}):** {{{history.[history.length-1].content}}}
- **Required Reply Type:** {{replyType}}

## INSTRUCTIONS
Based on the **Reply Type**, generate a response.
{{#if customInstructions}}
- **Custom Instructions:** {{{customInstructions}}}
{{/if}}

- **For 'apology'**: Acknowledge the customer's issue, offer a sincere apology, and provide a path to resolution.
- **For 'order_update'**: Provide a clear and concise update on the order status. If you don't have the info, explain how they can get it.
- **For 'refund_request'**: Handle the request with empathy. Explain the next steps for the refund process.
- **For 'upsell'**: After addressing any primary query, subtly introduce a relevant product or service that might interest the customer.
- **For 'custom'**: Strictly follow the custom instructions provided above.

## RESPONSE GENERATION
- Generate only the text for the reply. Do not add greetings like "Hi [Name]," unless it's part of the requested tone. The application will add the salutation.
- Provide a confidence score from 0-100 on how well you were able to fulfill the request based on the provided information. If the request is ambiguous or you lack information, provide a lower score.
`,
});

const generateInboxReplyFlow = ai.defineFlow(
  {
    name: 'generateInboxReplyFlow',
    inputSchema: GenerateInboxReplyInputSchema,
    outputSchema: GenerateInboxReplyOutputSchema,
  },
  async (input) => {
    // Find the specific message to reply to from the history
    const messageToReplyTo = input.history.find(m => m.id === input.messageId);
    if (!messageToReplyTo) {
        throw new Error(`Message with ID ${input.messageId} not found in history.`);
    }

    // A more specific input for the prompt might be better in a real app
    const { output } = await prompt(input);
    return output!;
  }
);
