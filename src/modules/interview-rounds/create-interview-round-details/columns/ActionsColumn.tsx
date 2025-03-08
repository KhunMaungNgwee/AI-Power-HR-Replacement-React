import { Button } from "@/components/ui/button";
import ClipCopyIcon from "@/modules/pool/check-documents/chunks/icons/ClipCopyIcon.";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../chunks/DeleteDialog";

const ActionsColumn = ({ candidateID }: { candidateID: string }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/candidate-information/${candidateID}`);
  };
  return (
    <div className="flex gap-2">
      <DeleteDialog candidateID={candidateID}>
        <Button variant="columnIcon" size={"icon"}>
          <Trash2 color="red" />
        </Button>
      </DeleteDialog>
      <Button variant="columnIcon" size={"icon"} onClick={handleClick}>
        <ClipCopyIcon />
      </Button>
    </div>
  );
};

export default ActionsColumn;
