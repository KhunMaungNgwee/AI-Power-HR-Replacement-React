import { ColumnDef } from "@tanstack/react-table";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { MasterQuestionType } from "@/api/position/types";
import MasterQuestionEn from "./MasterQuestionEn";
import MasterQuestionTh from "./MasterQuestionTh";
import ManageColumn from "./ManageColumn";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MasterQuestionType>[] = [
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
    accessorKey: "questionEn",
    header: () => <TableHeaderCell>{`fields.question-en`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <MasterQuestionEn rowId={row.id} data={row.original} />;
    },
  },
  {
    accessorKey: "questionTh",
    header: () => <TableHeaderCell>{`fields.question-th`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <MasterQuestionTh rowId={row.id} data={row.original} />;
    },
  },
  {
    accessorKey: "edit",
    header: () => <TableHeaderCell>{`fields.edit`}</TableHeaderCell>,
    cell: (data) => {
      return <ManageColumn data={data.row.original} rowId={data.row.id} />;
    },
  },
];
