import { Button } from "@/components/ui/button";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import { useContext } from "react";
import { CheckScoreDialogContext } from "../CheckDocumentsView";

const CheckScoreColumn = ({ candidateID }: { candidateID: string }) => {
  const checkScoreDialogState = useContext(CheckScoreDialogContext);

  const handleClick = () => {
    checkScoreDialogState?.setCandidateID(candidateID);
    checkScoreDialogState?.setOpen(true);
  };
  return (
    <Button variant="columnIcon" size={"icon"} onClick={handleClick}>
      <DocReaderIcon />
    </Button>
  );
};

export default CheckScoreColumn;
