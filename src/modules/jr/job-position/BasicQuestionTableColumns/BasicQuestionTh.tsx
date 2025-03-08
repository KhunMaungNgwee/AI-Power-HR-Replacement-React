import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { EditBasicQuestionTableContext } from "../chunks/BasicQuestionTable";
import { UpdateBasicQuestionsType } from "../chunks/Dialog";

const WORD_COUNT_LIMIT = 500;

const BasicQuestionTh = ({
  data,
  rowId,
}: {
  data: UpdateBasicQuestionsType | undefined;
  rowId: string;
}) => {
  const editBasicQuestionTh = useContext(EditBasicQuestionTableContext);
  const [basicQuestionTh, setBasicQuestionTh] = useState<string>(
    data?.questionTh ? data.questionTh : ""
  );
  const [wordCount, setWordCount] = useState<number>(basicQuestionTh.length);

  useEffect(() => {
    setBasicQuestionTh(data?.questionTh ? data.questionTh : "");
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (wordCount < WORD_COUNT_LIMIT) {
      setBasicQuestionTh(newValue);
    }

    setWordCount(basicQuestionTh.length);
    if (data) {
      editBasicQuestionTh?.setData((prev) => {
        if (prev) {
          return {
            ...data,
            ...prev,
            questionTh: newValue,
          };
        } else {
          return {
            ...data,
            questionTh: newValue,
          };
        }
      });
    }
  };

  return (
    <div>
      {editBasicQuestionTh?.th.editBasicQuestion.isEdit &&
      editBasicQuestionTh.th.editBasicQuestion.rowId === rowId ? (
        <div className="relative">
          <Input
            value={basicQuestionTh}
            onChange={handleChange}
            className="pr-16"
          />
          <span className="absolute text-gray-400 right-2 top-1/2 transform -translate-y-1/2">{`${wordCount}/${WORD_COUNT_LIMIT}`}</span>
        </div>
      ) : (
        <>{basicQuestionTh}</>
      )}
    </div>
  );
};

export default BasicQuestionTh;
