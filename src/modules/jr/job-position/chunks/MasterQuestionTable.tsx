import TableUI from "@/components/table/TableUI";
import { t } from "i18next";
import { createContext, useMemo, useState } from "react";
import { columns } from "../MasterQuestionTableColumns/columns";
import { UpdateMasterQuestionsType } from "./Dialog";

type MasterQuestionPropsType = {
  isEdit: boolean;
  rowId: string | undefined;
};

type MasterQuestionContextType = {
  data: UpdateMasterQuestionsType | undefined;
  setData: React.Dispatch<
    React.SetStateAction<UpdateMasterQuestionsType | undefined>
  >;
  en: {
    editMasterQuestion: {
      isEdit: boolean;
      rowId: string | undefined;
    };
    setEditMasterQuestion: React.Dispatch<
      React.SetStateAction<{ isEdit: boolean; rowId: string | undefined }>
    >;
  };
  th: {
    editMasterQuestion: {
      isEdit: boolean;
      rowId: string | undefined;
    };
    setEditMasterQuestion: React.Dispatch<
      React.SetStateAction<{ isEdit: boolean; rowId: string | undefined }>
    >;
  };
};

export const EditMasterQuestionTableContext = createContext<
  MasterQuestionContextType | undefined
>(undefined);

export function MasterQuestionTable({
  data,
}: {
  data:
    | {
        questionEnglish: string;
        questionThai: string;
      }[]
    | undefined;
}) {
  const [editMasterQuestion, setEditMasterQuestion] =
    useState<MasterQuestionPropsType>({
      isEdit: false,
      rowId: undefined,
    });
  const [editMasterQuestionTh, setEditMasterQuestionTh] =
    useState<MasterQuestionPropsType>({
      isEdit: false,
      rowId: undefined,
    });

  const [masterQuestions, setMasterQuestions] = useState<
    UpdateMasterQuestionsType | undefined
  >(undefined);

  const memoizedTable = useMemo(
    () => (
      <TableUI
        data={data}
        columns={columns}
        loading={false}
        header={t("fields.master-questions")}
        columnVisibility={{}}
        search={false}
        sortColumn="questionEn"
      >
        <></>
      </TableUI>
    ),
    [data?.toString()]
  );

  return (
    <div className="p-6 bg-white rounded-lg">
      <EditMasterQuestionTableContext.Provider
        value={{
          data: masterQuestions,
          setData: setMasterQuestions,
          en: { editMasterQuestion, setEditMasterQuestion },
          th: {
            editMasterQuestion: editMasterQuestionTh,
            setEditMasterQuestion: setEditMasterQuestionTh,
          },
        }}
      >
        {memoizedTable}
      </EditMasterQuestionTableContext.Provider>
    </div>
  );
}
