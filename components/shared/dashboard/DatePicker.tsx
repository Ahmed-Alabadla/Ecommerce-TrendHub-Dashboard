"use client";

import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

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
  // const date = selected || new Date();

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setIsPopoverOpen(false);
    }
  };
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
    // return date.toLocaleDateString("es-CL");
  };

  // const disabledFutureDate = (date: Date) => {
  //   return date > new Date() || date < new Date("1900-01-01");
  // };

  // Generate an array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Generate years array (current year - 100 to current year + 100)
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const newDate = date
      ? setMonth(date, months.indexOf(month))
      : setMonth(new Date(), months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = date
      ? setYear(date, parseInt(year))
      : setYear(new Date(), parseInt(year));
    setDate(newDate);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            " justify-start text-left font-normal  ",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>Select Date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex justify-between items-center gap-1 p-2">
          {/* months */}
          <Select
            onValueChange={handleMonthChange}
            value={date ? months[getMonth(date)] : ""}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* years */}
          <Select
            onValueChange={handleYearChange}
            value={date ? getYear(date).toString() : ""}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          // disabled={(date) => disabledFutureDate(date)}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
