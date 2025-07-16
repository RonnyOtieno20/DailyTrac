'use server';

/**
 * @fileOverview Summarizes a week of daily logs to track weekly trends.
 *
 * - summarizeWeeklyLogs - A function that handles the summarization of daily logs for a week.
 * - SummarizeWeeklyLogsInput - The input type for the summarizeWeeklyLogs function.
 * - SummarizeWeeklyLogsOutput - The return type for the summarizeWeeklyLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWeeklyLogsInputSchema = z.object({
  dailyLogs: z.array(z.string()).describe('An array of daily log strings for the entire week.'),
});
export type SummarizeWeeklyLogsInput = z.infer<typeof SummarizeWeeklyLogsInputSchema>;

const SummarizeWeeklyLogsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the week, highlighting key activities, habits, and trends.'),
});
export type SummarizeWeeklyLogsOutput = z.infer<typeof SummarizeWeeklyLogsOutputSchema>;

export async function summarizeWeeklyLogs(input: SummarizeWeeklyLogsInput): Promise<SummarizeWeeklyLogsOutput> {
  return summarizeWeeklyLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWeeklyLogsPrompt',
  input: {schema: SummarizeWeeklyLogsInputSchema},
  output: {schema: SummarizeWeeklyLogsOutputSchema},
  prompt: `You are an AI assistant that analyzes a week's worth of daily logs to identify patterns and trends in a user's habits and lifestyle.

Based on the provided daily logs, create a summary of the week. Highlight key achievements, consistent habits, areas of improvement, and any challenges faced.

Daily Logs:
{{#each dailyLogs}}
--- Day Start ---
{{{this}}}
--- Day End ---
{{/each}}
`,
});

const summarizeWeeklyLogsFlow = ai.defineFlow(
  {
    name: 'summarizeWeeklyLogsFlow',
    inputSchema: SummarizeWeeklyLogsInputSchema,
    outputSchema: SummarizeWeeklyLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
