import { ColumnDef } from "@tanstack/react-table";
import ManageColumn from "./ManageColumn";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { JobPositionType } from "@/api/position/types";
import MasterQuestionsColumn from "./MasterQuestionsColumn";
import BasicQuestionsColumn from "./BasicQuestionsColumn";
import { formatDate } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<JobPositionType>[] = [
  {
    accessorKey: "number",
    header: () => <TableHeaderCell>{`fields.number`}</TableHeaderCell>,
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div>{sortedIndex}</div>;
    },
    filterFn: "equals",
  },
  {
    accessorKey: "positionName",
    header: () => (
      <TableHeaderCell className="w-[200px]">{`fields.position-name`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div>{row.original.positionName}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "jobLevel",
    header: () => <TableHeaderCell>{`fields.job-level`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.jobLevel}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "jobDescription",
    header: () => <TableHeaderCell>{`fields.job-description`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.jobDescription}</div>;
    },
    filterFn: "includesString",
  },

  {
    accessorKey: "masterQuestions",
    header: () => (
      <TableHeaderCell className="w-[150px] text-center">{`fields.master-questions`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <MasterQuestionsColumn jobPositionID={row.original.jobPositionID} />
        </div>
      );
    },
  },
  {
    accessorKey: "basicQuestions",
    header: () => (
      <TableHeaderCell className="w-[150px] text-center">{`fields.basic-questions`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <BasicQuestionsColumn jobPositionID={row.original.jobPositionID} />
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
    header: () => <TableHeaderCell>{`fields.action`}</TableHeaderCell>,
    cell: (data) => {
      return <ManageColumn data={data.row.original} />;
    },
  },
];
