import { Button } from "@/components/ui/button";
import { CandidateType } from "@/shared/types";
import { MessageSquareText } from "lucide-react";
import { InterviewCommentDialog } from "../Dialogs/InterviewCommentDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { t } from "i18next";

const CommentColumn = ({ data }: { data: CandidateType }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments, isFetching: commentFetching } =
    api.candidate.getCommentByCandidate.useQuery(data.candidateID, {
      queryKey: ["getCommentByCandidate", data.candidateID],
      enabled: shouldFetch,
    });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setShouldFetch(true);
    }

    queryClient
      .prefetchQuery({ queryKey: ["getCommentByCandidate"] })
      .then(() => {
        setIsOpen(open);
      });
  };
  return (
    <div className="flex items-center justify-center w-full">
      <TooltipProvider>
        <Tooltip>
          <InterviewCommentDialog
            data={data}
            isEdit={false}
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
            comments={comments}
            commentFetching={commentFetching}
          >
            <TooltipTrigger asChild>
              <Button
                variant={"columnIcon"}
                size="icon"
                onClick={() => handleOpenChange(true)}
              >
                <MessageSquareText className="text-secondary" />
              </Button>
            </TooltipTrigger>
          </InterviewCommentDialog>
          <TooltipContent>
            <p>{t(`common.view-recruiter-comments`)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CommentColumn;
