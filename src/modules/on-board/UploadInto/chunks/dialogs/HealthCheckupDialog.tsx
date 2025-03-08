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
import { CandidateDetailsType } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import { Input } from "@/components/ui/input";
import DocClipBoardIcon from "@/modules/on-board/chunks/icons/DocClipBoardIcon";
import { CheckCircle2Icon, CircleAlert } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import {
  AddHealthCheckupPayloadType,
  UploadDocType,
  UploadIntoType,
} from "@/api/upload-into/types";
import FileUploadDialog from "@/components/dialogs/FileUploadDialog";
import { Link } from "react-router-dom";
import { PDFViewer } from "@/components/viewers";

const formSchema = z.object({
  documentUrl: z.string().min(1, { message: "Document is required" }),
  hospitalName: z.string().min(1, { message: "Hospital Name is required" }),
  hospitalLocation: z
    .string()
    .min(1, { message: "Hospital location is required" }),
  hospitalType: z.boolean(),
  note: z.string(),
  comment: z.string(),
});

export function HealthCheckUpDialog({
  data = null,
  uploadDocTypeData,
  uploadIntoData,
  children,
  isOpen,
  setIsOpen,
  setOpenScoreCheck,
}: {
  data?: CandidateDetailsType | null;
  uploadDocTypeData: UploadDocType;
  uploadIntoData: UploadIntoType;
  isOpen?: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  setOpenScoreCheck: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: healthCheckUpData } =
    api.uploadInto.getHealthCheckupByCandidateId.useQuery(data?.candidateID, {
      queryKey: ["getHealthCheckupByCandidateId"],
      enabled: !!data?.candidateID,
      staleTime: 0,
    });
  const [file, setFile] = useState<string | undefined>(
    healthCheckUpData?.documentUrl
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentUrl: healthCheckUpData?.documentUrl || "",
      hospitalName: healthCheckUpData?.hospitalName || "",
      hospitalLocation: healthCheckUpData?.hospitalLocation || "",
      hospitalType: healthCheckUpData?.hospitalType || false,
      note: healthCheckUpData?.note || "",
      comment: healthCheckUpData?.comment || "",
    },
    mode: "onChange",
  });

  function getFileType(url: string): string | undefined {
    const extension = url.split(".").pop()?.toLowerCase();

    const fileTypes: Record<string, string> = {
      pdf: "application/pdf",
      mp4: "video/mp4",
      jpeg: "image/jpeg",
      png: "image/png",
    };

    return extension ? fileTypes[extension] : undefined;
  }

  useEffect(() => {
    form.reset({
      documentUrl: "",
      hospitalName: "",
      hospitalLocation: "",
      hospitalType: true,
      note: "",
      comment: "",
    });

    setFile("");

    if (healthCheckUpData) {
      form.reset({
        documentUrl: healthCheckUpData?.documentUrl || "",
        hospitalName: healthCheckUpData?.hospitalName || "",
        hospitalLocation: healthCheckUpData?.hospitalLocation || "",
        hospitalType: healthCheckUpData?.hospitalType || true,
        note: healthCheckUpData?.note || "",
        comment: healthCheckUpData?.comment || "",
      });

      setFile(healthCheckUpData?.documentUrl);

      return;
    }
  }, [data, form, isOpen]);

  const { mutate: addHealthCheckup } =
    api.uploadInto.addHealthCheckup.useMutation({
      onSuccess: () => {
        toast({
          title: "Health checkup added successfully",
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getHealthCheckupByCandidateId"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error adding health checkup: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: approvedHealthCheckUp } =
    api.uploadInto.approvedHealthCheckUp.useMutation({
      onSuccess: () => {
        toast({
          title: "Health checkup Approved successfully",
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getHealthCheckupByCandidateId"],
        });

        queryClient.invalidateQueries({
          queryKey: ["getUploadIntoById"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error updating health checkup contract: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const handleUpload = (url: string) => {
    setFile(url);
    form.setValue("documentUrl", url, { shouldValidate: true });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (healthCheckUpData) {
      approvedHealthCheckUp(healthCheckUpData.healthCheckupID);
    } else {
      const payload: AddHealthCheckupPayloadType = {
        ...values,
        uploadIntoID: uploadIntoData.uploadIntoID,
        candidateID: data?.candidateID as string,
        commentedMemberID: "00000000-0000-0000-0000-000000000000", //set default guid for no
      };

      addHealthCheckup(payload);
    }
  };

  const handleScoreCheck = () => {
    setIsOpen(false);
    setOpenScoreCheck(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] max-h-[90%] text-xs">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("fields.health-checkup")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-x-2 border-b">
          <div className="col-span-5 flex items-center gap-4">
            <div>
              <Link
                to={`/candidate-information/${data?.candidateID}`}
                state={{ from: "/upload-into/" }}
              >
                <Button variant={"columnIcon"} size="icon">
                  <DocClipBoardIcon />
                </Button>
              </Link>

              <Button
                variant={"columnIcon"}
                size="icon"
                onClick={handleScoreCheck}
              >
                <DocReaderIcon width="21" height="23" />
              </Button>
            </div>
            <span className="font-semibold col-span-1">
              {t("interview-rounds.candidate-name")}
            </span>
            <div className="flex gap-5 col-span-2 items-center">
              <span className="text-gray-400">
                {data?.firstname + " " + data?.lastname}
              </span>
            </div>
          </div>

          {uploadDocTypeData?.approveDate && (
            <div className="col-span-4 flex items-center gap-2">
              <span className="font-semibold">
                {t("on-board.approve-date")}
              </span>
              <span className="text-gray-400">
                {format(new Date(uploadDocTypeData?.approveDate), "h ':' m")} |{" "}
                {format(new Date(uploadDocTypeData?.approveDate), "P")}
              </span>
            </div>
          )}

          <div className="col-start-10 col-span-3 flex items-center gap-2">
            {uploadDocTypeData?.status === "Waiting for Candidate" ? (
              <>
                <CircleAlert fill="#EE9923" color="white" />
                <span className="text-warning">
                  {t("common.waiting-for-candidate")}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2Icon fill="#00AC4F" color="white" />
                <span className="text-success">{t("common.completed")}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 items-center">
          <h1 className="text-xl font-semibold">
            {t("fields.health-checkup")}
          </h1>
          <div className="flex justify-between items-center">
            <span>{t("fields.due-date")}</span>
            <span className="border rounded-lg w-[240px] px-4 py-3 bg-gray-50 text-gray-500">
              {format(
                new Date(uploadDocTypeData?.dueDate || Date.now()),
                "h ':' m"
              )}{" "}
              |{" "}
              {format(new Date(uploadDocTypeData?.dueDate || Date.now()), "P")}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 border-b-2 py-8 border-b-[#9D0A0A]">
              <h3 className="text-sm font-semibold">
                {t("fields.hospital-checkup")}
              </h3>
              <div className="flex gap-2 items-center">
                <label htmlFor="documentUpload" className="text-nowrap">
                  {t("fields.document-upload")}
                </label>
                <FormField
                  control={form.control}
                  name="documentUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        <div className="flex w-full">
                          <Input
                            value={file}
                            type="text"
                            id="documentUpload"
                            readOnly
                            className="col-span-8 text-xs rounded-r-none rounded-l-full"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }}
                          />
                          <FileUploadDialog onFileUpload={handleUpload}>
                            <Button
                              className="rounded-r-full bg-gray-400 hover:bg-gray-400 text-xs"
                              disabled={
                                healthCheckUpData?.status === "Completed" ||
                                healthCheckUpData !== null
                              }
                            >
                              {t("common.upload-file")}
                            </Button>
                          </FileUploadDialog>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-5 gap-4 h-fit">
                <label htmlFor="hospitalName" className="col-span-2">
                  {t("fields.hospital-name")}
                </label>
                <FormField
                  control={form.control}
                  name="hospitalName"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          id="hospitalName"
                          className="bg-[#F6F7F9] text-xs text-gray-400"
                          readOnly={
                            healthCheckUpData?.status === "Completed" ||
                            healthCheckUpData !== null
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <label htmlFor="hospitalLocation" className="col-span-2">
                  {t("fields.hospital-location")}
                </label>
                <FormField
                  control={form.control}
                  name="hospitalLocation"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          id="hospitalLocation"
                          className="bg-[#F6F7F9] text-xs text-gray-400"
                          readOnly={
                            healthCheckUpData?.status === "Completed" ||
                            healthCheckUpData !== null
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <label htmlFor="hospitalType" className="col-span-2">
                  {t("fields.hospital-type")}
                </label>

                <FormField
                  control={form.control}
                  name="hospitalType"
                  render={({ field }) => (
                    <FormItem className=" col-span-3">
                      <FormControl>
                        <RadioGroup
                          value={field.value ? "true" : "false"} // Convert boolean to string for RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          } // Convert string to boolean for Zod
                          className="flex flex-wrap gap-2"
                          disabled={
                            healthCheckUpData?.status === "Completed" ||
                            healthCheckUpData !== null
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={"true"} id="r1" />
                            <Label htmlFor="r1" className="text-nowrap text-xs">
                              {t("fields.hospital-under-crc")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="r2" />
                            <Label htmlFor="r2" className="text-nowrap text-xs">
                              {t("fields.hospital-outside-crc")}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <label htmlFor="note" className="col-span-2">
                  {t("fields.note")}
                </label>

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Textarea
                          id="note"
                          className="bg-[#F6F7F9] text-xs text-gray-400 h-[150px]"
                          readOnly={
                            healthCheckUpData?.status === "Completed" ||
                            healthCheckUpData !== null
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 bg-gray-300 h-[260px]">
                  {file && getFileType(file) === "application/pdf" ? (
                    <PDFViewer
                      pdfLink={file}
                      rotatePoint={0}
                      className="object-contain max-h-[260px] overflow-y-auto"
                    />
                  ) : (
                    file &&
                    (file?.endsWith(".png") ||
                      file?.endsWith(".jpg") ||
                      file?.endsWith(".jpeg")) && (
                      <img
                        src={file}
                        className="object-contain w-full h-full"
                        alt="Uploaded file preview"
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between items-center text-gray-500 my-8">
                  <span className="flex-1">{t("fields.date-update")}</span>
                  <span className="flex-1">
                    {format(new Date(data?.createdAt || Date.now()), "h ':' m")}{" "}
                    | {format(new Date(data?.createdAt || Date.now()), "P")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4">
              <span className="font-semibold col-span-1">
                {t("fields.recruiter-interview")} :
              </span>
              <div className="flex gap-5 col-span-2 items-center">
                <span className="text-gray-400">
                  {uploadIntoData.recruiterName}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="grid grid-cols-3 gap-2 col-span-6 items-center">
                <label
                  htmlFor="comment"
                  className="col-span-1 text-black font-semibold"
                >
                  {t("fields.comment")} :
                </label>
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          id="comment"
                          className="bg-[#F6F7F9] text-xs text-gray-400 col-span-2"
                          readOnly={
                            healthCheckUpData?.status === "Completed" ||
                            healthCheckUpData !== null
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 col-span-6 justify-end">
                {!uploadDocTypeData?.approveDate && (
                  <Button
                    type="submit"
                    className="min-w-28 text-xs border-secondary hover:border-secondary text-secondary hover:text-secondary"
                    variant={"outline"}
                  >
                    {healthCheckUpData
                      ? t("common.approve")
                      : t("common.send-instruction")}
                  </Button>
                )}
                <DialogClose asChild>
                  <Button className="w-28 text-xs" variant={"destructive"}>
                    {uploadDocTypeData?.approveDate
                      ? t("common.back")
                      : t("common.cancel")}
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
