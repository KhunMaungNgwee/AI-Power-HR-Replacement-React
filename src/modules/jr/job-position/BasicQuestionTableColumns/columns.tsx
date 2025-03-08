import { ColumnDef } from "@tanstack/react-table";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import ManageColumn from "./ManageColumn";
import BasicQuestionEn from "./BasicQuestionEn";
import BasicQuestionTh from "./BasicQuestionTh";
import { UpdateBasicQuestionsType } from "../chunks/Dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UpdateBasicQuestionsType>[] = [
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
      return <BasicQuestionEn data={row.original} rowId={row.id} />;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "questionTh",
    header: () => <TableHeaderCell>{`fields.question-th`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <BasicQuestionTh data={row.original} rowId={row.id} />;
    },
  },
  {
    accessorKey: "edit",
    header:  () => <TableHeaderCell>{`fields.edit`}</TableHeaderCell>,
    cell: (data) => {
      return <ManageColumn rowId={data.row.id} />;
    },
  },
];
