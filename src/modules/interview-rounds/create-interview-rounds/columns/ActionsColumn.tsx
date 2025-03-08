import { InterviewRoundType } from "@/api/interview/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { t } from "i18next";
import { PencilIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import InterviewRoundFormDialog from "../dialogs/InterviewRoundFormDialog";

type ActionsColumnType = {
  interviewID: string;
  data: InterviewRoundType;
};

const ActionsColumn = ({ interviewID, data }: ActionsColumnType) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-center gap-px">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`/pool/create-interview-round/view-details/${interviewID}`}
              state={{
                from: "/pool/create-interview-round",
                departmentName: data.departmentRequestName,
              }}
            >
              <Button variant="columnIcon" size="icon">
                <SearchIcon className="w-4 h-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${t("title.view")} '${data.departmentRequestName}'`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <InterviewRoundFormDialog
            isEdit={true}
            editData={data}
            open={dialogOpen}
            setOpen={setDialogOpen}
          >
            <TooltipTrigger asChild>
              <Button
                variant="columnIcon"
                size="icon"
                onClick={() => setDialogOpen(true)}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
          </InterviewRoundFormDialog>
          <TooltipContent>
            <p>{t("common.edit-detail")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionsColumn;
