'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an AI assistant prompt.
 *
 * - generateAssistantPrompt - A function that generates a prompt for an AI assistant based on user input.
 * - GenerateAssistantPromptInput - The input type for the generateAssistantPrompt function.
 * - GenerateAssistantPromptOutput - The return type for the generateAssistantPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssistantPromptInputSchema = z.object({
  businessType: z.string().describe('The type of business (e.g., coach, e-commerce seller).'),
  contentDetails: z.string().describe('Details about the content the assistant will use.'),
  exampleQuestions: z.string().describe('Example questions users might ask the assistant.'),
});
export type GenerateAssistantPromptInput = z.infer<typeof GenerateAssistantPromptInputSchema>;

const GenerateAssistantPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt for the AI assistant.'),
});
export type GenerateAssistantPromptOutput = z.infer<typeof GenerateAssistantPromptOutputSchema>;

export async function generateAssistantPrompt(input: GenerateAssistantPromptInput): Promise<GenerateAssistantPromptOutput> {
  return generateAssistantPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAssistantPrompt',
  input: {schema: GenerateAssistantPromptInputSchema},
  output: {schema: GenerateAssistantPromptOutputSchema},
  prompt: `You are an expert prompt engineer specializing in creating prompts for AI assistants.

You will generate a prompt for an AI assistant based on the following information:

Business Type: {{{businessType}}}
Content Details: {{{contentDetails}}}
Example Questions: {{{exampleQuestions}}}

The prompt should instruct the AI assistant to:
- Act as a helpful assistant for the given business type.
- Use the provided content details to answer user questions.
- Be able to answer the example questions and similar questions.

Here's the prompt:
`,
});

const generateAssistantPromptFlow = ai.defineFlow(
  {
    name: 'generateAssistantPromptFlow',
    inputSchema: GenerateAssistantPromptInputSchema,
    outputSchema: GenerateAssistantPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
