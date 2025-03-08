import { ColumnDef } from "@tanstack/react-table";
import { JobRequisitionType } from "@/shared/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import EditIcon from "../chunks/icons/EditIcon";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";

export const columns: ColumnDef<JobRequisitionType>[] = [
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

    filterFn: "includesString",
  },
  {
    accessorKey: "jobRequisition",
    header: () => <TableHeaderCell>{`fields.job-requisition`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] min-w-max">
          {row.original.jobRequisition}
        </div>
      );
    },

    filterFn: "includesString",
  },
  {
    accessorKey: "position",
    id: "position",
    header: () => <TableHeaderCell>{`fields.position`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] min-w-max text-center">
          {row.original.position}
        </div>
      );
    },

    filterFn: "includesString",
  },
  {
    accessorKey: "headCount",
    id: "headCount",
    header: () => <TableHeaderCell>{`fields.head-count`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] min-w-max text-center">
          {row.original.headCount}
        </div>
      );
    },

    filterFn: "includesString",
  },
  {
    accessorKey: "requestBy",
    id: "requestBy",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">
        {`fields.request-by`}
      </TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">{row.original.requestBy}</div>
      );
    },

    filterFn: "includesString",
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

  {
    accessorKey: "edit",
    id: "edit",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">{`fields.edit`}</TableHeaderCell>
    ),
    cell: () => {
      return (
        <div className="flex justify-center items-center h-full w-full">
          <Button
            variant={"columnIcon"}
            className="min-w-max flex justify-center items-center"
            size={"icon"}
          >
            <EditIcon />
          </Button>
        </div>
      );
    },
  },
];
