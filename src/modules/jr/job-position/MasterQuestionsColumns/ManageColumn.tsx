import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { EditMasterQuestionContext } from "../chunks/MasterDialogTable";
import api from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { UpdateMasterQuestionPayloadType } from "@/api/jr/types";
import { t } from "i18next";

const ManageColumn = ({
  rowId,
  data,
}: {
  rowId: string;
  data: UpdateMasterQuestionPayloadType;
}) => {
  const editMasterQuestion = useContext(EditMasterQuestionContext);
  const queryClient = useQueryClient();

  const { mutate: updateMasterQuestion } =
    api.jrPosition.updateMasterQuestion.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.update-success", { data: "Master Question" }),
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["getMasterQuestionsByID"],
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
    editMasterQuestion?.en.setEditMasterQuestion({ isEdit: true, rowId });
    editMasterQuestion?.th.setEditMasterQuestion({ isEdit: true, rowId });
    editMasterQuestion?.setData(data);
  };

  const handleSave = () => {
    if (
      editMasterQuestion?.en.editMasterQuestion.rowId === rowId &&
      editMasterQuestion?.th.editMasterQuestion.rowId === rowId
    ) {
      const { questionEnglish, questionThai } = editMasterQuestion?.data || {};

      const payload: UpdateMasterQuestionPayloadType = {
        questionID: data.questionID,
        jobPositionID: data.jobPositionID,
        questionThai: questionThai || data.questionThai,
        questionEnglish: questionEnglish || data.questionEnglish,
      };

      updateMasterQuestion(payload);

      editMasterQuestion?.en.setEditMasterQuestion({
        isEdit: false,
        rowId: undefined,
      });
      editMasterQuestion?.th.setEditMasterQuestion({
        isEdit: false,
        rowId: undefined,
      });
    }
  };

  return (
    <div>
      {editMasterQuestion?.en.editMasterQuestion.isEdit &&
      editMasterQuestion.en.editMasterQuestion.rowId === rowId &&
      editMasterQuestion.th.editMasterQuestion.isEdit ? (
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
