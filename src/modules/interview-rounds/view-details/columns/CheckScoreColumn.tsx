import { Button } from "@/components/ui/button";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import { useState } from "react";
import ScoreColumn from "../chunks/ScoreColumn";

const CheckScoreColumn = ({ candidateID }: { candidateID: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button variant="columnIcon" size={"icon"} onClick={() => setOpen(true)}>
        <DocReaderIcon />
      </Button>
      <ScoreColumn candidateID={candidateID} open={open} setOpen={setOpen}>
        <></>
      </ScoreColumn>
    </>
  );
};

export default CheckScoreColumn;
