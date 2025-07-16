
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarView } from '@/components/CalendarView';
import { ThemeToggle } from '@/components/ThemeToggle'; 

export default function DashboardPage() {
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    router.push(`/log/${dateStr}`);
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
         <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="hsl(var(--primary))"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>
        <p className="text-lg text-foreground mt-4">Loading Calendar...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
       <header className="p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Select a Day</h1>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
       </header>

      <main className="flex-grow p-4 md:p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            displayDate={displayDate}
            onDisplayDateChange={setDisplayDate}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} DailyTrac. Built with Next.js & Firebase.
      </footer>
    </div>
  );
}
