import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableOptions,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Row } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import TableLoadingBar from "./TableLoadingBar";
import TableToolbar from "./TableToolbar";

type ColumnVisibilityType = {
  [key: string]: boolean;
};

interface TableUIProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  loading: boolean;
  header?: string;
  headerDescription?: string;
  children?: React.ReactNode;
  columnVisibility: ColumnVisibilityType;
  data: TData[] | undefined;
  sort?: boolean;
  search?: boolean;
  filterColumns?: string[] | [];
  filterColumnsState?: boolean;
  extraQuery?: { column: string; value: string }[];
  globalFilterEnabled?: boolean;
  sortColumn?: string;
  fallbackSortColumn?: string;
  noToolbar?: boolean;
  sortSelectNewLine?: boolean;
  toolbarClassNames?: string;
  tableHeaderClass?: string;
  tableRowClass?: string;
  tableCellClass?: string;
  selectOptions?: { label: string; value: string }[];
  sectionBelowToolbar?: React.ReactNode | undefined;
  opt?: Partial<TableOptions<TData>>;
}

export function TableUI<TData, TValue>({
  toolbarClassNames = "",
  tableHeaderClass = "",
  tableRowClass = "",
  tableCellClass = "",
  extraQuery = [],
  columns,
  loading,
  children,
  header,
  headerDescription,
  data,
  globalFilterEnabled = true,
  columnVisibility,
  sort = true,
  search = true,
  noToolbar = false,
  filterColumns = [],
  filterColumnsState = false,
  sortColumn,
  fallbackSortColumn,
  sortSelectNewLine,
  selectOptions,
  sectionBelowToolbar = undefined,
  opt,
}: TableUIProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedOpt, setSelectedOpt] = useState<"Oldest" | "Newest">("Newest");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (selectedOpt) {
      const fallback = fallbackSortColumn
        ? [
            {
              id: fallbackSortColumn,
              desc: true,
            },
          ]
        : [];
      setSorting([
        {
          id: sortColumn ?? "",
          desc: selectedOpt === "Newest",
        },
        ...fallback,
      ]);
    }
  }, [selectedOpt]);

  //global filter custom function
  const customGlobalFilterFn = <TData,>(
    row: Row<TData>,
    columnId: string,
    filterValue: string
  ) => {
    const column = row
      .getVisibleCells()
      .find((cell) => cell.column.id === columnId);

    if (column?.column.columnDef.enableGlobalFilter === false) {
      return true;
    }

    const value = row.getValue(columnId)?.toString().toLowerCase() || "";
    const filter = filterValue.toLowerCase();

    return value === filter;
  };

  const table = useReactTable<TData>({
    data: data || [],
    columns,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange:
      search && filterColumnsState ? setColumnFilters : undefined,
    getSortedRowModel: sort ? getSortedRowModel() : undefined,
    getFilteredRowModel: search ? getFilteredRowModel() : undefined,
    state: {
      sorting: sort ? sorting : undefined,
      globalFilter: search && globalFilterEnabled ? globalFilter : undefined,
      columnFilters: search && filterColumnsState ? columnFilters : undefined,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      columnVisibility,
    },
    ...opt,
  });

  return (
    <div>
      {!noToolbar && (
        <TableToolbar
          extraQuery={extraQuery}
          filterColumns={filterColumns}
          setColumnFilters={setColumnFilters}
          classNames={toolbarClassNames}
          headerDescription={headerDescription}
          search={search}
          sort={sort}
          setSelectedOpt={setSelectedOpt}
          header={header}
          selectedOpt={selectedOpt}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
          sortSelectNewLine={sortSelectNewLine}
          selectOptions={selectOptions}
          setSearching={setSearching}
        >
          {children}
        </TableToolbar>
      )}
      {sectionBelowToolbar}
      <Table>
        <TableHeader className={tableHeaderClass}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    className={`
                    ${
                      tableHeaderClass
                        ? index === 0
                          ? "rounded-tl-2xl"
                          : ""
                        : ""
                    }
                    ${
                      tableHeaderClass
                        ? index === columns.length - 2
                          ? "rounded-tr-2xl"
                          : ""
                        : ""
                    }
                  `}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="p-0 align-top"
              >
                <TableLoadingBar />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            <>
              {searching && (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="p-0 align-top"
                  >
                    <TableLoadingBar />
                  </TableCell>
                </TableRow>
              )}
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={tableRowClass}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={tableCellClass}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableUI;
