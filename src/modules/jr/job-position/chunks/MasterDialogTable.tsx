import type {
  MasterQuestionType,
  UpdateMasterQuestionPayloadType,
} from "@/api/jr/types";
import TableUI from "@/components/table/TableUI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { createContext, useState } from "react";

import { DialogDescription } from "@radix-ui/react-dialog";
import { t } from "i18next";
import { columns } from "../MasterQuestionsColumns/columns";

type MasterQuestionPropsType = {
  isEdit: boolean;
  rowId: string | undefined;
};

type MasterQuestionContextType = {
  data: UpdateMasterQuestionPayloadType | undefined;
  setData: React.Dispatch<
    React.SetStateAction<UpdateMasterQuestionPayloadType | undefined>
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

export const EditMasterQuestionContext = createContext<
  MasterQuestionContextType | undefined
>(undefined);

export function MasterDialogTable({
  isOpen,
  handleOpenChange,
  data,
  isLoading,
  children,
}: {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  data: MasterQuestionType[] | undefined;
  isLoading: boolean;
  children: React.ReactNode;
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
    UpdateMasterQuestionPayloadType | undefined
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
          <EditMasterQuestionContext.Provider
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
            <TableUI
              data={data ? data : []}
              columns={columns}
              loading={isLoading}
              header={t("fields.master-questions")}
              columnVisibility={{}}
              search={false}
              sortColumn="questionEn"
            >
              <></>
            </TableUI>
          </EditMasterQuestionContext.Provider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
