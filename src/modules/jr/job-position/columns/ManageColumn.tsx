import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { JobPositionType } from "@/api/position/types";
import { useContext } from "react";
import { JobPositionContext } from "../JobPositionView";
const ManageColumn = ({ data }: { data: JobPositionType }) => {
  const editDialogState = useContext(JobPositionContext);
  const handleClick = () => {
    editDialogState?.action({ data, isEdit: true });
  };
  return (
    <div>
      <Button onClick={handleClick} type="button" variant={"columnIcon"}>
        <Pencil2Icon />
      </Button>
    </div>
  );
};

export default ManageColumn;
