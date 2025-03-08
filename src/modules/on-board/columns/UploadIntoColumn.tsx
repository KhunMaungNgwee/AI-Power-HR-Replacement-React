import { OnboardCandidateType } from "@/api/candidate/types";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadIntoColumn = ({
  data,
  recruiterStatus,
  uploadIntoStatus,
}: {
  data: OnboardCandidateType;
  recruiterStatus: string;
  uploadIntoStatus: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/upload-into/${data.candidateID}`);
  };
  return (
    <div className="flex items-center justify-center w-full">
      {recruiterStatus === "Confirm" &&
      uploadIntoStatus === "Document progress" ? (
        <Button variant={"columnIcon"} onClick={handleClick} size="icon">
          <CloudUpload color="#006192" />
        </Button>
      ) : (
        <Button variant={"columnIcon"} size="icon" disabled>
          <CloudUpload color="gray" />
        </Button>
      )}
    </div>
  );
};

export default UploadIntoColumn;
