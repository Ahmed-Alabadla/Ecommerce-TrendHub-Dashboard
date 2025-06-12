"use client";

import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { getYear } from "date-fns";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  selected: Date | undefined;
  onChange: (date: Date | undefined) => void;
  startYear?: number;
  endYear?: number;
  disabled?: boolean;
}

export function DatePicker({
  selected: date,
  onChange: setDate,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  disabled = false,
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [value, setValue] = useState(formatDate(date));

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={value}
        disabled={disabled}
        placeholder="dd/mm/yyyy"
        className="bg-background pr-10"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setValue(e.target.value);

          if (isValidDate(date)) {
            setDate(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsPopoverOpen(true);
          }
        }}
      />
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={false}
      >
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          style={{ pointerEvents: "auto" }}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={date}
            startMonth={new Date(startYear, 0)}
            endMonth={new Date(endYear, 11)}
            onMonthChange={setDate}
            onSelect={(date) => {
              setDate(date);
              setValue(formatDate(date));
              setIsPopoverOpen(false);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
