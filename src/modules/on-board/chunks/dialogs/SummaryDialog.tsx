import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import DocClipBoardIcon from "../icons/DocClipBoardIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InterviewSummeryType } from "@/api/on-board/types";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SetStateAction } from "react";
const formSchema = z.object({
  dateTimeSlot: z.date(),
});

export function SummaryDialog({
  data,
  recruiterStatus,
  onClose,
  setOpenScoreCheckDialog,
}: {
  data?: InterviewSummeryType | null | undefined;
  recruiterStatus: string;
  onClose: () => void;
  setOpenScoreCheckDialog: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTimeSlot: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateRecruiterStatusByCandidateID } =
    api.candidate.updateRecruiterStatusByCandidateID.useMutation({
      onSuccess: () => {
        toast({
          title: "Document Upload added successfully",
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["getAllOnboardCandidates"],
        });
      },
      onError: (error) => {
        console.error("Error adding Document Upload: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const onSubmit = () => {
    if (data) {
      updateRecruiterStatusByCandidateID(data?.candidateID);
    }
  };

  const handleScoreCheckDialog = () => {
    onClose();
    setOpenScoreCheckDialog(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1025px] max-h-[90%] text-xs">
        <DialogHeader className="border-b pb-4 border-b-gray-300">
          <DialogTitle className="text-2xl">
            {t("on-board.interview")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-x-2 border-b-2 border-b-[#9D0A0A] pb-6">
          <div className="col-span-4 flex flex-col gap-2">
            <div className="grid grid-cols-2 items-center min-h-[36px]">
              <span className="font-semibold">{t("on-board.division")}</span>
              <span className="text-gray-400">{data?.division}</span>
            </div>

            <div className="grid grid-cols-2 items-center">
              <span className="font-semibold">
                {t("on-board.approve-date")}
              </span>
              <span className="text-gray-400">
                {format(new Date(data?.approveDate || Date.now()), "h ':' m")} |{" "}
                {format(new Date(data?.approveDate || Date.now()), "P")}
              </span>
            </div>
          </div>
          <div className="col-span-5 flex flex-col gap-2">
            <div className="grid grid-cols-3 items-center">
              <span className="font-semibold col-span-1">
                {t("interview-rounds.candidate-name")}
              </span>
              <div className="flex gap-4 col-span-2 items-center">
                <span className="text-gray-400">{data?.candidateName}</span>
                <span className="flex gap-2">
                  <Link
                    to={`/candidate-information/${data?.candidateID}`}
                    state={{ from: "/on-board" }}
                  >
                    <Button variant={"columnIcon"} size="icon">
                      <DocClipBoardIcon />
                    </Button>
                  </Link>

                  <Button
                    variant={"columnIcon"}
                    size="icon"
                    onClick={handleScoreCheckDialog}
                  >
                    <DocReaderIcon width="21" height="23" />
                  </Button>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <span className="font-semibold col-span-1">
                {t("fields.f2f-interview-status")}
              </span>
              <span className={data?.f2FStatus !== null ? "text-success" : ""}>
                {data?.f2FStatus !== null ? data?.f2FStatus : "-"}
              </span>
            </div>
          </div>
          <div className="col-span-3 bg-[#F1FFFB] rounded-lg border flex flex-col justify-center px-4 py-4 border-gray-700">
            <div className="grid grid-cols-2 items-center gap-2">
              <span className="font-semibold col-span-1">
                {t("interview-rounds.score-total")}
              </span>
              <span className="text-gray-500 text-xl">
                {data?.score !== null ? data?.score : "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center">
              <span className="font-semibold col-span-1 text-[10px]">
                {t("interview-rounds.score-date")}
              </span>
              <span className="text-[10px] text-gray-600 col-span-2">
                {format(new Date(data?.scoreDate || Date.now()), "h ':' m")} |{" "}
                {format(new Date(data?.scoreDate || Date.now()), "P")}
              </span>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">
          {t("on-board.candidate-summary")}
        </h1>

        <Form {...form}>
          <form className="flex flex-col gap-4 border-b-2 border-b-[#9D0A0A] p-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="grid grid-cols-12 items-center gap-2">
                <label htmlFor="position" className="col-span-4">
                  {t("title.job-position")}
                </label>
                <Input
                  id="position"
                  className="col-span-8 bg-[#F6F7F9] text-xs"
                  defaultValue={data?.jobPosition}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-12 items-center">
                <label htmlFor="age" className="col-span-4">
                  {t("on-board.age")}
                </label>
                <Input
                  id="age"
                  className="col-span-8 bg-[#F6F7F9] text-xs"
                  defaultValue={data?.age}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="grid grid-cols-12 items-center gap-2">
                <label htmlFor="salary" className="col-span-4">
                  {t("on-board.salary")}
                </label>
                <Input
                  id="salary"
                  className="col-span-8 bg-[#F6F7F9] text-xs"
                  defaultValue={data?.salary}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-12 items-center">
                <label htmlFor="employmentDate" className="col-span-4">
                  {t("on-board.employment-date")}
                </label>
                <Input
                  id="employmentDate"
                  className="col-span-8 bg-[#F6F7F9] text-xs"
                  defaultValue={
                    data?.employmentDate &&
                    format(
                      new Date(data.employmentDate as string),
                      "d MMMM yyyy"
                    )
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <label htmlFor="otherDetails" className="col-span-2">
                {t("on-board.other-details")}
              </label>
              <Textarea
                id="otherDetails"
                className="col-span-10 bg-[#F6F7F9] text-xs h-[120px]"
                defaultValue={data?.otherDetails}
                readOnly
              />
            </div>
          </form>
        </Form>
        <div className="grid grid-cols-10">
          <div className="col-span-2"></div>
          <div className="flex justify-between col-span-8">
            <div className="flex gap-2 col-span-2">
              <span> {t("on-board.recruiter-interview")}:</span>
              <span className="text-gray-400">{data?.division}</span>
            </div>
            <div className="flex gap-4">
              {recruiterStatus === "Wait Confirm" ? (
                <>
                  <Button
                    className="w-28 text-sm border-secondary hover:border-secondary text-secondary hover:text-secondary"
                    variant={"outline"}
                    onClick={onSubmit}
                  >
                    Confirm
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="w-28 text-sm"
                      variant={"destructive"}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </>
              ) : (
                <DialogClose asChild>
                  <Button
                    className="w-28 text-sm"
                    variant={"destructive"}
                    onClick={onClose}
                  >
                    {t("common.back")}
                  </Button>
                </DialogClose>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
