import { InterviewRoundType } from "@/api/interview/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import ActionsColumn from "./ActionsColumn";
import StatusColumn from "./StatusColumn";

export const columns: ColumnDef<InterviewRoundType>[] = [
  {
    accessorKey: "index",
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
    accessorKey: "createdAt",
    header: () => <TableHeaderCell>{`fields.date`}</TableHeaderCell>,
    cell: ({ row }) => {
      const parsedTime = parseISO(`${row.original.createdAt}Z`);

      return (
        <div className="min-w-max">
          {format(parsedTime, "HH:mm | dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "departmentRequestName",
    header: () => (
      <TableHeaderCell>{`fields.departmentRequestName`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] min-w-max">
          {row.original.departmentRequestName}
        </div>
      );
    },
  },
  {
    accessorKey: "educationLevelName",
    header: () => (
      <TableHeaderCell className="min-w-max">{`fields.educationLevelName`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="min-w-max">{row.original.educationLevelName}</div>;
    },
  },
  {
    accessorKey: "provinceName",
    header: () => <TableHeaderCell>{`fields.provinceName`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.provinceName}</div>;
    },
  },
  {
    accessorKey: "peopleCount",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.people`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.peopleCount ?? 0}</div>;
    },
  },
  {
    accessorKey: "age",
    header: () => <TableHeaderCell>{`fields.ageRange`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="min-w-max">{row.original.ageRange}</div>;
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.type`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="px-3 text-center">{row.original.type}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <ActionsColumn
          interviewID={row.original.interviewID}
          data={row.original}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.status`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <StatusColumn interviewID={row.original.interviewID} />;
    },
  },
];

export const columnVisibility = {};
