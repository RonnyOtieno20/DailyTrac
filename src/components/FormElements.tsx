import type React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

interface FormInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
}

export function FormInput({ id, label, value, onChange, type = 'text', placeholder, className }: FormInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground/80">{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber || '' : e.target.value)}
        className="transition-shadow duration-200 ease-in-out focus:shadow-md"
      />
    </div>
  );
}

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function FormTextarea({ id, label, value, onChange, placeholder, rows = 3, className }: FormTextareaProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground/80">{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="transition-shadow duration-200 ease-in-out focus:shadow-md"
      />
    </div>
  );
}

interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function FormCheckbox({ id, label, checked, onCheckedChange, className }: FormCheckboxProps) {
  return (
    <div className={cn("flex items-center space-x-2 py-1", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="transition-transform duration-200 ease-in-out data-[state=checked]:scale-110"
      />
      <Label htmlFor={id} className="text-sm font-medium text-foreground/80 cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
