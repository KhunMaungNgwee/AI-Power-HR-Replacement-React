import { Pencil2Icon } from "@radix-ui/react-icons";
import { DialogForm } from "../chunks/Dialog";
import { Button } from "@/components/ui/button";
import { DepartmentRequestType } from "@/api/position/types";

const ManageColumn = ({ data }: { data: DepartmentRequestType }) => {
  return (
    <div>
      <DialogForm isEdit={true} data={data}>
        <Button variant={"columnIcon"}>
          <Pencil2Icon />
        </Button>
      </DialogForm>
    </div>
  );
};

export default ManageColumn;
