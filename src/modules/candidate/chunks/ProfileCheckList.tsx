import { CandidateAnswerType } from "@/shared/types";
import { useTranslation } from "react-i18next";

type DetailsBlockType = {
  data?: CandidateAnswerType[];
};

const ProfileCheckList = ({ data }: DetailsBlockType) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="size-fit px-3 py-2 bg-white rounded-md shadow-sm">
      <h4 className="mb-2 font-bold">{t("candidate.profile-checklist")}</h4>

      <ol className="space-y-1.5 text-sm">
        {data?.map((qna, index) => (
          <li key={index} className="flex items-center justify-between gap-3 text-xs">
            <span className="md:col-span-2 col-span-4">
              {index + 1}.{" "}
              {i18n.language === "en"
                ? qna.basicQuestionEn
                : qna.basicQuestionTh}
            </span>
            
            <span className="bg-accent text-secondary w-fit md:col-span-1 col-span-1 p-1 px-2 rounded-sm">
              {t(qna.questionFlag ? "common.can" : "common.cannot")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProfileCheckList;
