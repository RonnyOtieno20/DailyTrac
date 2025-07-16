'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { summarizeWeeklyLogs } from '@/ai/flows/weekly-summary';
import { summarizeMonthlyLogs } from '@/ai/flows/monthly-summary';
import { formatDataForAISummary, getInitialDailyLogData } from '@/lib/dataUtils';
import type { DailyLogData, MonthData } from '@/lib/types';
import { BarChartBig, Loader2 } from 'lucide-react';
import {
  getISOWeek,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from 'date-fns';

interface TrendsViewProps {
  allDaysData: MonthData;
  selectedDate: string;
}

export function TrendsView({ allDaysData, selectedDate }: TrendsViewProps) {
  const { toast } = useToast();
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState('');
  const [monthlySummary, setMonthlySummary] = useState('');

  const handleGenerateWeeklySummary = async () => {
    setIsLoadingWeekly(true);
    setWeeklySummary('');
    try {
      const date = new Date(selectedDate);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

      const dailyLogs = daysInWeek.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayData = allDaysData[dateKey] || getInitialDailyLogData(dateKey);
        return formatDataForAISummary(dayData);
      });

      const result = await summarizeWeeklyLogs({ dailyLogs });
      if (result.summary) {
        setWeeklySummary(result.summary);
        toast({ title: 'Weekly Summary Generated!' });
      } else {
        toast({ title: 'Error', description: 'Failed to generate weekly summary.', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'An error occurred while generating the weekly summary.', variant: 'destructive' });
    } finally {
      setIsLoadingWeekly(false);
    }
  };

  const handleGenerateMonthlySummary = async () => {
    setIsLoadingMonthly(true);
    setMonthlySummary('');
    try {
        const date = new Date(selectedDate);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // For monthly summary, we'll use the AI-generated daily summaries if they exist
        // This is a placeholder for a more robust weekly -> monthly summary chain
        // A better approach would be to generate weekly summaries first, then monthly
        const dailySummaries = daysInMonth.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = allDaysData[dateKey];
            return dayData?.ai_summary ? `Summary for ${dateKey}:\n${dayData.ai_summary}` : `No summary for ${dateKey}.`;
        });
        
        // This is a simplification. We're passing daily summaries as "weekly" to the monthly flow.
        const result = await summarizeMonthlyLogs({ weeklySummaries: dailySummaries });

        if (result.summary) {
            setMonthlySummary(result.summary);
            toast({ title: 'Monthly Summary Generated!' });
        } else {
            toast({ title: 'Error', description: 'Failed to generate monthly summary.', variant: 'destructive' });
        }
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'An error occurred while generating the monthly summary.', variant: 'destructive' });
    } finally {
        setIsLoadingMonthly(false);
    }
};

  const selectedDateObj = new Date(selectedDate);
  const weekNumber = getISOWeek(selectedDateObj);
  const monthName = format(selectedDateObj, 'MMMM');
  const year = selectedDateObj.getFullYear();


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BarChartBig size={24} />
          Trends & Summaries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="mt-4 space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Summary for Week {weekNumber} of {year}
            </p>
            <Button onClick={handleGenerateWeeklySummary} disabled={isLoadingWeekly} className="w-full">
              {isLoadingWeekly && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoadingWeekly ? 'Generating...' : 'Generate Weekly Summary'}
            </Button>
            {weeklySummary && (
              <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {weeklySummary}
              </div>
            )}
          </TabsContent>
          <TabsContent value="monthly" className="mt-4 space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Summary for {monthName} {year}
            </p>
            <Button onClick={handleGenerateMonthlySummary} disabled={isLoadingMonthly} className="w-full">
               {isLoadingMonthly && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLoadingMonthly ? 'Generating...' : 'Generate Monthly Summary'}
            </Button>
            {monthlySummary && (
                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {monthlySummary}
                </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
