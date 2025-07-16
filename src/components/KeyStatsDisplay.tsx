import type { KeyStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, BedDouble, Droplets, Flame, Glasses, Utensils } from 'lucide-react';

interface KeyStatsDisplayProps {
  stats: KeyStats;
}

export function KeyStatsDisplay({ stats }: KeyStatsDisplayProps) {

  const StatItem = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit?: string }) => (
    <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-foreground/90">{label}</span>
      </div>
      <span className="text-sm font-semibold text-primary">{value} {unit}</span>
    </div>
  );

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-semibold text-foreground">Key Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground p-4">
         <StatItem 
            icon={<BedDouble size={16} className="text-accent"/>}
            label="Sleep Goal Met" 
            value={`${stats.sleepGoalMet} / ${stats.totalDays}`}
            unit="days"
        />
        <StatItem 
            icon={<Activity size={16} className="text-accent"/>}
            label="Exercise Days" 
            value={`${stats.exerciseDays} / ${stats.totalDays}`}
            unit="days"
        />
         <StatItem 
            icon={<Flame size={16} className="text-accent"/>}
            label="Avg. Calories Burned" 
            value={stats.avgCaloriesBurned.toFixed(0)}
            unit="kcal"
        />
        <StatItem 
            icon={<Droplets size={16} className="text-accent"/>}
            label="Avg. Water Intake" 
            value={stats.avgWaterIntake.toFixed(1)}
            unit="glasses"
        />
        <StatItem 
            icon={<Utensils size={16} className="text-accent"/>}
            label="Avg. Daily Calories" 
            value={stats.avgTotalCalories.toFixed(0)}
            unit="kcal"
        />
        <StatItem 
            icon={<Glasses size={16} className="text-accent"/>}
            label="Total Study Time" 
            value={stats.totalStudyHours.toFixed(1)}
            unit="hours"
        />
      </CardContent>
    </Card>
  );
}
