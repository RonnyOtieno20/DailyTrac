
'use client';

import { useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DailyLogData, MonthData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getInitialDailyLogData } from '@/lib/dataUtils';

interface ActivityHeatmapProps {
  allDaysData: MonthData;
  displayDate: Date;
}

// These are the boolean fields that represent a completed task in the schedule
const scheduleCompletionKeys: (keyof DailyLogData)[] = [
  'schedule_sleep_met_goal',
  'schedule_exercise_workout_complete',
  'schedule_shower_1_done',
  'schedule_am_grooming_done',
  'schedule_breakfast_ate',
  'schedule_walk_complete_6k_steps',
  'schedule_read_gte_1hr',
  'schedule_lunch_prep_eat_clean_done',
  'schedule_entertainment_1_flex_intentional',
  'schedule_personal_time_errands_flex_intentional',
  'schedule_supper_prep_eat_ate',
  'schedule_clean_cleaned',
  'schedule_shower_2_pm_groom_done',
  'schedule_entertainment_2_social_flex_intentional',
  'schedule_wind_down_prep_sleep_done',
];

const totalTasks = scheduleCompletionKeys.length;

const calculateCompletionScore = (dayData: DailyLogData): number => {
  if (!dayData) return 0;
  
  const completedTasks = scheduleCompletionKeys.reduce((acc, key) => {
    return acc + (dayData[key] ? 1 : 0);
  }, 0);

  return (completedTasks / totalTasks) * 100;
};

export function ActivityHeatmap({ allDaysData, displayDate }: ActivityHeatmapProps) {
  const activityData = useMemo(() => {
    const monthStart = startOfMonth(displayDate);
    const monthEnd = endOfMonth(displayDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayData = allDaysData[dateKey] || getInitialDailyLogData(dateKey);
      return {
        date: day,
        score: calculateCompletionScore(dayData),
      };
    });
  }, [allDaysData, displayDate]);

  const getBackgroundColor = (score: number) => {
    if (score === 0) return 'bg-muted/50';
    if (score <= 25) return 'bg-green-200 dark:bg-green-900';
    if (score <= 50) return 'bg-green-400 dark:bg-green-700';
    if (score <= 75) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  const firstDayOfMonth = startOfMonth(displayDate).getDay(); // 0 for Sunday

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Activity</CardTitle>
        <CardDescription>
          Daily schedule completion for {format(displayDate, 'MMMM yyyy')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-muted-foreground">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {activityData.map(({ date, score }) => (
            <Tooltip key={format(date, 'yyyy-MM-dd')}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'aspect-square w-full rounded-sm',
                    getBackgroundColor(score)
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{format(date, 'MMM d, yyyy')}</p>
                <p>Completion: {score.toFixed(0)}%</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="w-4 h-4 rounded-sm bg-muted/50" />
            <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-500" />
            <div className="w-4 h-4 rounded-sm bg-green-800 dark:bg-green-300" />
            <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
