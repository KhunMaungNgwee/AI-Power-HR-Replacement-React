import { useState } from "react";
import { Button } from "@/components/ui/button";
import ListIcon from "../chunks/icons/ListIcon";
import { SummaryDialog } from "../chunks/dialogs/SummaryDialog";
import api from "@/api";
import ScoreColumn from "@/modules/interview-rounds/view-details/chunks/ScoreColumn";

const SummaryColumn = ({
  candidateID,
  recruiterStatus,
  column,
}: {
  candidateID: string;
  recruiterStatus: string;
  column?: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [openScoreCheckDialog, setOpenScoreCheckDialog] =
    useState<boolean>(false);

  const { data, isFetching } = api.onBoard.getInterviewSummeryByID.useQuery(
    candidateID,
    {
      enabled: isDialogOpen,
    }
  );

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-center w-full">
        {column === "summary" ? (
          <Button
            variant="columnIcon"
            onClick={handleClick}
            size="icon"
            disabled={recruiterStatus === "Confirm"}
          >
            <ListIcon
              className={`${
                recruiterStatus === "Confirm" ? "#979797" : "#006192"
              }`}
            />
          </Button>
        ) : (
          <Button
            variant="link"
            onClick={handleClick}
            size="icon"
            className={`${
              recruiterStatus === "Confirm"
                ? "text-secondary"
                : "text-[#292D32]"
            }`}
            disabled={recruiterStatus !== "Confirm"}
          >
            {recruiterStatus === "Confirm" ? "Confirm" : "Wait Confirm"}
          </Button>
        )}

        {isDialogOpen && !isFetching && (
          <SummaryDialog
            data={data}
            recruiterStatus={recruiterStatus}
            onClose={handleDialogClose}
            setOpenScoreCheckDialog={setOpenScoreCheckDialog}
          ></SummaryDialog>
        )}

        <ScoreColumn
          candidateID={data?.candidateID}
          open={openScoreCheckDialog}
          setOpen={setOpenScoreCheckDialog}
          useF2FInterview={false}
        >
          <></>
        </ScoreColumn>
      </div>
    </>
  );
};

export default SummaryColumn;
