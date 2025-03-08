import TableHeaderCell from "@/components/table/TableHeaderCell";
import { CandidateType } from "@/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import CheckScoreColumn from "./CheckScoreColumn";
import ClipCopyIcon from "../chunks/icons/ClipCopyIcon.";

export const columns: ColumnDef<CandidateType>[] = [
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
    filterFn: "includesString",
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
    filterFn: "includesString",
  },
  {
    accessorKey: "source",
    id: "source",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">{`fields.source`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="min-w-max text-center">{row.original.source}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "job",
    id: "job",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.job`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">
          {row.original.jobPosition || "-"}
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "type",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.type`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.type || "-"}</div>;
    },
  },
  {
    // for sorting
    accessorKey: "createdAt",
  },
  {
    accessorKey: "scoreCheck",
    header: () => (
      <TableHeaderCell className="text-center min-w-[120px]">{`fields.score-check`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      {
        return (
          <div className="text-center">
            <CheckScoreColumn candidateID={row.original.candidateID} />
          </div>
        );
      }
    },
  },
  {
    accessorKey: "detail",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.detail`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <Link
          to={`/candidate-information/${row.original.candidateID}`}
          state={{ from: "/pool/check-documents" }}
          className="text-center"
        >
          <div className="flex justify-center">
            <ClipCopyIcon />
          </div>
        </Link>
      );
    },
  },
];

export const columnVisibility = { createdAt: false };
