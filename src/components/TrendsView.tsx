
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { summarizeWeeklyLogs } from '@/ai/flows/weekly-summary';
import { summarizeMonthlyLogs } from '@/ai/flows/monthly-summary';
import { formatDataForAISummary, getInitialDailyLogData } from '@/lib/dataUtils';
import type { DailyLogData, KeyStats, MonthData } from '@/lib/types';
import { BarChartBig, Loader2 } from 'lucide-react';
import {
  getISOWeek,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isValid,
  isSaturday,
  isLastDayOfMonth,
} from 'date-fns';
import { KeyStatsDisplay } from './KeyStatsDisplay';

interface TrendsViewProps {
  allDaysData: MonthData;
  selectedDate: string;
}

const calculateStats = (days: DailyLogData[]): KeyStats => {
    const stats: KeyStats = {
        sleepGoalMet: 0,
        totalDays: days.length,
        exerciseDays: 0,
        avgCaloriesBurned: 0,
        avgWaterIntake: 0,
        avgTotalCalories: 0,
        totalStudyHours: 0,
    };

    let totalCaloriesBurned = 0;
    let exerciseDayCount = 0;

    let totalWaterIntake = 0;
    let waterDayCount = 0;

    let totalCaloriesConsumed = 0;
    let calorieDayCount = 0;

    let totalStudyHours = 0;
    
    days.forEach(day => {
        if (day.schedule_sleep_met_goal) stats.sleepGoalMet++;
        if (day.habit_exercise) stats.exerciseDays++;

        const caloriesBurned = parseFloat(day.schedule_exercise_calories_burned);
        if (!isNaN(caloriesBurned) && caloriesBurned > 0) {
            totalCaloriesBurned += caloriesBurned;
            exerciseDayCount++;
        }

        const waterIntake = parseFloat(day.nutrition_water_intake);
         if (!isNaN(waterIntake) && waterIntake > 0) {
            totalWaterIntake += waterIntake;
            waterDayCount++;
        }

        const totalCalories = parseFloat(day.day_stats_total_calories);
        if (!isNaN(totalCalories) && totalCalories > 0) {
            totalCaloriesConsumed += totalCalories;
            calorieDayCount++;
        }

        const studyHours = parseFloat(day.study_log_hours);
        if(!isNaN(studyHours) && studyHours > 0) {
            totalStudyHours += studyHours;
        }
    });

    if (exerciseDayCount > 0) stats.avgCaloriesBurned = totalCaloriesBurned / exerciseDayCount;
    if (waterDayCount > 0) stats.avgWaterIntake = totalWaterIntake / waterDayCount;
    if (calorieDayCount > 0) stats.avgTotalCalories = totalCaloriesConsumed / calorieDayCount;
    stats.totalStudyHours = totalStudyHours;
    
    return stats;
}


export function TrendsView({ allDaysData, selectedDate }: TrendsViewProps) {
  const { toast } = useToast();
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState('');
  const [monthlySummary, setMonthlySummary] = useState('');
  const [weeklyStats, setWeeklyStats] = useState<KeyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<KeyStats | null>(null);
  
  const selectedDateObj = new Date(selectedDate + 'T00:00:00'); // Ensure TZ consistency
  if (!isValid(selectedDateObj)) {
    return <div>Invalid date selected.</div>;
  }

  const isTodaySaturday = isSaturday(selectedDateObj);
  const isTodayLastDayOfMonth = isLastDayOfMonth(selectedDateObj);

  const getDaysInRange = (start: Date, end: Date): DailyLogData[] => {
    return eachDayOfInterval({ start, end }).map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        return allDaysData[dateKey] || getInitialDailyLogData(dateKey);
    });
  };

  const handleGenerateWeeklySummary = async () => {
    setIsLoadingWeekly(true);
    setWeeklySummary('');
    setWeeklyStats(null);
    try {
      const weekStart = startOfWeek(selectedDateObj, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(selectedDateObj, { weekStartsOn: 1 });
      const daysInWeek = getDaysInRange(weekStart, weekEnd);
      
      const dailyLogs = daysInWeek.map(day => formatDataForAISummary(day));

      const result = await summarizeWeeklyLogs({ dailyLogs });
      if (result.summary) {
        setWeeklySummary(result.summary);
        toast({ title: 'Weekly Summary Generated!' });
      } else {
        toast({ title: 'Error', description: 'Failed to generate weekly summary.', variant: 'destructive' });
      }

      setWeeklyStats(calculateStats(daysInWeek));

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
    setMonthlyStats(null);
    try {
        const monthStart = startOfMonth(selectedDateObj);
        const monthEnd = endOfMonth(selectedDateObj);
        const daysInMonth = getDaysInRange(monthStart, monthEnd);

        const dailySummaries = daysInMonth.map(day => {
            return day.ai_summary ? `Summary for ${format(new Date(day.creation_date + 'T00:00:00'), 'yyyy-MM-dd')}:\n${day.ai_summary}` : `No summary for ${format(new Date(day.creation_date + 'T00:00:00'), 'yyyy-MM-dd')}.`;
        });
        
        const result = await summarizeMonthlyLogs({ weeklySummaries: dailySummaries });

        if (result.summary) {
            setMonthlySummary(result.summary);
            toast({ title: 'Monthly Summary Generated!' });
        } else {
            toast({ title: 'Error', description: 'Failed to generate monthly summary.', variant: 'destructive' });
        }
        
        setMonthlyStats(calculateStats(daysInMonth));

    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'An error occurred while generating the monthly summary.', variant: 'destructive' });
    } finally {
        setIsLoadingMonthly(false);
    }
};

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
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Summary for Week {weekNumber} of {year}
              </p>
              {!isTodaySaturday && (
                <p className="text-xs text-muted-foreground">
                  Weekly reports can be generated on Saturdays.
                </p>
              )}
            </div>
            <Button onClick={handleGenerateWeeklySummary} disabled={isLoadingWeekly || !isTodaySaturday} className="w-full">
              {isLoadingWeekly && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoadingWeekly ? 'Generating...' : 'Generate Weekly Report'}
            </Button>
            {weeklyStats && <KeyStatsDisplay stats={weeklyStats} />}
            {weeklySummary && (
              <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                <h4 className="font-semibold mb-2 text-foreground">AI Summary</h4>
                {weeklySummary}
              </div>
            )}
          </TabsContent>
          <TabsContent value="monthly" className="mt-4 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Summary for {monthName} {year}
              </p>
              {!isTodayLastDayOfMonth && (
                 <p className="text-xs text-muted-foreground">
                    Monthly reports can be generated on the last day of the month.
                 </p>
              )}
            </div>
            <Button onClick={handleGenerateMonthlySummary} disabled={isLoadingMonthly || !isTodayLastDayOfMonth} className="w-full">
               {isLoadingMonthly && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLoadingMonthly ? 'Generating...' : 'Generate Monthly Report'}
            </Button>
            {monthlyStats && <KeyStatsDisplay stats={monthlyStats} />}
            {monthlySummary && (
                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    <h4 className="font-semibold mb-2 text-foreground">AI Summary</h4>
                    {monthlySummary}
                </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
