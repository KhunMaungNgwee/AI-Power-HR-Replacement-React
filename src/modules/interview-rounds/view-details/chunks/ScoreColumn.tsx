import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { t } from "i18next";
import api from "@/api";
import InterviewProfile from "@/modules/interview-analysis/chunks/InterviewProfile";
import ChartAndVideo from "@/modules/interview-analysis/chunks/ChartAndVideo";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import TableUI from "@/components/table/TableUI";
import FileUpload from "@/components/file-upload/FileUpload";
import {
  columns as questionnaireColumns,
  columnVisibility as questionnaireColumnVisibility,
} from "./columns/QuestionnaireColumns";
import {
  columns as interviewScoreColumns,
  columnVisibility as interviewScoreColumnVisibility,
} from "./columns/InterviewScoreColumns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { UpdateStatusInterviewPayload } from "@/api/candidate/types";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  interviewerName: z
    .string({
      message: "Must be string",
    })
    .min(2, { message: "At least required 2 characters" }),
  interviewScore: z
    .number({
      message: "Must be number",
    })
    .min(1, {
      message: "The interview score must be between 1 and 100.",
    })
    .max(100, {
      message: "The interview score must be between 1 and 100.",
    }),
  commentApprover: z.string().optional(),
  interviewRecordFile: z
    .string({
      message: "Required",
    })
    .min(1, { message: "Required" }),
  statusScoreCheck: z.string(),
});

type ScoreColumnType = {
  candidateID: string | undefined;
  open?: boolean;
  setOpen?: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  useF2FInterview?: boolean;
};

const ScoreColumn = ({
  candidateID,
  open,
  setOpen,
  children,
  useF2FInterview,
}: ScoreColumnType) => {
  const dispatch = useDispatch();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [useF2F, setUseF2F] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const { data } = api.candidate.getInterviewDetails.useQuery(candidateID!, {
    queryKey: ["getInterviewDetails", candidateID],
    enabled: candidateID !== undefined && open,
  });

  const interviewQuestionData = data?.basicQuestionAnswer;

  const interviewScoreData = data?.questionAndAnswerAnalysis;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewerName: data?.interviewerName || "",
      interviewScore: data?.interviewScore || 0,
      interviewRecordFile: data?.interviewRecordUrl || "",
      statusScoreCheck: data?.statusScoreCheck || "",
      commentApprover: data?.commentApprover || "",
    },
  });

  const handleFileUpload = (url: string) => {
    if (url) {
      setFileUrl(url);
      form.setValue("interviewRecordFile", url, { shouldValidate: true });
    } else {
      console.warn("Invalid file URL.");
    }
  };

  useEffect(() => {
    async function fetchAndBind() {
      try {
        if (data?.interviewRecordUrl) {
          form.setValue("interviewRecordFile", data.interviewRecordUrl);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }

    fetchAndBind();
    if (data) {
      form.setValue("interviewerName", data?.interviewerName || "");
      form.setValue("interviewScore", data?.interviewScore || 0);
      form.setValue("commentApprover", data?.commentApprover || "");
    }
  }, [data]);

  useEffect(() => {
    if (useF2FInterview === false) {
      setUseF2F(useF2FInterview);
    }
  }, [useF2FInterview]);

  const { mutate: updateStatusInterview } =
    api.candidate.updateStatusInterview.useMutation({
      onMutate: () => dispatch(openLoader()),
      onSuccess: () => {
        toast({
          variant: "success",
          title: t("success-title.update"),
          description: t("success-msg.update"),
        });

        queryClient.invalidateQueries({
          queryKey: ["getInterviewDetails"],
        });

        queryClient.invalidateQueries({
          queryKey: ["getCandidateByInterviewID"],
        });
        // navigate("")
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: t("error-title.update"),
          description: t("error-msg.update"),
        });
      },
      onSettled: () => dispatch(hideLoader()),
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: UpdateStatusInterviewPayload = {
      candidateID: candidateID as string,
      interviewerName: values.interviewerName,
      interviewRecordUrl: values.interviewRecordFile,
      interviewScore: values.interviewScore,
      statusScoreCheck: values.statusScoreCheck,
      commentApprover: values.commentApprover,
    };
    updateStatusInterview(payload);
  }

  const handleUpdateStatus = (status: string) => {
    form.setValue("statusScoreCheck", status);

    form.handleSubmit(onSubmit)();
  };

  const table1 = useMemo(
    () => (
      <TableUI
        tableHeaderClass="bg-black text-white rounded-t-lg"
        tableRowClass="odd:bg-gray-100 even:bg-white"
        noToolbar={true}
        sort={false}
        search={false}
        data={interviewQuestionData}
        columns={questionnaireColumns}
        loading={false}
        columnVisibility={questionnaireColumnVisibility}
      >
        <></>
      </TableUI>
    ),
    [interviewQuestionData]
  );

  const table2 = useMemo(
    () => (
      <TableUI
        tableHeaderClass="bg-black text-white rounded-t-2xl"
        tableRowClass="odd:bg-gray-100 even:bg-white"
        noToolbar={true}
        sort={false}
        search={false}
        data={interviewScoreData}
        columns={interviewScoreColumns}
        loading={false}
        columnVisibility={interviewScoreColumnVisibility}
      >
        <></>
      </TableUI>
    ),
    [interviewScoreData]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1050px]">
        <DialogHeader>
          <DialogTitle>{t("title.cv-score-viewer")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <InterviewProfile data={data} />

        <ChartAndVideo data={data} />

        <Separator />

        <section className="bg-accent rounded-2xl text-sm">{table1}</section>

        <section className="bg-accent rounded-2xl text-sm">{table2}</section>

        {useF2F ? (
          <>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded-lg shadow">
                  <div className="p-3 border-b md:border-b-0 md:border-r">
                    <p className="font-semibold text-lg mb-4">
                      {t(`interview-analysis.face-to-face-interview`)}
                    </p>

                    <FormField
                      control={form.control}
                      name="interviewerName"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-1.2/4">
                              <span className="text-[#EE3223]">*</span>{" "}
                              {t(`placeholder.interviewer-name`)}
                            </FormLabel>
                            <FormControl className="flex-1">
                              <Input
                                id="interviewerName"
                                // readOnly={Boolean(data?.statusScoreCheck)}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="w-full text-center" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interviewScore"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-1.2/4">
                              <span className="text-[#EE3223]">*</span>{" "}
                              {t(`placeholder.interview-score`)}
                            </FormLabel>
                            <FormControl className="w-20">
                              <Input
                                id="interviewScore"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const inputValue = e.target.value;

                                  if (/^\d*$/.test(inputValue)) {
                                    form.setValue(
                                      "interviewScore",
                                      Number(inputValue)
                                    );
                                    field.onChange(Number(inputValue));
                                  }
                                  form.trigger("interviewScore");
                                }}
                                inputMode="numeric"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="w-full text-center" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="commentApprover"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-1.2/4">
                              {t(`placeholder.comment-by-approver`)}
                            </FormLabel>
                            <FormControl className="flex-1">
                              <Input
                                id="commentApprover"
                                // readOnly={Boolean(data?.statusScoreCheck)}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="w-full text-center" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="interviewRecordFile"
                      render={({ field }) => (
                        <FormItem className="w-full h-full flex">
                          <div className="flex items-center h-full w-full">
                            <FormLabel className="w-1/4">
                              {t("upload.attach-file")}:
                            </FormLabel>
                            <div className="flex flex-col h-full w-full">
                              <FormControl>
                                <>
                                  <Input
                                    type="hidden"
                                    value={fileUrl}
                                    className="hidden"
                                  />
                                  <FileUpload
                                    onFileUpload={handleFileUpload}
                                    allowedTypes={["video/mp4"]}
                                    setFileUrl={(url: string) => {
                                      form.setValue(
                                        "interviewRecordFile",
                                        url as string
                                      );
                                    }}
                                    fileUrl={field.value}
                                  />
                                </>
                              </FormControl>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 flex justify-center items-center gap-6 mt-6">
                  <Button
                    disabled={
                      Boolean(data?.statusScoreCheck) ||
                      !(
                        form.watch("interviewerName") &&
                        form.watch("interviewScore") &&
                        form.watch("interviewRecordFile")
                      )
                    }
                    variant={
                      form.watch("interviewerName") &&
                      form.watch("interviewScore") &&
                      form.watch("interviewRecordFile")
                        ? "secondary"
                        : undefined
                    }
                    className={
                      form.watch("interviewerName") &&
                      form.watch("interviewScore") &&
                      form.watch("interviewRecordFile")
                        ? ""
                        : "bg-[#9c9c9c] text-white hover:bg-[#b1b1b1]"
                    }
                    onClick={() => handleUpdateStatus("Accepted")}
                  >
                    {t("common.accept")}
                  </Button>
                  <Button
                    disabled={
                      Boolean(data?.statusScoreCheck) ||
                      !(
                        form.watch("interviewerName") &&
                        form.watch("interviewScore") &&
                        form.watch("interviewRecordFile")
                      )
                    }
                    onClick={() => handleUpdateStatus("Rejected")}
                  >
                    {t("common.reject")}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreColumn;
