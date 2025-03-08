import { BasicQuestionAnswerType } from "@/api/candidate/types";
import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import i18next from "i18next";
import { t } from "i18next";

export const columns: ColumnDef<BasicQuestionAnswerType>[] = [
  {
    accessorKey: "basicQuestionEn",
    id: "basicQuestionEn",
    header: () => (
      <TableHeaderCell>{`fields.interview-questionnaire`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[500px]">
          {i18next.language === "en"
            ? row.original.basicQuestionEn
            : row.original.basicQuestionTh}
        </div>
      );
    },
  },
  {
    accessorKey: "questionFlag",
    id: "questionFlag",
    header: () => (
      <TableHeaderCell>{`fields.interview-answer`}</TableHeaderCell>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px]">
          {row.original.questionFlag
            ? t(`common.basic-question-yes`)
            : t(`common.basic-question-no`)}
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    id: "score",
    header: () => <TableHeaderCell>{`fields.interview-score`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px]">
          {row.original.questionFlag
            ? t(`common.basic-score-pass`)
            : t(`common.basic-score-fail`)}
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
