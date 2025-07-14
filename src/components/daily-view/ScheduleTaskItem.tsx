import type { DailyLogData, DailyLogField, ScheduleItemConfig } from '@/lib/types';
import { FormCheckbox, FormInput } from '@/components/FormElements';
import { MultiInput } from '@/components/MultiInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScheduleTaskItemProps {
  config: ScheduleItemConfig;
  data: DailyLogData;
  onUpdate: (field: DailyLogField, value: any) => void;
}

export function ScheduleTaskItem({ config, data, onUpdate }: ScheduleTaskItemProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium">{config.title}</CardTitle>
        {config.time && <CardDescription className="text-xs text-muted-foreground">{config.time}</CardDescription>}
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {config.details.map((detail) => {
          const key = `${config.idPrefix}_${detail.field}`;
          if (detail.type === 'checkbox') {
            return (
              <FormCheckbox
                key={key}
                id={key}
                label={detail.label}
                checked={!!data[detail.field]}
                onCheckedChange={(checked) => onUpdate(detail.field, checked)}
              />
            );
          }
          if (detail.type === 'input') {
            return (
              <FormInput
                key={key}
                id={key}
                label={detail.label}
                value={data[detail.field] as string | number}
                onChange={(value) => onUpdate(detail.field, value)}
                type={detail.inputType}
                placeholder={detail.placeholder}
              />
            );
          }
           if (detail.type === 'multi-input') {
             return (
              <MultiInput
                key={key}
                id={key}
                label={detail.label}
                items={Array.isArray(data[detail.field]) ? data[detail.field] as string[] : []}
                onItemsChange={(value) => onUpdate(detail.field, value)}
                placeholder={detail.placeholder}
              />
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
}
