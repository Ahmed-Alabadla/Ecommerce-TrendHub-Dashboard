/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Table as TableType } from "@tanstack/react-table";
import { CloudDownload } from "lucide-react";
import { Fragment, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import logo from "@/public/logo.png";

interface InvoiceProps<TData> {
  table: TableType<TData>;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

// Columns to exclude from printing
const EXCLUDED_COLUMNS = new Set([
  "order_date",
  "id",
  "actions",
  "expander",
  "avatar",
  "images",
  "imageCover",
]);

function PrintButton<TData>({
  table,
  currentPage,
  itemsPerPage,
  totalItems,
}: InvoiceProps<TData>) {
  const pathname = usePathname();
  const printRef = useRef<HTMLDivElement>(null);

  function hasItems(data: TData): data is TData & { items: Array<unknown> } {
    return !!(data as any)?.items;
  }
  // Memoize data to prevent unnecessary re-renders
  const visibleRows = useMemo(
    () => table.getRowModel().rows,
    [table.getRowModel().rows]
  );
  const firstItem =
    (hasItems(visibleRows[0]?.original) &&
      visibleRows[0]?.original?.items?.[0]) ||
    [];
  const hasExpandedRows = useMemo(
    () => visibleRows.some((row) => row.getCanExpand()),
    [visibleRows]
  );

  // Get printable headers excluding certain columns
  const printableHeaders = useMemo(() => {
    return table
      .getHeaderGroups()[0]
      .headers.filter((header) => !EXCLUDED_COLUMNS.has(header.id));
  }, [table.getHeaderGroups()]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
    },
    documentTitle: getTitle(),
    onPrintError: () => {},
    preserveAfterPrint: true,
    pageStyle: `
      @page {
        size: landscape;
        margin: 10mm;
      }
      @media all {
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        .printable-content {
          width: 100%;
          height: 100%;
          page-break-after: always;
        }
        table {
          page-break-inside: auto;
          width: 100%;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        thead {
          display: table-header-group;
        }
        tfoot {
          display: table-footer-group;
        }
      }
    `,
  });

  function getTitle() {
    const pathToTitleMap: Record<string, string> = {
      "/users": "Users Report",
      "/products": "Products Report",
      "/reviews": "Reviews Report",
    };
    return pathToTitleMap[pathname] || "";
  }

  const showingFrom = Math.min(
    (currentPage - 1) * itemsPerPage + 1,
    totalItems
  );
  const showingTo = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <Button
        className="h-8 bg-green-500 hover:bg-green-600 text-white rounded-md"
        onClick={() => handlePrint()}
      >
        <CloudDownload className="h-4 w-4 mr-2" />
        Print
      </Button>
      <div className="hidden">
        <div
          ref={printRef}
          className="print:block printable-content m-0 p-4 bg-white"
        >
          {/* Header Section */}
          <div className="text-center mb-4 border-b-2 border-blue-200 pb-3">
            <div className="flex items-center">
              <p className="flex-1 text-start font-bold text-md text-blue-500">
                TrendHub Shop
              </p>
              <div className="flex flex-1 flex-col items-center gap-1">
                <Image
                  src={logo}
                  alt="logo"
                  width={156}
                  className="rounded-2xl"
                />
                <span className="text-lg font-bold text-center uppercase tracking-wider text-primary">
                  {getTitle()}
                </span>
              </div>

              <p className="flex-1 text-end font-bold text-md">
                {new Date(Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Table Section */}
          <Table className="border border-gray-300 w-full">
            <TableHeader className="bg-gray-100">
              <TableRow>
                {printableHeaders.map((header) => (
                  <TableCell
                    key={header.id}
                    className={`p-2 text-center font-semibold border border-gray-200 capitalize ${
                      header.id === "email" ? "min-w-40" : "w-fit"
                    }`}
                  >
                    {formatHeaderId(header.id)}
                  </TableCell>
                ))}
                {hasExpandedRows && firstItem && (
                  <TableCell
                    colSpan={Object.keys(firstItem).length}
                    className="p-0"
                  >
                    <TableRow className="p-0 flex justify-center">
                      <TableCell
                        colSpan={Object.keys(firstItem).length}
                        className="p-2"
                      >
                        Items
                      </TableCell>
                    </TableRow>
                    <TableRow className="flex items-center">
                      {Object.keys(firstItem).map(
                        (key) =>
                          !key.endsWith("_id") && (
                            <TableCell
                              key={key}
                              className="border-e p-2 text-center font-medium border-gray-200 flex-1"
                            >
                              {key}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleRows.map((row) => {
                const original = row.original as any;
                const cells = row
                  .getVisibleCells()
                  .filter((cell) => !EXCLUDED_COLUMNS.has(cell.column.id));

                return (
                  <Fragment key={row.id}>
                    <TableRow className="even:bg-gray-50">
                      {cells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`p-2 text-center border border-gray-200 ${
                            cell.column.id === "email" ? "min-w-40" : "w-fit"
                          }`}
                        >
                          {renderCellContent(cell, row)}
                        </TableCell>
                      ))}
                      {row.getCanExpand() && (
                        <TableCell
                          colSpan={Object.keys(firstItem).length}
                          className="p-0 align-top"
                        >
                          <Table className="border-b border-gray-300">
                            <TableBody>
                              {original.items?.map(
                                (item: any, index: number) => (
                                  <TableRow
                                    key={`${row.id}-item-${index}`}
                                    className="bg-gray-50"
                                  >
                                    {Object.entries(item).map(
                                      ([key, value]) =>
                                        !key.endsWith("_id") && (
                                          <TableCell
                                            key={key}
                                            className="border-s p-2 text-center border-gray-200"
                                          >
                                            {formatCellValue(value)}
                                          </TableCell>
                                        )
                                    )}
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      )}
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>

          {/* Footer */}
          {showingFrom && showingTo && totalItems && (
            <div className="mt-4 pt-3 text-sm text-gray-500 border-t-2 border-blue-200">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {showingFrom} to {showingTo} of {totalItems} items
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  function formatHeaderId(headerId: string): string {
    const headerMap: Record<string, string> = {
      createAt: "Created At",
      birth_date: "Birth Date",
      isActive: "Status",
    };
    return headerMap[headerId] || headerId;
  }

  function formatCellValue(value: any): string {
    if (value === null || value === undefined || value === "") {
      return "--";
    }

    if (typeof value === "boolean") {
      return value ? "Active" : "Inactive";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString();
    }

    return String(value);
  }

  function renderCellContent(cell: any, row: any) {
    const columnId = cell.column.id;
    const value = cell.getValue();

    if (["image", "images", "imageCover", "photo"].includes(columnId)) {
      return "--";
    }

    if (columnId === "number") {
      return (
        <>
          {value}
          <br />
          {row.getValue("order_date")}
        </>
      );
    }

    return formatCellValue(value);
  }
}

export default PrintButton;
