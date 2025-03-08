import TableUI from "@/components/table/TableUI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { t } from "i18next";
import React, { createContext, useState } from "react";
import { columns } from "../BasicQuestionsColumns/columns";
import { UpdateBasicQuestionsType } from "./Dialog";
import { BasicQuestionType } from "@/api/jr/types";

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

export const EditBasicQuestionContext = createContext<
  BasicQuestionContextType | undefined
>(undefined);

export function BasicDialogTable({
  data,
  isOpen,
  handleOpenChange,
  isLoading,
  children,
}: {
  data: BasicQuestionType[] | undefined;
  isOpen: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  handleOpenChange: (open: boolean) => void;
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
  >();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div>{children}</div>
      <DialogContent className="max-w-fit md:min-w-[600px] xl:min-w-[1000px] h-[400px] overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="p-6 bg-white rounded-lg">
          <EditBasicQuestionContext.Provider
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
            <TableUI
              data={data ? data : []}
              columns={columns}
              loading={isLoading}
              header={t("fields.basic-questions")}
              search={false}
              columnVisibility={{}}
              sortColumn="question"
            >
              <></>
            </TableUI>
          </EditBasicQuestionContext.Provider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
