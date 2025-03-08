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
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type DeleteDialogType = {
  candidateID: string;
  children: React.ReactNode;
};

const DeleteDialog = ({ candidateID, children }: DeleteDialogType) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: deleteCandidateByID } =
    api.candidate.deleteCandidateByID.useMutation(candidateID, {
      onMutate: () => dispatch(openLoader()),
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllInterviewRound"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getCandidateByInterviewID"],
        });

        toast({
          variant: "success",
          title: t("success-title.delete"),
          description: t("success-msg.delete-candidate"),
        });

        setIsOpen(false);
      },
      onError: (error: Error) => {
        console.error(error);

        toast({
          variant: "destructive",
          title: t("error-title.delete"),
          description: t("error-msg.delete-candidate"),
        });
      },
    });

  const handleDelete = () => {
    deleteCandidateByID(candidateID);
  };
  return (
    <div className="flex items-center justify-center w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("dialog-title.are-you-sure")}</DialogTitle>
            <DialogDescription>
              {t("dialog-desc.delete-this-candidate")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 px-6">
            <Button
              type="button"
              variant="secondaryOutline"
              onClick={handleDelete}
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

export default DeleteDialog;
