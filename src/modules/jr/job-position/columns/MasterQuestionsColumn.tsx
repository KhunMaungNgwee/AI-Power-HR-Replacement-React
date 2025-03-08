import { FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { MasterDialogTable } from "../chunks/MasterDialogTable";
import { useState } from "react";
import api from "@/api";

const MasterQuestionsColumn = ({
  jobPositionID,
}: {
  jobPositionID: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isFetching } = api.jrPosition.getMasterQuestionsByID.useQuery(
    jobPositionID,
    { enabled: isOpen }
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <div>
      <Button variant="columnIcon" onClick={() => handleOpenChange(true)}>
        <FileTextIcon />
      </Button>
      <MasterDialogTable
        isOpen={isOpen}
        handleOpenChange={handleOpenChange}
        data={data}
        isLoading={isFetching}
      >
        <></>
      </MasterDialogTable>
    </div>
  );
};

export default MasterQuestionsColumn;
