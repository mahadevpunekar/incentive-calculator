import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  id: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  empty?: ReactNode;
  className?: string;
};

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  empty,
  className,
}: DataTableProps<T>) {
  if (data.length === 0 && empty) {
    return <div className={cn("rounded-xl border border-dashed", className)}>{empty}</div>;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card overflow-hidden",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.id} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row.id ?? String(i)}>
              {columns.map((col) => (
                <TableCell key={col.id} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
