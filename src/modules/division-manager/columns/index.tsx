import { DivisionManagerType } from "@/api/position/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<DivisionManagerType>[] = [
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
    accessorKey: "firstName",
    header: () => <TableHeaderCell>{`fields.first-name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.firstName}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "lastName",
    header: () => <TableHeaderCell>{`fields.last-name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.lastName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.email`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.email}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <TableHeaderCell>{`fields.phoneNumber`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.phoneNumber}</div>;
    },
  },
  {
    accessorKey: "position",
    header: () => <TableHeaderCell>{`fields.position`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.position}</div>;
    },
  },
  {
    accessorKey: "lineCode",
    header: () => <TableHeaderCell>{`fields.line-code`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div className={row.original.lineCode ? "" : "pl-4"}>
          {row.original.lineCode ? row.original.lineCode : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "lineUserID",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.line-user-id`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.lineUserID ? row.original.lineUserID : "-"}
        </div>
      );
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
    header: () => (
      <TableHeaderCell className="text-center">{`fields.actions`}</TableHeaderCell>
    ),
    cell: (data) => {
      return <ManageColumn data={data.row.original} />;
    },
  },
];
