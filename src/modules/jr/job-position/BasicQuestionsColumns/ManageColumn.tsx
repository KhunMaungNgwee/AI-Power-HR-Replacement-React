import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { EditBasicQuestionContext } from "../chunks/BasicDialogTable";
import { Bookmark } from "lucide-react";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateBasicQuestionPayloadType } from "@/api/jr/types";
import { UpdateBasicQuestionsType } from "../chunks/Dialog";
import { t } from "i18next";

const ManageColumn = ({
  rowId,
  data,
}: {
  rowId: string;
  data: UpdateBasicQuestionsType;
}) => {
  const editBasicQuestion = useContext(EditBasicQuestionContext);
  const queryClient = useQueryClient();

  const { mutate: updateBasicQuestion } =
    api.jrPosition.updateBasicQuestion.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.update-success", { data: "Basic Question" }),
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["getBasicQuestionsByID"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getAllJobPosition"],
        });
      },
      onError: (error) => {
        console.error("Error updating master question:", error);
        toast({
          title: "Error updating master question",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handleEdit = () => {
    editBasicQuestion?.en.setEditBasicQuestion({ isEdit: true, rowId });
    editBasicQuestion?.th.setEditBasicQuestion({ isEdit: true, rowId });

    editBasicQuestion?.setData(data);
  };

  const handleSave = () => {
    if (
      editBasicQuestion?.en.editBasicQuestion.rowId === rowId &&
      editBasicQuestion?.th.editBasicQuestion.rowId === rowId
    ) {
      const { question, questionTh } = editBasicQuestion?.data || {};

      const payload: UpdateBasicQuestionPayloadType = {
        basicQuestionID: editBasicQuestion.data?.basicQuestionID as string,
        jobPositionID: editBasicQuestion.data?.jobPositionID as string,
        question: question || data.question,
        questionTh: questionTh || data.questionTh,
      };

      if (!payload) {
        toast({
          title: "Payload is incomplete or missing!",
          variant: "destructive",
        });
        return;
      }

      updateBasicQuestion(payload);

      editBasicQuestion?.en.setEditBasicQuestion({
        isEdit: false,
        rowId: undefined,
      });
      editBasicQuestion?.th.setEditBasicQuestion({
        isEdit: false,
        rowId: undefined,
      });
    }
  };

  return (
    <div>
      {editBasicQuestion?.en.editBasicQuestion.isEdit &&
      editBasicQuestion.en.editBasicQuestion.rowId === rowId &&
      editBasicQuestion.th.editBasicQuestion.isEdit ? (
        <Button type="button" variant={"columnIcon"} onClick={handleSave}>
          <Bookmark />
        </Button>
      ) : (
        <Button type="button" variant={"columnIcon"} onClick={handleEdit}>
          <Pencil2Icon />
        </Button>
      )}
    </div>
  );
};

export default ManageColumn;
