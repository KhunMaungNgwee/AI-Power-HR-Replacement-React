import { QuestionAndAnswerType } from "@/api/candidate/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import i18next from "i18next";

export const columns: ColumnDef<QuestionAndAnswerType>[] = [
  {
    accessorKey: "questionEnglish",
    id: "questionEnglish",
    header: () => (
      <TableHeaderCell>{`placeholder.interview-score`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px]">
          {i18next.language === "en"
            ? row.original.questionEnglish
            : row.original.questionThai}
        </div>
      );
    },
  },
  {
    accessorKey: "answer",
    id: "answer",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.interview-answer`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return <div className="max-w-[400px]">{row.original.answer}</div>;
    },
  },
  {
    accessorKey: "score",
    id: "score",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.interview-score`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px]">
          {row.original.score === null ? "-" : `${row.original.score}/10`}
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
