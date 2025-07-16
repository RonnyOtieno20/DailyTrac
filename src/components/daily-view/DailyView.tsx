
import type React from 'react';
import { DailyLogData, DailyLogField } from '@/lib/types';
import { SectionCard } from '@/components/SectionCard';
import { FormInput, FormCheckbox, FormTextarea } from '@/components/FormElements';
import { ScheduleTaskItem } from './ScheduleTaskItem';
import { scheduleItemsConfig } from './scheduleItemsConfig';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from "@/components/ui/label";
import { MultiInput } from '@/components/MultiInput';
import {
  ClipboardList,
  CalendarClock,
  BarChart3,
  BookOpen,
  Apple,
  Sparkles,
  AlertTriangle,
  Camera,
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
  };
  
  const { day_of_week, creation_date } = dayData;

  const getStat = (primaryField: keyof DailyLogData, secondaryField?: keyof DailyLogData) => {
      const primaryValue = dayData[primaryField];
      if(Array.isArray(primaryValue)) {
        return primaryValue.join(', ') || 'N/A';
      }
      const secondaryValue = secondaryField ? dayData[secondaryField] : undefined;
      const displayValue = primaryValue || secondaryValue;

      return displayValue || 'N/A';
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] md:h-[calc(100vh-150px)]">
        <div className="p-1">
            <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Daily Log for {day_of_week}, {new Date(creation_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
                {/* Column 2 - Main Schedule */}
                <div className="lg:col-span-1 space-y-6">
                    <SectionCard title="Today's Schedule" icon={<CalendarClock className="text-primary" />}>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {scheduleItemsConfig.map(itemConfig => (
                        <ScheduleTaskItem key={itemConfig.idPrefix} config={itemConfig} data={dayData} onUpdate={handleUpdate} />
                        ))}
                    </div>
                    <FormInput id="nutrition_total_calories_consumed" label="Total Calories Consumed (Throughout Day)" type="number" value={dayData.nutrition_total_calories_consumed} onChange={(val) => handleUpdate('nutrition_total_calories_consumed', val)} placeholder="e.g., 2000" />
                    <FormInput id="nutrition_water_intake" label="Water Intake (Throughout Day)" type="number" value={dayData.nutrition_water_intake} onChange={(val) => handleUpdate('nutrition_water_intake', val)} placeholder="e.g., 8 glasses" />
                    </SectionCard>
                </div>
                
                {/* Column 1 - Snapshots & Summaries */}
                <div className="lg:col-span-1 space-y-6">
                    <SectionCard title="Daily Snapshot" icon={<Camera className="text-primary" />}>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-x-4 gap-y-2 pt-4">
                            <FormCheckbox id="habit_sleep" label="Sleep" checked={dayData.habit_sleep} onCheckedChange={(val) => handleUpdate('habit_sleep', val)} />
                            <FormCheckbox id="habit_exercise" label="Exercise" checked={dayData.habit_exercise} onCheckedChange={(val) => handleUpdate('habit_exercise', val)} />
                            <FormCheckbox id="habit_walk" label="Walk" checked={dayData.habit_walk} onCheckedChange={(val) => handleUpdate('habit_walk', val)} />
                            <FormCheckbox id="habit_read" label="Read" checked={dayData.habit_read} onCheckedChange={(val) => handleUpdate('habit_read', val)} />
                            <FormCheckbox id="habit_study" label="Study" checked={dayData.habit_study} onCheckedChange={(val) => handleUpdate('habit_study', val)} />
                            <FormCheckbox id="habit_work" label="Work" checked={dayData.habit_work} onCheckedChange={(val) => handleUpdate('habit_work', val)} />
                            <FormCheckbox id="habit_groom_am" label="AM Grooming" checked={dayData.habit_groom_am} onCheckedChange={(val) => handleUpdate('habit_groom_am', val)} />
                            <FormCheckbox id="habit_groom_pm" label="PM Grooming" checked={dayData.habit_groom_pm} onCheckedChange={(val) => handleUpdate('habit_groom_pm', val)} />
                        </div>
                    </SectionCard>
                    <SectionCard title="Day Stats" icon={<BarChart3 className="text-primary" />}>
                        <ul className="space-y-1 text-sm">
                            <li><strong>Mood Today:</strong> {dayData.day_stats_mood}</li>
                            <li><strong>Energy Level:</strong> {dayData.day_stats_energy}</li>
                            <li><strong>Steps:</strong> {dayData.day_stats_steps}</li>
                            <li><strong>Exercise Calories:</strong> {dayData.day_stats_exercise_calories}</li>
                            <li><strong>Total Calories:</strong> {dayData.day_stats_total_calories}</li>
                        </ul>
                    </SectionCard>
                    <SectionCard title="AI Daily Summary" icon={<Sparkles className="text-primary" />}>
                        <Button onClick={() => onSummarize(selectedDate)} disabled={isLoadingSummary} className="w-full mb-4">
                            {isLoadingSummary ? 'Generating Summary...' : 'Generate AI Summary'}
                        </Button>
                        {dayData.ai_summary ? (
                            <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{dayData.ai_summary}</div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">Click the button to generate an AI summary for this day.</p>
                        )}
                    </SectionCard>
                </div>
                
                {/* Column 3 - Logs */}
                <div className="lg:col-span-1 space-y-6">
                     <SectionCard title="Study Log" icon={<BookOpen className="text-primary" />}>
                        <MultiInput id="study_log_topics" label="Topic(s)" placeholder="Add a topic..." items={Array.isArray(dayData.study_log_topics) ? dayData.study_log_topics : []} onItemsChange={(val) => handleUpdate('study_log_topics', val)} />
                        <FormTextarea id="study_log_notes" label="Notes/Key Takeaways" placeholder="Add a note..." value={dayData.study_log_notes} onChange={(val) => handleUpdate('study_log_notes', val)} />
                        <FormInput id="study_log_hours" label="Hours Logged" type="number" value={dayData.study_log_hours} onChange={(val) => handleUpdate('study_log_hours', val)} placeholder="e.g., 2.5" />
                    </SectionCard>

                    <SectionCard title="Nutrition Log" icon={<Apple className="text-primary" />}>
                        <MultiInput id="nutrition_log_breakfast" label="Breakfast" placeholder="Add a food item..." items={Array.isArray(dayData.nutrition_log_breakfast) ? dayData.nutrition_log_breakfast : []} onItemsChange={(val) => handleUpdate('nutrition_log_breakfast', val)} />
                        <MultiInput id="nutrition_log_lunch" label="Lunch" placeholder="Add a food item..." items={Array.isArray(dayData.nutrition_log_lunch) ? dayData.nutrition_log_lunch : []} onItemsChange={(val) => handleUpdate('nutrition_log_lunch', val)} />
                        <MultiInput id="nutrition_log_supper" label="Supper" placeholder="Add a food item..." items={Array.isArray(dayData.nutrition_log_supper) ? dayData.nutrition_log_supper : []} onItemsChange={(val) => handleUpdate('nutrition_log_supper', val)} />
                        <MultiInput id="nutrition_log_snacks" label="Snacks" placeholder="Add a snack..." items={Array.isArray(dayData.nutrition_log_snacks) ? dayData.nutrition_log_snacks : []} onItemsChange={(val) => handleUpdate('nutrition_log_snacks', val)} />
                        <FormInput id="nutrition_log_total_calories" label="Total Calories (from log)" type="number" value={dayData.nutrition_log_total_calories} onChange={(val) => handleUpdate('nutrition_log_total_calories', val)} placeholder="Sum of all meals/snacks" />
                    </SectionCard>
                </div>
            </div>
        </div>
    </ScrollArea>
  );
}
