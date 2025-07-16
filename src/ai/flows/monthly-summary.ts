'use server';

/**
 * @fileOverview Summarizes a month of weekly summaries to track long-term trends.
 *
 * - summarizeMonthlyLogs - A function that handles the summarization of weekly summaries.
 * - SummarizeMonthlyLogsInput - The input type for the summarizeMonthlyLogs function.
 * - SummarizeMonthlyLogsOutput - The return type for the summarizeMonthlyLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMonthlyLogsInputSchema = z.object({
  weeklySummaries: z.array(z.string()).describe('An array of weekly summary strings for the entire month.'),
});
export type SummarizeMonthlyLogsInput = z.infer<typeof SummarizeMonthlyLogsInputSchema>;

const SummarizeMonthlyLogsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the month, highlighting long-term trends, achievements, and areas for focus.'),
});
export type SummarizeMonthlyLogsOutput = z.infer<typeof SummarizeMonthlyLogsOutputSchema>;

export async function summarizeMonthlyLogs(input: SummarizeMonthlyLogsInput): Promise<SummarizeMonthlyLogsOutput> {
  return summarizeMonthlyLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMonthlyLogsPrompt',
  input: {schema: SummarizeMonthlyLogsInputSchema},
  output: {schema: SummarizeMonthlyLogsOutputSchema},
  prompt: `You are an AI assistant that analyzes a month's worth of weekly summaries to identify long-term patterns, progress, and overall trends in a user's habits and lifestyle.

Based on the provided weekly summaries, create a comprehensive monthly overview. Focus on:
- Consistent habits and successes.
- Areas that showed improvement over the month.
- Persistent challenges or areas needing more attention.
- Overall mood and energy level trends.

Weekly Summaries:
{{#each weeklySummaries}}
--- Weekly Summary Start ---
{{{this}}}
--- Weekly Summary End ---
{{/each}}
`,
});

const summarizeMonthlyLogsFlow = ai.defineFlow(
  {
    name: 'summarizeMonthlyLogsFlow',
    inputSchema: SummarizeMonthlyLogsInputSchema,
    outputSchema: SummarizeMonthlyLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
