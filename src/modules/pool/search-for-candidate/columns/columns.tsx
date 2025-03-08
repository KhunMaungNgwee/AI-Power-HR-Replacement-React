import TableHeaderCell from "@/components/table/TableHeaderCell";
import { Checkbox } from "@/components/ui/checkbox";
import { CandidateType } from "@/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import CommentColumn from "./CommentColumn";
import DetailColumn from "./DetailColumn";
import HistoryColumn from "./HistoryColumn";

export const columns: ColumnDef<CandidateType>[] = [
  {
    accessorKey: "select",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.select`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center mr-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "number",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.number`}</TableHeaderCell>
    ),
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div className="text-center">{sortedIndex}</div>;
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
    filterFn: "equalsString",
  },
  {
    accessorKey: "phoneNumber",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.phoneNumber`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.phoneNumber}</div>;
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "province",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.province`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">
          {row.original.province || "-"}
        </div>
      );
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "educationLevel",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">{`fields.education-level`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">
          {row.original.educationLevel}
        </div>
      );
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "source",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.source`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="min-w-max text-center">{row.original.source}</div>;
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "type",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.type`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.type || "-"}</div>;
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "ageRange",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.age-range`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.ageRange || "-"}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "comment",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.comment`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <CommentColumn data={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "history",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.history`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <HistoryColumn data={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "detail",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.detail`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <DetailColumn data={row.original} />
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
    enableGlobalFilter: false,
  },
];
