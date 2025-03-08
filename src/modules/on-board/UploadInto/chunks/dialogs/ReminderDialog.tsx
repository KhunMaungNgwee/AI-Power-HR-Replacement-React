import { UploadDocType } from "@/api/upload-into/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";

type ReminderDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: UploadDocType[] | undefined;
};

export function ReminderDialog({
  isOpen,
  setIsOpen,
  data,
}: ReminderDialogProps) {
  const filteredItems = data?.filter((item) => {
    return (
      !item.dueDate ||
      new Date(item.dueDate) > new Date() ||
      item.approveDate === null
    );
  });

  const documentTypes = filteredItems
    ?.map((item) => item.documentType)
    .filter((type) => type)
    .join(", ");

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("common.remind")}
            <span className="text-xl text-[#EE3223]">!</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-black mt-4">
            {t("common.reminder-desc")} {documentTypes}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full flex justify-center mt-2">
            <Button
              variant="outline"
              className="text-secondary hover:border-secondary border-secondary min-w-40"
              onClick={() => setIsOpen(false)}
            >
              {t("common.ok")}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
