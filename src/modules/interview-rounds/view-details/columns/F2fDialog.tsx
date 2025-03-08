import { Button } from "@/components/ui/button";

import { Calendar } from "lucide-react";
import { DialogForm } from "../chunks/Dialog";
import api from "@/api";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ActionsColumnType = {
  data: string;
};

const F2fDialog = ({ data }: ActionsColumnType) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: F2FSlotData } =
    api.f2fSlot.getF2FSlotByCandidateID.useQuery(data);

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  const handleClick = () => {
    if (F2FSlotData) {
      setOpen(true);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <DialogForm data={F2FSlotData} open={open} setOpen={handleOpen}>
        <Button variant="columnIcon" size="icon" onClick={handleClick}>
          <Calendar
            className={cn(
              "w-4 h-4",
              F2FSlotData ? "text-secondary" : "text-muted-foreground"
            )}
          />
        </Button>
      </DialogForm>
    </div>
  );
};

export default F2fDialog;
