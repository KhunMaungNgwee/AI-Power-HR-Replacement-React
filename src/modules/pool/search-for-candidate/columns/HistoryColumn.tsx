import { Button } from "@/components/ui/button";
import { CandidateType } from "@/shared/types";
import { History } from "lucide-react";
import { HistoryDialog } from "../Dialogs/HistoryDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api";

const HistoryColumn = ({ data }: { data: CandidateType }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const queryClient = useQueryClient();

  const { data: candidateHistory, isFetching: candidateHistoryFetching } =
    api.candidate.getCandidateHistory.useQuery(data.candidateID, {
      queryKey: ["getCandidateHistory", data.candidateID],
      enabled: shouldFetch,
    });

  const { data: crcHistory, isFetching: crcHistoryFetching } =
    api.interview.getInterviewHistoryByCandidateID.useQuery(data.candidateID, {
      queryKey: ["getInterviewHistoryByCandidateID", data.candidateID],
      enabled: shouldFetch,
    });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setShouldFetch(true);
    }

    queryClient
      .prefetchQuery({ queryKey: ["getCandidateHistory", "getInterviewHistoryByCandidateID"] })
      .then(() => {
        
            setIsOpen(open);
      });
  };

  return (
    <div className="flex items-center justify-center w-full">
      <HistoryDialog
        data={data}
        isOpen={isOpen}
        handleOpenChange={handleOpenChange}
		candidateHistory = {candidateHistory}
		candidateHistoryFetching = {candidateHistoryFetching}
		crcHistory = {crcHistory}
		crcHistoryFetching = {crcHistoryFetching}
      >
        <Button
          variant={"columnIcon"}
          size="icon"
          onClick={() => handleOpenChange(true)}
        >
          <History className="text-secondary" />
        </Button>
      </HistoryDialog>
    </div>
  );
};

export default HistoryColumn;
