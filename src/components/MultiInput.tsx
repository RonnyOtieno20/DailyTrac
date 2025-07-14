
import type React from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiInputProps {
  id: string;
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiInput({ id, label, items, onItemsChange, placeholder, className }: MultiInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      onItemsChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground/80">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="transition-shadow duration-200 ease-in-out focus:shadow-md"
        />
        <Button type="button" onClick={handleAddItem}>Add</Button>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
            <span className="text-sm">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleRemoveItem(index)}
            >
              <X size={16} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
