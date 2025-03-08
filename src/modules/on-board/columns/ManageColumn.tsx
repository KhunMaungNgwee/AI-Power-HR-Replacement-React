import { Button } from "@/components/ui/button";
import { DocumentReadyDialog } from "../chunks/dialogs/DocumentReadyDialog";
import { useState } from "react";
import ScoreColumn from "@/modules/interview-rounds/view-details/chunks/ScoreColumn";
import { OnboardCandidateType } from "@/api/candidate/types";
import { t } from "i18next";

const ManageColumn = ({ data }: { data: OnboardCandidateType }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-center w-full">
      <DocumentReadyDialog data={data} setDialogOpen={setOpen}>
        <Button
          variant={"secondary"}
          className={
            data.uploadIntoStatus === "Document progress" ? "bg-muted" : ""
          }
          disabled={data.uploadIntoStatus === "Document progress"}
        >
          {t("common.submit")}
        </Button>
      </DocumentReadyDialog>
      <ScoreColumn
        candidateID={data?.candidateID}
        open={open}
        setOpen={setOpen}
        useF2FInterview={false}
      >
        <></>
      </ScoreColumn>
    </div>
  );
};

export default ManageColumn;
