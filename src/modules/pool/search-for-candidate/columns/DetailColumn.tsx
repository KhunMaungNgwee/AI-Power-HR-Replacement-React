import { Button } from "@/components/ui/button";
import { CandidateType } from "@/shared/types";
import { ClipboardCopy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DetailColumn = ({ data }: { data: CandidateType }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/review/${data.candidateID}`);
  };
  return (
    <div className="flex items-center justify-center w-full">
      <Button variant={"columnIcon"} onClick={handleClick} size="icon">
        <ClipboardCopy className="text-secondary" />
      </Button>
    </div>
  );
};

export default DetailColumn;
