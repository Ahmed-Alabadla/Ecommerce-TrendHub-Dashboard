import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  error?: string;
}

const PREDEFINED_COLORS = [
  "#FF0000", // Red
  "#0000FF", // Blue
  "#008000", // Green
  "#FFFF00", // Yellow
  "#000000", // Black
  "#FFFFFF", // White
  "#800080", // Purple
  "#FFA500", // Orange
  "#FFC0CB", // Pink
  "#808080", // Gray
] as const;

export default function ColorPicker({
  colors,
  onChange,
  error,
}: ColorPickerProps) {
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [isAdding, setIsAdding] = useState(false);

  const addColor = () => {
    if (newColorCode && !colors.includes(newColorCode)) {
      onChange([...colors, newColorCode]);
      setNewColorCode("#000000");
      setIsAdding(false);
    }
  };

  const removeColor = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    onChange(newColors);
  };

  const addPredefinedColor = (color: string) => {
    // Check if color already exists
    if (!colors.some((c) => c === color)) {
      onChange([...colors, color]);
    }
  };

  const toggleAddMode = () => {
    setIsAdding((prev) => !prev);
    setNewColorCode("#000000");
  };

  const hasColor = (color: string) => colors.includes(color);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
          >
            <div
              className="w-3 h-3 rounded-full border border-muted"
              style={{ backgroundColor: color }}
            />
            <button
              onClick={() => removeColor(index)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Remove ${color}`}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {color}</span>
            </button>
          </div>
        ))}

        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-full"
            onClick={toggleAddMode}
            aria-label="Add new color"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Color</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={newColorCode}
            onChange={(e) => setNewColorCode(e.target.value)}
            className="w-12 p-1 h-9 cursor-pointer"
            aria-label="Select color"
          />
          <Button
            size="sm"
            onClick={addColor}
            disabled={!newColorCode.trim() || colors.includes(newColorCode)}
          >
            Add
          </Button>
          <Button size="sm" variant="outline" onClick={toggleAddMode}>
            Cancel
          </Button>
        </div>
      )}

      <div className="mt-2">
        <div className="text-xs text-muted-foreground mb-1.5">
          Common colors:
        </div>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => addPredefinedColor(color)}
              className="w-8 h-8 rounded-full border border-muted flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: color }}
              aria-label={`Add ${color}`}
            >
              {hasColor(color) && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
