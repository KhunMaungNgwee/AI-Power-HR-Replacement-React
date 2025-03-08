import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { OnboardCandidateType } from "@/api/candidate/types";
import { useNavigate } from "react-router-dom";

const DocumentReadyColumn = ({
  data,
  uploadIntoStatus,
}: {
  data: OnboardCandidateType;
  uploadIntoStatus: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/upload-into/${data.candidateID}`);
  };

  return (
    <div className="flex items-center justify-center w-full">
      {uploadIntoStatus && uploadIntoStatus === "Document progress" ? (
        <p>{t("common.document-process")}</p>
      ) : (
        <Button
          variant={"link"}
          size="icon"
          className="text-secondary"
          onClick={handleClick}
        >
          {t("common.document-ready")}
        </Button>
      )}
    </div>
  );
};

export default DocumentReadyColumn;
