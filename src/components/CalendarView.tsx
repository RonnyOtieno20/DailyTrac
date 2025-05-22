import type React from 'react';
import { TARGET_YEAR, TARGET_MONTH, DAYS_OF_WEEK, MONTH_NAMES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button'; // Assuming this is not needed as it's fixed month

interface CalendarViewProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
  // monthData: MonthData; // Potentially for highlighting days with entries
}

export function CalendarView({ selectedDate, onDateSelect }: CalendarViewProps) {
  const year = TARGET_YEAR;
  const month = TARGET_MONTH; // June

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

  const calendarDays: (Date | null)[] = [];

  // Add empty cells for days before the start of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Add empty cells to fill the last week if necessary
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const formatDateToKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-primary">
          {MONTH_NAMES[month]} {year}
        </CardTitle>
        {/* Navigation buttons can be added here if dynamic month/year is needed */}
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="p-1 aspect-square"></div>;
            }
            const dateKey = formatDateToKey(date);
            const isSelected = dateKey === selectedDate;
            const today = new Date();
            today.setHours(0,0,0,0);
            const isToday = date.getTime() === today.getTime();


            return (
              <button
                key={dateKey}
                onClick={() => onDateSelect(dateKey)}
                className={cn(
                  "p-1 aspect-square rounded-md flex items-center justify-center text-sm transition-all duration-150 ease-in-out hover:bg-accent/50",
                  isSelected ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" : "bg-card hover:text-accent-foreground",
                  isToday && !isSelected && "bg-secondary text-secondary-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
