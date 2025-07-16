
'use client';

import { useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MonthData } from '@/lib/types';

interface MonthlyOverviewChartProps {
  allDaysData: MonthData;
  displayDate: Date;
}

const moodToValue = (mood: string): number => {
  switch (mood) {
    case '🤩 Excited': return 5;
    case '😊 Happy': return 4;
    case '😐 Neutral': return 3;
    case '😢 Sad': return 2;
    case '😩 Stressed': return 1;
    case '😠 Angry': return 1;
    default: return 0;
  }
};

const energyToValue = (energy: string): number => {
  switch (energy) {
    case '⚡️ High': return 3;
    case '🔋 Medium': return 2;
    case '🔌 Low': return 1;
    default: return 0;
  }
};

export function MonthlyOverviewChart({ allDaysData, displayDate }: MonthlyOverviewChartProps) {
  const chartData = useMemo(() => {
    const monthStart = startOfMonth(displayDate);
    const monthEnd = endOfMonth(displayDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayData = allDaysData[dateKey];
      return {
        date: format(day, 'MMM d'),
        Mood: dayData ? moodToValue(dayData.mood) : 0,
        Energy: dayData ? energyToValue(dayData.energy) : 0,
        Steps: dayData ? parseInt(dayData.day_stats_steps || '0', 10) / 1000 : 0, // Steps in thousands
      };
    });
  }, [allDaysData, displayDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>
          Your mood, energy, and step trends for {format(displayDate, 'MMMM yyyy')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Mood/Energy', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Steps (k)', angle: -90, position: 'insideRight', fill: 'hsl(var(--foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar yAxisId="left" dataKey="Mood" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="Energy" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Steps" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
