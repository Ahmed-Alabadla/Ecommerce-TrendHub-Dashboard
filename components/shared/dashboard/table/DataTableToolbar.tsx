"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [hasSearchValue, setHasSearchValue] = useState<boolean>(false);
  // Handle search input change
  const handleSearchChange = (value: string) => {
    if (value.length > 0) {
      setHasSearchValue(true);
    } else {
      setHasSearchValue(false);
    }
    table.setGlobalFilter(value); // Use global filter for combined search
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {/* Search Input */}
        <Input
          placeholder="Search..."
          // value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("name")?.setFilterValue(event.target.value)
          // }
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-72"
        />

        {(isFiltered || hasSearchValue) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              handleSearchChange("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            <X />
            <span className="mb-1">Clean Filters</span>
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
