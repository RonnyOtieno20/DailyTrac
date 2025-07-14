
import type React from 'react';
import { DailyLogData, DailyLogField } from '@/lib/types';
import { SectionCard } from '@/components/SectionCard';
import { FormInput, FormCheckbox, FormTextarea } from '@/components/FormElements';
import { ScheduleTaskItem } from './ScheduleTaskItem';
import { scheduleItemsConfig } from './scheduleItemsConfig';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from "@/components/ui/label"; // Added import
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  CalendarClock,
  BarChart3,
  BookOpen,
  Apple,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DailyViewProps {
  selectedDate: string; // YYYY-MM-DD
  dayData: DailyLogData | null;
  onUpdateField: (date: string, field: DailyLogField, value: any) => void;
  onSummarize: (date: string) => Promise<void>;
  isLoadingSummary: boolean;
}

const moodOptions = [
  { value: "😊 Happy", emoji: "😊", label: "Happy" },
  { value: "😢 Sad", emoji: "😢", label: "Sad" },
  { value: "😠 Angry", emoji: "😠", label: "Angry" },
  { value: "😐 Neutral", emoji: "😐", label: "Neutral" },
  { value: "😩 Stressed", emoji: "😩", label: "Stressed" },
  { value: "🤩 Excited", emoji: "🤩", label: "Excited" },
];

const energyOptions = [
  { value: "⚡️ High", emoji: "⚡️", label: "High" },
  { value: "🔋 Medium", emoji: "🔋", label: "Medium" },
  { value: "🔌 Low", emoji: "🔌", label: "Low" },
];

export function DailyView({ selectedDate, dayData, onUpdateField, onSummarize, isLoadingSummary }: DailyViewProps) {
  if (!dayData) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            Select a day from the calendar to view or record your habits.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleUpdate = (field: DailyLogField, value: any) => {
    onUpdateField(selectedDate, field, value);

    // Sync specific fields to Day Stats
    if (field === 'mood') onUpdateField(selectedDate, 'day_stats_mood', value);
    if (field === 'energy') onUpdateField(selectedDate, 'day_stats_energy', value);
    if (field === 'steps') onUpdateField(selectedDate, 'day_stats_steps', value);
    if (field === 'schedule_exercise_calories_burned') onUpdateField(selectedDate, 'day_stats_exercise_calories', value);
    if (field === 'nutrition_total_calories_consumed') onUpdateField(selectedDate, 'day_stats_total_calories', value);
    if (field === 'nutrition_log_total_calories') onUpdateField(selectedDate, 'day_stats_total_calories', value);
  };

  const { day_of_week, creation_date } = dayData;

  const getStat = (primaryField: keyof DailyLogData, secondaryField?: keyof DailyLogData) => {
      return dayData[primaryField] || (secondaryField ? dayData[secondaryField] : '') || 'N/A';
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] md:h-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Daily Log for {day_of_week}, {new Date(creation_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
        </div>

        {/* Habit Tracking Inline Fields */}
        <SectionCard title="Habit Tracking Inline Fields" icon={<ClipboardList className="text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-2 block">Mood</Label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={dayData.mood === option.value ? "default" : "outline"}
                    onClick={() => handleUpdate('mood', option.value)}
                    className="flex-col h-auto p-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    size="sm"
                  >
                    <span className="text-2xl mb-1">{option.emoji}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-2 block">Energy Level</Label>
              <div className="flex flex-wrap gap-2">
                {energyOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={dayData.energy === option.value ? "default" : "outline"}
                    onClick={() => handleUpdate('energy', option.value)}
                    className="flex-col h-auto p-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    size="sm"
                  >
                    <span className="text-2xl mb-1">{option.emoji}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <FormInput id="steps" label="Steps" type="text" value={dayData.steps} onChange={(val) => handleUpdate('steps', val)} placeholder="e.g., 10000" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 pt-4">
            <FormCheckbox id="habit_sleep" label="Sleep" checked={dayData.habit_sleep} onCheckedChange={(val) => handleUpdate('habit_sleep', val)} />
            <FormCheckbox id="habit_exercise" label="Exercise" checked={dayData.habit_exercise} onCheckedChange={(val) => handleUpdate('habit_exercise', val)} />
            <FormCheckbox id="habit_walk" label="Walk" checked={dayData.habit_walk} onCheckedChange={(val) => handleUpdate('habit_walk', val)} />
            <FormCheckbox id="habit_read" label="Read" checked={dayData.habit_read} onCheckedChange={(val) => handleUpdate('habit_read', val)} />
            <FormCheckbox id="habit_study" label="Study" checked={dayData.habit_study} onCheckedChange={(val) => handleUpdate('habit_study', val)} />
            <FormCheckbox id="habit_work" label="Work" checked={dayData.habit_work} onCheckedChange={(val) => handleUpdate('habit_work', val)} />
            <FormCheckbox id="habit_groom_am" label="AM Grooming" checked={dayData.habit_groom_am} onCheckedChange={(val) => handleUpdate('habit_groom_am', val)} />
            <FormCheckbox id="habit_groom_pm" label="PM Grooming" checked={dayData.habit_groom_pm} onCheckedChange={(val) => handleUpdate('habit_groom_pm', val)} />
          </div>
           <FormTextarea id="habit_exercise_notes" label="Exercise Notes (Inline)" value={dayData.habit_exercise_notes} onChange={(val) => handleUpdate('habit_exercise_notes', val)} placeholder="Quick notes on exercise" />
        </SectionCard>

        {/* Today's Schedule */}
        <SectionCard title="Today's Schedule" icon={<CalendarClock className="text-primary" />}>
          <div className="space-y-3">
            {scheduleItemsConfig.map(itemConfig => (
              <ScheduleTaskItem key={itemConfig.idPrefix} config={itemConfig} data={dayData} onUpdate={handleUpdate} />
            ))}
          </div>
          <FormInput id="nutrition_total_calories_consumed" label="Total Calories Consumed (Throughout Day)" value={dayData.nutrition_total_calories_consumed} onChange={(val) => handleUpdate('nutrition_total_calories_consumed', val)} placeholder="e.g., 2000 kcal" />
          <FormInput id="nutrition_water_intake" label="Water Intake (Throughout Day)" value={dayData.nutrition_water_intake} onChange={(val) => handleUpdate('nutrition_water_intake', val)} placeholder="e.g., 2.5 Liters" />
        </SectionCard>
        
        {/* AI Summary Section */}
        <SectionCard title="AI Daily Summary" icon={<Sparkles className="text-primary" />}>
          <Button onClick={() => onSummarize(selectedDate)} disabled={isLoadingSummary} className="w-full mb-4">
            {isLoadingSummary ? 'Generating Summary...' : 'Generate AI Summary'}
          </Button>
          {dayData.ai_summary ? (
            <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">{dayData.ai_summary}</div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">Click the button to generate an AI summary for this day.</p>
          )}
        </SectionCard>

        {/* Day Stats */}
        <SectionCard title="Day Stats" icon={<BarChart3 className="text-primary" />}>
          <ul className="space-y-1 text-sm">
            <li><strong>Mood Today:</strong> {getStat('day_stats_mood', 'mood')}</li>
            <li><strong>Energy Level:</strong> {getStat('day_stats_energy', 'energy')}</li>
            <li><strong>Steps:</strong> {getStat('day_stats_steps', 'steps')}</li>
            <li><strong>Exercise Calories:</strong> {getStat('day_stats_exercise_calories', 'schedule_exercise_calories_burned')}</li>
            <li><strong>Total Calories:</strong> {getStat('day_stats_total_calories', 'nutrition_total_calories_consumed') || getStat('nutrition_log_total_calories')}</li>
          </ul>
        </SectionCard>

        {/* Study Log */}
        <SectionCard title="Study Log" icon={<BookOpen className="text-primary" />}>
          <FormTextarea id="study_log_topics" label="Topic(s)" value={dayData.study_log_topics} onChange={(val) => handleUpdate('study_log_topics', val)} placeholder="Detailed topics covered" />
          <FormTextarea id="study_log_notes" label="Notes/Key Takeaways" value={dayData.study_log_notes} onChange={(val) => handleUpdate('study_log_notes', val)} placeholder="Key learnings and insights" />
          <FormInput id="study_log_hours" label="Hours Logged" value={dayData.study_log_hours} onChange={(val) => handleUpdate('study_log_hours', val)} placeholder="e.g., 2.5 hours" />
        </SectionCard>

        {/* Nutrition Log */}
        <SectionCard title="Nutrition Log" icon={<Apple className="text-primary" />}>
          <FormTextarea id="nutrition_log_breakfast" label="Breakfast" value={dayData.nutrition_log_breakfast} onChange={(val) => handleUpdate('nutrition_log_breakfast', val)} placeholder="Meal and estimated calories" />
          <FormTextarea id="nutrition_log_lunch" label="Lunch" value={dayData.nutrition_log_lunch} onChange={(val) => handleUpdate('nutrition_log_lunch', val)} placeholder="Meal and estimated calories" />
          <FormTextarea id="nutrition_log_supper" label="Supper" value={dayData.nutrition_log_supper} onChange={(val) => handleUpdate('nutrition_log_supper', val)} placeholder="Meal and estimated calories" />
          <FormTextarea id="nutrition_log_snacks" label="Snacks" value={dayData.nutrition_log_snacks} onChange={(val) => handleUpdate('nutrition_log_snacks', val)} placeholder="Snacks and estimated calories" />
          <FormInput id="nutrition_log_total_calories" label="Total Calories (from log)" value={dayData.nutrition_log_total_calories} onChange={(val) => handleUpdate('nutrition_log_total_calories', val)} placeholder="Sum of all meals/snacks" />
        </SectionCard>

      </div>
    </ScrollArea>
  );
}
