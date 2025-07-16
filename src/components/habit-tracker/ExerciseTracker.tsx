
'use client';

import type { MonthData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

interface ExerciseTrackerProps {
  allDaysData: MonthData;
}

export function ExerciseTracker({ allDaysData }: ExerciseTrackerProps) {
  const exerciseLogs = useMemo(() => {
    return Object.values(allDaysData)
      .filter(
        (day) => day.habit_exercise || day.schedule_exercise_workout_complete
      )
      .sort(
        (a, b) =>
          new Date(b.creation_date).getTime() -
          new Date(a.creation_date).getTime()
      );
  }, [allDaysData]);

  const totalExerciseDays = exerciseLogs.length;
  const totalCaloriesBurned = useMemo(() => {
    return exerciseLogs.reduce((acc, day) => {
        const calories = parseFloat(day.schedule_exercise_calories_burned);
        return isNaN(calories) ? acc : acc + calories;
    }, 0);
  }, [exerciseLogs]);

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Total Exercise Days</CardTitle>
                    <CardDescription>Number of days you've logged a workout.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">{totalExerciseDays}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Calories Burned</CardTitle>
                    <CardDescription>Sum of all calories burned during workouts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">{totalCaloriesBurned.toLocaleString()}</p>
                </CardContent>
            </Card>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Log History</CardTitle>
          <CardDescription>
            A detailed log of all your recorded exercise sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Exercise Types</TableHead>
                <TableHead className="text-right w-[150px]">Calories Burned</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseLogs.length > 0 ? (
                exerciseLogs.map((day) => (
                  <TableRow key={day.creation_date}>
                    <TableCell className="font-medium">
                      {format(parseISO(day.creation_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(day.schedule_exercise_type) && day.schedule_exercise_type.length > 0 ? (
                          day.schedule_exercise_type.map((type, index) => (
                            <Badge key={index} variant="secondary">
                              {type}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {day.schedule_exercise_calories_burned || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {day.schedule_exercise_notes_performance || <span className="text-muted-foreground">No notes</span>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No exercise logs found. Go log a workout!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
