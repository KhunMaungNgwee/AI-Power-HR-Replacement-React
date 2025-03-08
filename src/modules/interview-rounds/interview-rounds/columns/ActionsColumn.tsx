import api from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type ActionsColumnType = {
  interviewID: string;
  peopleCount: number;
};

const ActionsColumn = ({ interviewID, peopleCount }: ActionsColumnType) => {
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: addOnBoardCandidate } =
    api.interview.createOnBoardingCandidate.useMutation({
      onMutate: () => dispatch(openLoader()),
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllInterviewRoundApproved"],
        });
        navigate("/on-board");
        toast({
          variant: "success",
          title: t("success-title.add"),
          description: t("success-msg.add"),
        });

        setTimeout(() => setOpenDialog(false), 100);
      },
      onError: (error: Error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: t("error-title.add"),
          description: t("error-msg.add"),
        });
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOnBoardCandidate(interviewID);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="min-w-[140px]">
            {t("common.submit")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("dialog-title.are-you-sure")}</DialogTitle>
            <DialogDescription>
              {t("dialog-desc.add-person-to-onboard").replace(
                "[[Number]]",
                peopleCount.toString()
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 px-6">
            <Button
              type="submit"
              variant="secondaryOutline"
              onClick={(e) => handleSubmit(e)}
            >
              {t("common.confirm")}
            </Button>
            <DialogClose asChild>
              <Button>{t("common.cancel")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionsColumn;
