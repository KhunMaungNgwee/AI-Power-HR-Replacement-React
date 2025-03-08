import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { EditMasterQuestionTableContext } from "../chunks/MasterQuestionTable";
import { UpdateMasterQuestionsType } from "../chunks/Dialog";
const WORD_COUNT_LIMIT = 500;

const MasterQuestionTh = ({
  data,
  rowId,
}: {
  data: UpdateMasterQuestionsType | undefined;
  rowId: string;
}) => {
  const editMasterQuestionTh = useContext(EditMasterQuestionTableContext);
  const [masterQuestionTh, setMasterQuestionTh] = useState<string>(
    data?.questionThai ? data.questionThai : ""
  );
  const [wordCount, setWordCount] = useState<number>(masterQuestionTh.length);

  useEffect(() => {
    setMasterQuestionTh(data?.questionThai ? data.questionThai : "");
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (wordCount < WORD_COUNT_LIMIT) {
      setMasterQuestionTh(newValue);
    }

    setWordCount(masterQuestionTh.length);
    if (data) {
      editMasterQuestionTh?.setData((prev) => {
        if (prev) {
          return {
            ...data,
            ...prev,
            questionThai: newValue,
          };
        } else {
          return {
            ...data,
            questionThai: newValue,
          };
        }
      });
    }
  };

  return (
    <div>
      {editMasterQuestionTh?.th.editMasterQuestion.isEdit &&
      editMasterQuestionTh.th.editMasterQuestion.rowId === rowId ? (
        <div className="relative">
          <Input
            value={masterQuestionTh}
            onChange={handleChange}
            className="pr-16"
          />
          <span className="absolute text-gray-400 right-2 top-1/2 transform -translate-y-1/2">{`${wordCount}/${WORD_COUNT_LIMIT}`}</span>
        </div>
      ) : (
        <>{masterQuestionTh}</>
      )}
    </div>
  );
};

export default MasterQuestionTh;
