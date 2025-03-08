import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Bookmark } from "lucide-react";
import { UpdateQuestionsContext } from "../chunks/Dialog";
import { EditBasicQuestionTableContext } from "../chunks/BasicQuestionTable";



const ManageColumn = ({ rowId}: { rowId: string}) => {
  const editBasicQuestion = useContext(EditBasicQuestionTableContext);
  const updateQuestions = useContext(UpdateQuestionsContext);

  const handleEdit = () => {

    editBasicQuestion?.en.setEditBasicQuestion({ isEdit: true, rowId });
    editBasicQuestion?.th.setEditBasicQuestion({ isEdit: true, rowId });
    

  };

  const handleSave = () => {
    if (
      editBasicQuestion?.en.editBasicQuestion.rowId === rowId &&
      editBasicQuestion?.th.editBasicQuestion.rowId === rowId
    ) {

      editBasicQuestion?.en.setEditBasicQuestion({
        isEdit: false,
        rowId: undefined,
      });
      editBasicQuestion?.th.setEditBasicQuestion({
        isEdit: false,
        rowId: undefined,
      });
  
  
      updateQuestions?.basic.setRowId(Number(rowId));
  
      updateQuestions?.basic.setBasicQuestion((prev) => {
        if (prev) {
          return [
            ...prev,
            {
              question: editBasicQuestion.data?.question ?? "",
              questionTh: editBasicQuestion.data?.questionTh ?? "",
              basicQuestionID: editBasicQuestion.data?.basicQuestionID,
              jobPositionID: editBasicQuestion.data?.jobPositionID,
            },
          ];
        }
        return [
          {
            question: editBasicQuestion.data?.question ?? "",
            questionTh: editBasicQuestion.data?.questionTh ?? "",
            basicQuestionID: editBasicQuestion.data?.basicQuestionID,
            jobPositionID: editBasicQuestion.data?.jobPositionID,
          },
        ];
      });
    }
  };

  
  return (
    <div>
      {editBasicQuestion?.en.editBasicQuestion.isEdit &&
      editBasicQuestion.th.editBasicQuestion.isEdit ? (
        <Button type="button" variant={"columnIcon"} onClick={handleSave}>
          <Bookmark />
        </Button>
      ) : (
        <Button type="button" variant={"columnIcon"} onClick={handleEdit}>
          <Pencil2Icon />{""}
        </Button>
      )}
    </div>
  );
};

export default ManageColumn;
