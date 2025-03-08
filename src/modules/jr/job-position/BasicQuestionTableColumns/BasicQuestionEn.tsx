import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { EditBasicQuestionTableContext } from "../chunks/BasicQuestionTable";
import { UpdateBasicQuestionsType } from "../chunks/Dialog";

const WORD_COUNT_LIMIT = 500;

const BasicQuestionEn = ({
  data,
  rowId,
}: {
  data: UpdateBasicQuestionsType | undefined;
  rowId: string;
}) => {
  const editBasicQuestion = useContext(EditBasicQuestionTableContext);
  const [basicQuestionEn, setBasicQuestionEn] = useState<string>(
    data?.question ? data.question : ""
  );
  const [wordCount, setWordCount] = useState<number>(basicQuestionEn.length);

  useEffect(() => {
    setBasicQuestionEn(data?.question ? data?.question : "");
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (wordCount < WORD_COUNT_LIMIT) {
      setBasicQuestionEn(newValue);
    }

    setWordCount(basicQuestionEn.length);
    if (data) {
      editBasicQuestion?.setData((prev) => {
        if (prev) {
          return {
            ...data,
            ...prev,
            question: newValue,
          };
        } else {
          return {
            ...data,
            question: newValue,
          };
        }
      });
    }
  };
  return (
    <div>
      {editBasicQuestion?.en.editBasicQuestion.isEdit &&
      editBasicQuestion.en.editBasicQuestion.rowId === rowId ? (
        <div className="relative">
          <Input
            value={basicQuestionEn}
            onChange={handleChange}
            className="pr-16"
          />
          <span className="absolute text-gray-400 right-2 top-1/2 transform -translate-y-1/2">{`${wordCount}/${WORD_COUNT_LIMIT}`}</span>
        </div>
      ) : (
        <>{basicQuestionEn}</>
      )}
    </div>
  );
};

export default BasicQuestionEn;
