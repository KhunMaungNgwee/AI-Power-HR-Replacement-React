import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { EditMasterQuestionTableContext } from "../chunks/MasterQuestionTable";
import { UpdateMasterQuestionsType } from "../chunks/Dialog";

const WORD_COUNT_LIMIT = 500;

const MasterQuestionEn = ({
  data,
  rowId,
}: {
  data: UpdateMasterQuestionsType | undefined;
  rowId: string;
}) => {
  const editMasterQuestion = useContext(EditMasterQuestionTableContext);
  const [masterQuestionEn, setMasterQuestionEn] = useState<string>(
    data?.questionEnglish ? data.questionEnglish : ""
  );
  const [wordCount, setWordCount] = useState<number>(masterQuestionEn.length);

  useEffect(() => {
    setMasterQuestionEn(data?.questionEnglish ? data.questionEnglish : "");
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target?.value;
    if (wordCount < WORD_COUNT_LIMIT) {
      setMasterQuestionEn(newValue);
    }

    setWordCount(masterQuestionEn.length);
    if (data) {
      editMasterQuestion?.setData((prev) => {
        if (prev) {
          return {
            ...data,
            ...prev,
            questionEnglish: newValue,
          };
        } else {
          return {
            ...data,
            questionEnglish: newValue,
          };
        }
      });
    }
  };
  return (
    <div>
      {editMasterQuestion?.en.editMasterQuestion.isEdit &&
      editMasterQuestion.en.editMasterQuestion.rowId === rowId ? (
        <div className="relative">
          <Input
            value={masterQuestionEn}
            onChange={handleChange}
            className="pr-16"
          />
          <span className="absolute text-gray-400 right-2 top-1/2 transform -translate-y-1/2">{`${wordCount}/${WORD_COUNT_LIMIT}`}</span>
        </div>
      ) : (
        <>{masterQuestionEn}</>
      )}
    </div>
  );
};

export default MasterQuestionEn;
