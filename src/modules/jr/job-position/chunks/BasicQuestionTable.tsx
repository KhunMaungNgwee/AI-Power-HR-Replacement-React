import TableUI from "@/components/table/TableUI";
import { t } from "i18next";
import { createContext, useMemo, useState } from "react";
import { columns } from "../BasicQuestionTableColumns/columns";
import { UpdateBasicQuestionsType } from "./Dialog";

type BasicQuestionPropsType = {
  isEdit: boolean;
  rowId: string | undefined;
};

type BasicQuestionContextType = {
  data: UpdateBasicQuestionsType | undefined;
  setData: React.Dispatch<
    React.SetStateAction<UpdateBasicQuestionsType | undefined>
  >;
  en: {
    editBasicQuestion: {
      isEdit: boolean;
      rowId: string | undefined;
    };
    setEditBasicQuestion: React.Dispatch<
      React.SetStateAction<{ isEdit: boolean; rowId: string | undefined }>
    >;
  };
  th: {
    editBasicQuestion: {
      isEdit: boolean;
      rowId: string | undefined;
    };
    setEditBasicQuestion: React.Dispatch<
      React.SetStateAction<{ isEdit: boolean; rowId: string | undefined }>
    >;
  };
};

export const EditBasicQuestionTableContext = createContext<
  BasicQuestionContextType | undefined
>(undefined);

export function BasicQuestionTable({
  data,
}: {
  data: UpdateBasicQuestionsType[] | undefined;
}) {
  const [editBasicQuestion, setEditBasicQuestion] =
    useState<BasicQuestionPropsType>({
      isEdit: false,
      rowId: undefined,
    });
  const [editBasicQuestionTh, setEditBasicQuestionTh] =
    useState<BasicQuestionPropsType>({
      isEdit: false,
      rowId: undefined,
    });

  const [basicQuestions, setBasicQuestions] = useState<
    UpdateBasicQuestionsType | undefined
  >(undefined);

  const memoizedTable = useMemo(
    () => (
      <TableUI
        data={data}
        columns={columns}
        loading={false}
        header={t("fields.basic-questions")}
        columnVisibility={{}}
        search={false}
        sortColumn="questionEn"
      >
        <></>
      </TableUI>
    ),
    [data, columns]
  );

  return (
    <div className="p-6 bg-white rounded-lg">
      <EditBasicQuestionTableContext.Provider
        value={{
          data: basicQuestions,
          setData: setBasicQuestions,
          en: { editBasicQuestion, setEditBasicQuestion },
          th: {
            editBasicQuestion: editBasicQuestionTh,
            setEditBasicQuestion: setEditBasicQuestionTh,
          },
        }}
      >
    
        {memoizedTable}
      </EditBasicQuestionTableContext.Provider>
    </div>
  );
}
