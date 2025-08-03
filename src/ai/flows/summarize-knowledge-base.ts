'use server';

/**
 * @fileOverview A flow that summarizes a knowledge base.
 *
 * - summarizeKnowledgeBase - A function that summarizes a knowledge base.
 * - SummarizeKnowledgeBaseInput - The input type for the summarizeKnowledgeBase function.
 * - SummarizeKnowledgeBaseOutput - The return type for the summarizeKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeKnowledgeBaseInputSchema = z.object({
  knowledgeBase: z
    .string()
    .describe('The knowledge base to summarize.'),
});
export type SummarizeKnowledgeBaseInput = z.infer<typeof SummarizeKnowledgeBaseInputSchema>;

const SummarizeKnowledgeBaseOutputSchema = z.object({
  summary: z.string().describe('A summary of the knowledge base.'),
});
export type SummarizeKnowledgeBaseOutput = z.infer<typeof SummarizeKnowledgeBaseOutputSchema>;

export async function summarizeKnowledgeBase(input: SummarizeKnowledgeBaseInput): Promise<SummarizeKnowledgeBaseOutput> {
  return summarizeKnowledgeBaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeKnowledgeBasePrompt',
  input: {schema: SummarizeKnowledgeBaseInputSchema},
  output: {schema: SummarizeKnowledgeBaseOutputSchema},
  prompt: `You are an expert at summarizing knowledge bases.

  Please provide a concise summary of the following knowledge base:
  \n
  {{{knowledgeBase}}}`,
});

const summarizeKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'summarizeKnowledgeBaseFlow',
    inputSchema: SummarizeKnowledgeBaseInputSchema,
    outputSchema: SummarizeKnowledgeBaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
