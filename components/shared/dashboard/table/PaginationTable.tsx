"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  lastPage: number;
  className?: string;
  maxVisiblePages?: number;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];
}

export default function PaginationTable({
  currentPage,
  totalItems,
  itemsPerPage,
  lastPage,
  className = "",
  maxVisiblePages = 5,
  itemsPerPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage || page === currentPage) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", itemsPerPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    params.set("page", "1"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-left");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= 1 && i <= lastPage) {
        pages.push(i);
      }
    }

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-right");
      }
      pages.push(lastPage);
    }

    return pages;
  };

  const renderPageItem = (page: number | string) => {
    if (page === "ellipsis-left" || page === "ellipsis-right") {
      return (
        <PaginationItem key={page}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    const pageNum = page as number;
    return (
      <PaginationItem key={pageNum}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNum);
          }}
          isActive={pageNum === currentPage}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );
  };

  const showingFrom = Math.min(
    (currentPage - 1) * itemsPerPage + 1,
    totalItems
  );
  const showingTo = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-2 min-w-fit">
        <p className="text-sm text-muted-foreground ">
          Showing {showingFrom} to {showingTo} of {totalItems} items
        </p>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent>
            {itemsPerPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination className="m-0 sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              isActive={currentPage > 1}
            />
          </PaginationItem>

          {generatePageNumbers().map(renderPageItem)}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              isActive={currentPage < lastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
