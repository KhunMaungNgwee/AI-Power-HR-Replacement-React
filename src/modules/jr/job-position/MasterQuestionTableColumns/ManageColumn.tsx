import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Bookmark } from "lucide-react";
import { UpdateQuestionsContext } from "../chunks/Dialog";
import { EditMasterQuestionTableContext } from "../chunks/MasterQuestionTable";


const ManageColumn = ({ rowId }: { rowId: string }) => {
  const editMasterQuestion = useContext(EditMasterQuestionTableContext);
  const updateQuestions = useContext(UpdateQuestionsContext);

  const handleEdit = () => {
    editMasterQuestion?.en.setEditMasterQuestion({ isEdit: true, rowId });
    editMasterQuestion?.th.setEditMasterQuestion({ isEdit: true, rowId});
    

  };

  const handleSave = () => {
    if (
      editMasterQuestion?.en.editMasterQuestion.rowId === rowId &&
      editMasterQuestion?.th.editMasterQuestion.rowId === rowId
    ) {

      editMasterQuestion?.en.setEditMasterQuestion({
        isEdit: false,
        rowId: undefined,
      });
      editMasterQuestion?.th.setEditMasterQuestion({
        isEdit: false,
        rowId: undefined,
      });

  
      updateQuestions?.master.setRowId(Number(rowId));
  
  
      updateQuestions?.master.setMasterQuestion((prev) => {
        if (prev) {
          return [
            ...prev,
            {
              questionEnglish: editMasterQuestion.data?.questionEnglish ?? "",
              questionThai: editMasterQuestion.data?.questionThai ?? "",
              questionID: editMasterQuestion.data?.questionID,
              jobPositionID: editMasterQuestion.data?.jobPositionID,
            },
          ];
        }
        return [
          {
            questionEnglish: editMasterQuestion.data?.questionEnglish ?? "",
            questionThai: editMasterQuestion.data?.questionThai ?? "",
            questionID: editMasterQuestion.data?.questionID,
            jobPositionID: editMasterQuestion.data?.jobPositionID,
          },
        ];
      });
    }
  };
  
  return (
    <div>
      {editMasterQuestion?.en.editMasterQuestion.isEdit &&
      editMasterQuestion.th.editMasterQuestion.isEdit ? (
        <Button variant={"columnIcon"} type="button" onClick={handleSave}>
          <Bookmark />
        </Button>
      ) : (
        <Button variant={"columnIcon"} type="button" onClick={handleEdit}>
          <Pencil2Icon />{""}
        </Button>
      )}
    </div>
  );
};

export default ManageColumn;
