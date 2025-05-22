'use server';

/**
 * @fileOverview Summarizes the user's daily logs to track long-term trends in habit and lifestyle adherence.
 *
 * - summarizeDailyLog - A function that handles the summarization of the daily log.
 * - SummarizeDailyLogInput - The input type for the summarizeDailyLog function.
 * - SummarizeDailyLogOutput - The return type for the summarizeDailyLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDailyLogInputSchema = z.object({
  dailyLog: z
    .string()
    .describe('The complete daily log, containing information about habits, schedule, nutrition, and study activities.'),
});
export type SummarizeDailyLogInput = z.infer<typeof SummarizeDailyLogInputSchema>;

const SummarizeDailyLogOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the daily log, highlighting key activities, habits, and trends.'),
});
export type SummarizeDailyLogOutput = z.infer<typeof SummarizeDailyLogOutputSchema>;

export async function summarizeDailyLog(input: SummarizeDailyLogInput): Promise<SummarizeDailyLogOutput> {
  return summarizeDailyLogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDailyLogPrompt',
  input: {schema: SummarizeDailyLogInputSchema},
  output: {schema: SummarizeDailyLogOutputSchema},
  prompt: `You are an AI assistant that analyzes daily logs to identify patterns and trends in user habits and lifestyle.

  Based on the provided daily log, create a summary highlighting key activities, habit adherence, and overall trends. Focus on identifying areas of improvement and positive habits.

  Daily Log:
  {{dailyLog}}`,
});

const summarizeDailyLogFlow = ai.defineFlow(
  {
    name: 'summarizeDailyLogFlow',
    inputSchema: SummarizeDailyLogInputSchema,
    outputSchema: SummarizeDailyLogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
