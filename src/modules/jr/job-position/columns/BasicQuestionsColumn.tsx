import { FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { BasicDialogTable } from "../chunks/BasicDialogTable";
import { useState } from "react";
import api from "@/api";

const BasicQuestionsColumn = ({ jobPositionID }: { jobPositionID: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isFetching } = api.jrPosition.getBasicQuestionsByID.useQuery(
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
      <BasicDialogTable
        data={data}
        isOpen={isOpen}
        handleOpenChange={handleOpenChange}
        isLoading={isFetching}
      >
        <></>
      </BasicDialogTable>
    </div>
  );
};

export default BasicQuestionsColumn;
