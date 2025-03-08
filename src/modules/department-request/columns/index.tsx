import { ColumnDef } from "@tanstack/react-table";
import ManageColumn from "./ManageColumn";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { DepartmentRequestType } from "@/api/position/types";
import { formatDate } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<DepartmentRequestType>[] = [
  {
    accessorKey: "number",
    header: () => <TableHeaderCell>{`fields.number`}</TableHeaderCell>,
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div>{sortedIndex}</div>;
    },
  },
  {
    accessorKey: "departmentRequestName",
    header: () => (
      <TableHeaderCell>{`fields.department-request-name`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div>{row.original.departmentRequestName}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "address",
    header: () => <TableHeaderCell>{`fields.address`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.address}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TableHeaderCell>{`fields.apply-date`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(row.original.createdAt.toString(), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <TableHeaderCell>{`fields.action`}</TableHeaderCell>,
    cell: (data) => {
      return <ManageColumn data={data.row.original} />;
    },
  },
];
