
'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { DailyView } from '@/components/daily-view/DailyView';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { MonthData, DailyLogData, DailyLogField } from '@/lib/types';
import { LOCAL_STORAGE_KEY } from '@/lib/constants';
import { getInitialDailyLogData, formatDataForAISummary } from '@/lib/dataUtils';
import { summarizeDailyLog } from '@/ai/flows/daily-summary';
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from '@/components/ThemeToggle'; 

export default function DashboardPage() {
  const { toast } = useToast();
  const [allDaysData, setAllDaysData] = useLocalStorage<MonthData>(
    LOCAL_STORAGE_KEY,
    {}
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [displayDate, setDisplayDate] = useState(() => new Date(selectedDate));
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!allDaysData[selectedDate]) {
        const newDayData = getInitialDailyLogData(selectedDate);
        setAllDaysData(prev => ({...prev, [selectedDate]: newDayData}));
    }
  }, [selectedDate, allDaysData, setAllDaysData]);

  const handleUpdateField = (date: string, field: DailyLogField, value: any) => {
    setAllDaysData(prevData => {
      const dayData = prevData[date] || getInitialDailyLogData(date);
      const updatedDayData = {
        ...dayData,
        [field]: value,
      };

      const statsUpdate: Partial<DailyLogData> = {};
      
      if (field === 'mood') statsUpdate.day_stats_mood = value;
      if (field === 'energy') statsUpdate.day_stats_energy = value;
      if (field === 'schedule_walk_current_step_count') statsUpdate.day_stats_steps = value;
      if (field === 'schedule_exercise_calories_burned') statsUpdate.day_stats_exercise_calories = value;
      if (field === 'nutrition_total_calories_consumed' || field === 'nutrition_log_total_calories') {
          statsUpdate.day_stats_total_calories = updatedDayData.nutrition_total_calories_consumed || updatedDayData.nutrition_log_total_calories;
      }

      return {
        ...prevData,
        [date]: {
          ...updatedDayData,
          ...statsUpdate,
        },
      };
    });
  };

  const handleSummarize = async (date: string) => {
    const dayData = allDaysData[date];
    if (!dayData) {
      toast({ title: "Error", description: "No data found for this day to summarize.", variant: "destructive" });
      return;
    }

    setIsLoadingSummary(true);
    try {
      const logToSummarize = formatDataForAISummary(dayData);
      const result = await summarizeDailyLog({ dailyLog: logToSummarize });
      if (result.summary) {
        handleUpdateField(date, 'ai_summary', result.summary);
        toast({ title: "AI Summary Generated", description: "The summary for the day has been updated." });
      } else {
        toast({ title: "AI Summary Error", description: "Failed to generate summary. No content returned.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error summarizing daily log:", error);
      toast({ title: "AI Summary Error", description: "An error occurred while generating the summary.", variant: "destructive" });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setDisplayDate(new Date(dateStr));
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
         <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="hsl(var(--primary))"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>
        <p className="text-lg text-foreground mt-4">Loading DailyTrac...</p>
      </div>
    );
  }
  
  const currentDayData = allDaysData[selectedDate] || getInitialDailyLogData(selectedDate);

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
       <header className="p-4 border-b hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daily Log</h1>
          <ThemeToggle />
       </header>

      <main className="flex-grow p-2 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1 space-y-6">
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            displayDate={displayDate}
            onDisplayDateChange={setDisplayDate}
          />
        </div>
        <div className="md:col-span-2">
          <DailyView
            selectedDate={selectedDate}
            dayData={currentDayData}
            onUpdateField={handleUpdateField}
            onSummarize={handleSummarize}
            isLoadingSummary={isLoadingSummary}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} DailyTrac. Built with Next.js & Firebase.
      </footer>
    </div>
  );
}
