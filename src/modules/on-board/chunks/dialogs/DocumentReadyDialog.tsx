import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import DocClipBoardIcon from "../icons/DocClipBoardIcon";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
  OnboardCandidateType,
  UpdateBackgroundCheck,
} from "@/api/candidate/types";
import { SetStateAction, useEffect, useState } from "react";
import api from "@/api";
import { CircleAlert, CircleCheck } from "lucide-react";
import { PDFViewer } from "@/components/viewers";
import { useNavigate } from "react-router-dom";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  backgroundCheck: z.boolean().optional(),
});

export function DocumentReadyDialog({
  data = null,
  children,
  setDialogOpen,
}: {
  data?: OnboardCandidateType | null;
  children: React.ReactNode;
  setDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: documentReadyData } =
    api.candidate.getDocumentReadyByCandidateID.useQuery(
      data?.candidateID as string,
      {
        queryKey: ["getDocumentReadyByCandidateID", data?.candidateID],
        enabled: open && !!data?.candidateID,
        staleTime: 0,
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundCheck: documentReadyData?.backgroundCheck || false,
    },
  });

  useEffect(() => {
    if (documentReadyData) {
      form.setValue("backgroundCheck", documentReadyData?.backgroundCheck);
    }
  }, [documentReadyData]);

  const { mutate: updateCandidateBackgroundCheck } =
    api.candidate.updateCandidateBackgroundCheck.useMutation({
      onMutate: () => openLoader(),
      onSuccess: () => {
        toast({
          title: "Updated Background Check successfully",
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getDocumentReadyByCandidateID"],
        });

        setOpen(false);
      },
      onSettled: () => hideLoader(),
      onError: (error) => {
        console.error("Error updating approve status: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const handleCandidateDetails = () => {
    navigate(`/candidate-information/${data?.candidateID}`, {
      state: { from: "/on-board" },
    });
  };

  const handleScoreDialog = () => {
    setOpen(false);
    setDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload: UpdateBackgroundCheck = {
      candidateID: documentReadyData?.candidateID as string,
      backgroundCheck: values.backgroundCheck as boolean,
    };
    updateCandidateBackgroundCheck(payload);
  };

  function getFileType(url: string): string | undefined {
    const extension = url.split(".").pop()?.toLowerCase();

    const fileTypes: Record<string, string> = {
      pdf: "application/pdf",
      mp4: "video/mp4",
      jpeg: "image/jpeg",
      jpg: "image/jpg",
      png: "image/png",
    };

    return extension ? fileTypes[extension] : undefined;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] h-[800px] max-h-[90%] text-xs flex flex-col">
        <DialogHeader className="border-b pb-4 border-b-gray-300 h-fit">
          <DialogTitle className="text-2xl">
            {t("on-board.interview")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {show ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-4">
            {["image/jpeg", "image/png", "image/jpg"].includes(
              getFileType(show) || ""
            ) ? (
              <img src={show} className="object-contain w-full h-full" />
            ) : getFileType(show) === "application/pdf" ? (
              <div className="flex items-center justify-center overflow-y-auto p-2">
                <PDFViewer
                  rotatePoint={0}
                  isScanning={false}
                  className="h-full w-full"
                  pdfLink={show}
                  textLayer={true}
                />
              </div>
            ) : null}
            <Button
              type="button"
              onClick={() => setShow("")}
              className="mt-auto"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-x-2 border-b-2 border-b-[#9D0A0A] pb-6 h-fit">
              <div className="col-span-4 flex flex-col gap-2">
                <div className="grid grid-cols-2 items-center min-h-[36px]">
                  <span className="font-semibold">
                    {t("on-board.division")}
                  </span>
                  <span className="text-gray-400">
                    {documentReadyData && documentReadyData?.division}
                  </span>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <span className="font-semibold">
                    {t("on-board.approve-date")}
                  </span>
                  <span className="text-gray-400">
                    {format(
                      new Date(
                        (documentReadyData && documentReadyData.createdAt) ||
                          Date.now()
                      ),
                      "h ':' m"
                    )}{" "}
                    |{" "}
                    {format(
                      new Date(
                        (documentReadyData && documentReadyData.createdAt) ||
                          Date.now()
                      ),
                      "P"
                    )}
                  </span>
                </div>
              </div>
              <div className="col-span-5 flex flex-col gap-2">
                <div className="grid grid-cols-3 items-center w-full">
                  <span className="font-semibold col-span-1">
                    {t("interview-rounds.candidate-name")}
                  </span>
                  <div className="flex gap-4 col-span-2 items-center">
                    <span className="text-gray-400">
                      {documentReadyData?.candidateName}
                    </span>
                    <span className="flex gap-2">
                      <Button
                        type="button"
                        variant={"columnIcon"}
                        size="icon"
                        onClick={handleCandidateDetails}
                      >
                        <DocClipBoardIcon />
                      </Button>
                      <Button
                        type="button"
                        variant={"columnIcon"}
                        size="icon"
                        onClick={handleScoreDialog}
                      >
                        <DocReaderIcon width="21" height="23" />
                      </Button>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center w-full">
                  <span className="font-semibold col-span-1">
                    {t("fields.f2f-interview-status")}
                  </span>
                  {!documentReadyData?.f2FStatus && (
                    <div className="flex col-span-2 items-center gap-2">
                      <CircleAlert
                        fill="#EE9923"
                        className="inline-block text-white"
                      />
                      <span className="text-gray-500 text-nowrap">
                        {t("common.waiting-for-candidate")}
                      </span>
                    </div>
                  )}
                  {documentReadyData?.f2FStatus && (
                    <div>
                      <CircleCheck
                        fill="#00AC4F"
                        className="inline-block text-white"
                      />{" "}
                      <span className="text-gray-500 text-nowrap">
                        {t("common.completed")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-3 bg-[#F1FFFB] rounded-lg border flex flex-col justify-center px-4 py-4 border-gray-700 h-fit">
                <div className="grid grid-cols-2 items-center gap-2">
                  <span className="font-semibold col-span-1">
                    {t("interview-rounds.score-total")}
                  </span>
                  <span className="text-gray-500 text-xl">
                    {documentReadyData?.score || "-"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="font-semibold col-span-1 text-[10px]">
                    {t("interview-rounds.score-date")}
                  </span>
                  <span className="text-[10px] text-gray-600 col-span-2">
                    {documentReadyData?.scoreDate
                      ? format(
                          new Date(documentReadyData?.scoreDate),
                          "h ':' m"
                        )
                      : "-"}{" "}
                    |{" "}
                    {documentReadyData?.scoreDate
                      ? format(new Date(documentReadyData?.scoreDate), "P")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-xl font-semibold">
              {t("fields.document-lists")}
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 flex flex-col"
              >
                <div className="flex flex-col border-b-2 border-b-[#9D0A0A] px-8 pb-8 flex-1">
                  <div className="grid grid-cols-3 px-8 pb-8 gap-2">
                    {!documentReadyData && (
                      <>
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                      </>
                    )}

                    {documentReadyData?.otherDocumentUrls.map((item, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <Button
                          type="button"
                          variant={"columnIcon"}
                          size={"icon"}
                          onClick={() => setShow(item.docUrl)}
                        >
                          <MagnifyingGlassIcon />
                        </Button>
                        <span>{item.docName}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-auto">
                    <FormField
                      name="backgroundCheck"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                id="backgroundCheck"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="backgroundCheck"
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("fields.background-check")}
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-10 py-4">
                  <div className="col-span-2"></div>
                  <div className="flex justify-between items-center col-span-8">
                    <div className="flex gap-2 col-span-2 text-sm">
                      <span> {t("on-board.recruiter-interview")}:</span>
                      <span className="text-gray-400">
                        {documentReadyData?.division}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {!data?.f2FStatus ? (
                        <>
                          <DialogClose asChild>
                            <Button
                              // onClick={handleClick}
                              type="button"
                              className="w-28 text-sm"
                              variant={"outline"}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            className="w-28 text-sm"
                            variant={"destructive"}
                          >
                            Confirm
                          </Button>
                        </>
                      ) : (
                        <DialogClose asChild>
                          <Button
                            className="w-28 text-sm"
                            variant={"destructive"}
                          >
                            Back
                          </Button>
                        </DialogClose>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
