import { InterviewRoundType } from "@/api/interview/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import ActionsColumn from "./ActionsColumn";
import DetailsColumn from "./DetailsColumn";
import { t } from "i18next";

export const columns: ColumnDef<InterviewRoundType>[] = [
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
          <div>{row.original.departmentRequestName}</div>
          <div className="flex flex-col">
            <span className="italic font-medium text-[12px] leading-3 text-gray-500/40 mb-1">
              {t(`fields.manager`)} : {row.original.divisionManager}
            </span>
            <span className="italic font-medium text-[12px] leading-3 text-gray-500/40">
              {t(`fields.head-department`)} :{" "}
              {row.original.departmentRequestName}
            </span>
          </div>
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
    accessorKey: "ageRange",
    header: () => <TableHeaderCell>{`fields.ageRange`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="min-w-max">{row.original.ageRange}</div>;
    },
  },
  {
    accessorKey: "type",
    header: () => <TableHeaderCell>{`fields.type`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="min-w-max">{row.original.type}</div>;
    },
  },
  {
    accessorKey: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <DetailsColumn
          interviewID={row.original.interviewID}
          departmentName={row.original.departmentRequestName}
        />
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <ActionsColumn
          interviewID={row.original.interviewID}
          peopleCount={row.original.peopleCount}
        />
      );
    },
  },
];

export const columnVisibility = {};
