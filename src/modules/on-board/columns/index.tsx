import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import SummaryColumn from "./SummaryColumn";
import UploadIntoColumn from "./UploadIntoColumn";
import ManageColumn from "./ManageColumn";
import DocumentReadyColumn from "./DocumentReadyColumn";
import { OnboardCandidateType } from "@/api/candidate/types";

export const columns: ColumnDef<OnboardCandidateType>[] = [
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
    accessorKey: "candidateName",
    header: () => (
      <TableHeaderCell className="text-center text-nowrap">{`fields.candidate-name`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.candidateName}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">{`fields.phoneNumber`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">{row.original.phoneNumber}</div>
      );
    },
  },
  {
    accessorKey: "job",
    header: () => (
      <TableHeaderCell className="min-w-max text-center">{`fields.job`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">
          {row.original.jobPosition ? row.original.jobPosition : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "f2fInterviewStatus",
    header: () => (
      <TableHeaderCell className="text-nowrap text-center">{`fields.f2f-interview-status`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.f2FStatus !== null ? row.original.f2FStatus : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.summary`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <SummaryColumn
          candidateID={row.original.candidateID}
          recruiterStatus={row.original.recruiterStatus}
          column={"summary"}
        />
      );
    },
  },
  {
    accessorKey: "recruiterStatus",
    header: () => (
      <TableHeaderCell className="text-center text-nowrap">{`fields.recruiter-status`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return row.original.recruiterStatus ? (
        <SummaryColumn
          candidateID={row.original.candidateID}
          recruiterStatus={row.original.recruiterStatus}
        />
      ) : (
        <div className="min-w-max text-center">
          {row.original.recruiterStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "uploadInto",
    header: () => (
      <TableHeaderCell className="text-center text-nowrap">{`fields.upload-into`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <UploadIntoColumn
          data={row.original}
          recruiterStatus={row.original.recruiterStatus}
          uploadIntoStatus={row.original.uploadIntoStatus}
        />
      );
    },
  },
  {
    accessorKey: "uploadIntoStatus",
    header: () => (
      <TableHeaderCell className="text-center text-nowrap">{`fields.upload-into-status`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <DocumentReadyColumn
          data={row.original}
          uploadIntoStatus={row.original.uploadIntoStatus}
        />
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <ManageColumn data={row.original} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <TableHeaderCell className="text-center text-nowrap">{`fields.created-at`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max text-center">
          {row.original.createdAt.toString()}
        </div>
      );
    },
  },
];

export const columnVisibility = { createdAt: false };
