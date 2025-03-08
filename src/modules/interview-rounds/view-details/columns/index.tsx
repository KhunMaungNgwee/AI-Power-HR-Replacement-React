import { CandidateByInterviewId } from "@/api/interview/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import F2fDialog from "./F2fDialog";
import CheckScoreColumn from "./CheckScoreColumn";

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
    header: () => <TableHeaderCell>{`fields.candidate-name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="max-w-[100px] min-w-max">{row.original.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "phoneNumber",
    id: "phoneNumber",
    header: () => <TableHeaderCell>{`fields.phoneNumber`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="min-w-max">{row.original.phoneNumber}</div>;
    },
  },
  {
    accessorKey: "score",
    id: "score",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.score`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.interviewScore === null
            ? "-"
            : row.original.interviewScore}
        </div>
      );
    },
  },
  {
    accessorKey: "divisionApproved",
    id: "divisionApproved",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.division-approved`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">{row.original.divisionManagerName}</div>
      );
    },
  },
  {
    accessorKey: "f2fAppointment",
    id: "f2fAppointment",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.f2f-appointment`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <F2fDialog data={row.original.candidateID} />;
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.status`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            row.original.f2FStatus === null
              ? ""
              : row.original.f2FStatus === "Accepted"
              ? "text-success"
              : "text-destructive",
            "text-center"
          )}
        >
          {row.original.f2FStatus === null ? "-" : row.original.f2FStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "scoreCheck",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.score-check`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <CheckScoreColumn candidateID={row.original.candidateID} />
        </div>
      );
    },
  },
  {
    accessorKey: "commentByApprover",
    id: "commentByApprover",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.comment-by-approver`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className={"text-center"}>
          {row.original.commentApprover === null ||
          row.original.commentApprover === ""
            ? "-"
            : row.original.commentApprover}
        </div>
      );
    },
  },
  {
    accessorKey: "statusScoreCheck",
    id: "statusScoreCheck",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.status-score-check`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            row.original.statusScoreCheck === null
              ? ""
              : row.original.statusScoreCheck === "Accepted"
              ? "text-success"
              : "text-destructive",
            "text-center"
          )}
        >
          {row.original.statusScoreCheck === null
            ? "-"
            : row.original.statusScoreCheck}
        </div>
      );
    },
  },
  {
    // for sorting
    accessorKey: "createdAt",
  },
];

export const columnVisibility = { createdAt: false };
