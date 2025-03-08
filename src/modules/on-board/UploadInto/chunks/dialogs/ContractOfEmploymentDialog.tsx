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
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import { Input } from "@/components/ui/input";
import DocClipBoardIcon from "@/modules/on-board/chunks/icons/DocClipBoardIcon";
import { CalendarIcon, CircleAlert, CircleCheck } from "lucide-react";
import FileUploadDialog from "@/components/dialogs/FileUploadDialog";
import { SetStateAction, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CandidateDetailsType } from "@/shared/types";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AddContractOfEmploymentType,
  UploadDocType,
  UploadIntoType,
} from "@/api/upload-into/types";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { PDFViewer } from "@/components/viewers";

const formSchema = z.object({
  documentUrl: z.string(),
  contactNumber: z
    .string({ required_error: t("error-msg.required") })
    .regex(/^\+?\d{10,}$/, { message: t("error-msg.required") }),
  salary: z
    .preprocess((value) => {
      // If the value is a string and not empty, attempt to parse it as a number
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseFloat(value);
        // If it's an invalid number, return NaN
        if (isNaN(parsed)) {
          return NaN; // NaN will be caught by Zod validation
        }
        return parsed; // Return the valid parsed number
      }
      // If the value is not a string or is empty, return undefined
      return value === "" || value === undefined ? undefined : value;
    }, z.number({ invalid_type_error: "Salary must be a number" }))
    .refine((val) => val >= 0, {
      message: "Salary must be a positive number",
    }),

  email: z.string().email(),

  workStartDate: z.string().min(1, { message: t("error-msg.required") }),

  comment: z.string().min(1, { message: t("error-msg.required") }),
});

export function ContractOfEmploymentDialog({
  candidate = null,
  isOpen,
  setIsOpen,
  setOpenScoreCheck,
  children,
  uploadDocTypeData,
  uploadIntoData,
}: {
  candidate?: CandidateDetailsType | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  setOpenScoreCheck: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  uploadDocTypeData: UploadDocType;
  uploadIntoData: UploadIntoType;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data } = api.uploadInto.getContractOfEmploymentByCandidateId.useQuery(
    candidate?.candidateID,
    {
      queryKey: ["getContractOfEmploymentByCandidateId"],
      enabled: !!candidate?.candidateID, // Only fetch when candidateID is truthy
    }
  );
  const [file, setFile] = useState<string | undefined>(data?.documentUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workStartDate: data?.workStartDate
        ? data?.workStartDate
        : new Date().toISOString(),
      contactNumber: data?.contactNumber || "",
      salary: data?.salary || undefined,
      email: data?.email || "",
      comment: data?.comment || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        workStartDate: data?.workStartDate
          ? data.workStartDate
          : new Date().toISOString(),
        contactNumber: data.contactNumber || "",
        salary: data.salary || undefined,
        email: data.email || "",
        documentUrl: file,
        comment: data.comment || "",
      });

      setFile(data.documentUrl);

      return;
    }

    form.reset({
      workStartDate: "",
      contactNumber: "",
      salary: undefined,
      email: "",
      documentUrl: undefined,
      comment: "",
    });

    setFile(undefined);
  }, [data, form, isOpen]);

  const { mutate: addEmploymentContract } =
    api.uploadInto.addContractOfEmploymentById.useMutation({
      onSuccess: () => {
        toast({
          title: "Employment contract added successfully",
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getUploadIntoById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getContractOfEmploymentByCandidateId"],
        });
      },
      onError: (error) => {
        console.error("Error adding employment contract: ", error);

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
    const payload: AddContractOfEmploymentType = {
      ...values,
      uploadIntoID: uploadDocTypeData.uploadIntoID,
      dueDate: uploadDocTypeData.dueDate,
      workStartDate: values.workStartDate,
      candidateID: candidate?.candidateID as string,
      commentedMemberID: uploadIntoData.recruiterID, //set default guid for no
    };
    addEmploymentContract(payload);
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(false);
    setOpenScoreCheck(true);
  };
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-[90%] text-xs">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("fields.contract-of-employment")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-x-2 border-b">
          <div className="col-span-5 flex items-center gap-4">
            <div>
              <Link
                to={`/candidate-information/${candidate?.candidateID}`}
                state={{ from: "/pool/check-documents" }}
                className="text-center"
              >
                <Button variant={"columnIcon"} size="icon">
                  <DocClipBoardIcon />
                </Button>
              </Link>
              <Button
                variant={"columnIcon"}
                size="icon"
                onClick={() => {
                  handleClick();
                }}
              >
                <DocReaderIcon width="21" height="23" />
              </Button>
            </div>
            <span className="font-semibold col-span-1">
              {t("interview-rounds.candidate-name")}
            </span>
            <div className="flex gap-5 col-span-2 items-center">
              <span className="text-gray-400">{data?.candidateName}</span>
            </div>
          </div>

          <div className="col-span-4 flex items-center gap-2">
            {data?.status === "Completed" ? (
              <>
                <span className="font-semibold">
                  {t("on-board.approve-date")}
                </span>
                <span className="text-gray-400">
                  {format(new Date(uploadDocTypeData.approveDate), "h ':' m")} |{" "}
                  {format(new Date(uploadDocTypeData.approveDate), "P")}
                </span>
              </>
            ) : (
              <span className="invisible">&nbsp;</span>
            )}
          </div>

          <div className="col-span-3 flex items-center gap-2">
            {(!data || data?.status === "Waiting for Candidate") && (
              <>
                <CircleAlert
                  fill="#EE9923"
                  className="inline-block text-white"
                />{" "}
                <span className="text-gray-500 text-nowrap">
                  {t("common.waiting-for-candidate")}
                </span>
              </>
            )}
            {data?.status === "Completed" && (
              <>
                <CircleCheck
                  fill="#00AC4F"
                  className="inline-block text-white"
                />{" "}
                <span className="text-gray-500 text-nowrap">
                  {t("common.completed")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 items-center">
          <h1 className="text-xl font-semibold">
            {t("title.request-received-signed-contract")}
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
            <div className="grid grid-cols-2 mt-4 gap-4 py-4 border-b-2 border-b-[#9D0A0A]">
              <h3 className="text-base font-semibold">Contract Request</h3>
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
                            accept={"image/jpeg, image/png, application/pdf"}
                            readOnly={!!data}
                            className="col-span-8 text-xs rounded-r-none rounded-l-full"
                            onKeyDown={handleKeyDown}
                          />
                          <FileUploadDialog onFileUpload={handleUpload}>
                            <Button
                              disabled={data !== null}
                              className="rounded-r-full  bg-gray-400 hover:bg-gray-400 text-xs"
                            >
                              Upload File
                            </Button>
                          </FileUploadDialog>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 h-fit gap-4">
                <label htmlFor="phoneNumber">{t("fields.phoneNumber")}</label>
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!!data}
                          id="contactNumber"
                          className="bg-[#F6F7F9] text-xs text-gray-400"
                          {...field}
                          onKeyDown={handleKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <label htmlFor="salary">{t("on-board.salary")}</label>
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!!data}
                          id="salary"
                          type="text"
                          className="bg-[#F6F7F9] text-xs text-gray-400"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <label htmlFor="stateDate">{t("fields.start-date")}</label>
                <FormField
                  control={form.control}
                  name="workStartDate"
                  render={({ field }) => {
                    const selectedDate = field.value
                      ? typeof field.value === "string"
                        ? parseISO(field.value)
                        : field.value
                      : undefined;

                    return (
                      <FormItem className="flex flex-col">
                        <Popover
                          open={popoverOpen}
                          onOpenChange={setPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={!!data}
                                variant={"outline"}
                                className={cn(
                                  "text-xs pl-3 text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                                )}
                              >
                                {selectedDate ? (
                                  format(selectedDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                if (date) {
                                  const utcDate = new Date(
                                    Date.UTC(
                                      date.getFullYear(),
                                      date.getMonth(),
                                      date.getDate()
                                    )
                                  );
                                  field.onChange(utcDate.toISOString());
                                  setPopoverOpen(false);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <label htmlFor="email">{t("fields.email")}</label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!!data}
                          id="email"
                          type="email"
                          className={`bg-[#F6F7F9] text-xs text-gray-400`}
                          {...field}
                          onKeyDown={handleKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <div className="flex-1 bg-gray-300 h-[260px] flex justify-center items-center overflow-y-auto">
                  {file?.endsWith(".pdf") ? (
                    <PDFViewer
                      pdfLink={file}
                      className="max-h-[260px] w-full"
                      isScanning={false}
                      textLayer={true}
                      rotatePoint={0}
                    />
                  ) : file?.endsWith(".png") ||
                    file?.endsWith(".jpg") ||
                    file?.endsWith(".jpeg") ? (
                    <img
                      src={file}
                      className="object-contain w-full h-full"
                      alt="Preview"
                    />
                  ) : null}
                </div>

                <div className="flex justify-between items-center text-gray-500 mt-4">
                  <span className="flex-1">{t("fields.date-update")}</span>
                  <span className="flex-1">
                    {format(
                      new Date(uploadDocTypeData.updatedAt || Date.now()),
                      "h ':' m"
                    )}{" "}
                    |{" "}
                    {format(
                      new Date(uploadDocTypeData.updatedAt || Date.now()),
                      "P"
                    )}
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
              <div className="grid grid-cols-3 gap-2 col-span-7 items-center">
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
                          readOnly={!!data}
                          id="comment"
                          className="bg-[#F6F7F9] text-xs text-gray-400 col-span-2"
                          {...field}
                          onKeyDown={handleKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 col-span-5">
                {data?.status !== "Completed" && (
                  <Button
                    type="submit"
                    className="min-w-28 text-xs border-secondary hover:border-secondary text-secondary hover:text-secondary"
                    variant="outline"
                  >
                    {t("common.generate-contract")}
                  </Button>
                )}

                {data?.status === "Completed" ? (
                  <DialogClose asChild>
                    <Button
                      className="w-28 text-xs ml-auto "
                      variant="destructive"
                    >
                      {t("common.back")}
                    </Button>
                  </DialogClose>
                ) : (
                  <DialogClose asChild>
                    <Button className="w-28 text-xs" variant="destructive">
                      {t("common.cancel")}
                    </Button>
                  </DialogClose>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
