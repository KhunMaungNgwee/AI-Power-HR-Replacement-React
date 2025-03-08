import { CandidateByInterviewId } from "@/api/interview/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import ActionsColumn from "./ActionsColumn";

export const columns: ColumnDef<CandidateByInterviewId>[] = [
  {
    accessorKey: "index",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.number`}</TableHeaderCell>
    ),
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div className="text-center">{sortedIndex}.</div>;
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.candidate-name`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "phoneNumber",
    id: "phoneNumber",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.phoneNumber`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">{row.original.phoneNumber}</div>
      );
    },
  },
  {
    accessorKey: "email",
    id: "email",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.email`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.email}</div>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      return <ActionsColumn candidateID={row.original.candidateID} />;
    },
  },

  {
    // for sorting
    accessorKey: "createdAt",
  },
];

export const columnVisibility = { createdAt: false };
