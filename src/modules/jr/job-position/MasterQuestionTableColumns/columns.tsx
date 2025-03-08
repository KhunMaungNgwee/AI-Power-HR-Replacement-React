import { ColumnDef } from "@tanstack/react-table";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import ManageColumn from "./ManageColumn";
import MasterQuestionTh from "./MasterQuestionTh";
import MasterQuestionEn from "./MasterQuestionEn";
import { UpdateMasterQuestionsType } from "../chunks/Dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UpdateMasterQuestionsType>[] = [
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
      return <MasterQuestionEn data={row.original} rowId={row.id} />;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "questionTh",
    header: () => <TableHeaderCell>{`fields.question-th`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <MasterQuestionTh data={row.original} rowId={row.id} />;
    },
  },
  {
    accessorKey: "edit",
    header: () => <TableHeaderCell>{`fields.edit`}</TableHeaderCell>,
    cell: (data) => {
      return <ManageColumn rowId={data.row.id} />;
    },
  },
];
