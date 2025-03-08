import api from "@/api";
import {
  EditJobPositionPayloadType,
  JobPositionType,
} from "@/api/position/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DynamicDropdown from "@/components/ui/dynamic-dropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import React, {
  ChangeEvent,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { BasicQuestionTable } from "./BasicQuestionTable";
import { MasterQuestionTable } from "./MasterQuestionTable";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  divisionManagerID: z
    .string({ message: "Division Manager is required!" })
    .min(1, { message: "Division manager is required" }),
  positionName: z.string().min(2, {
    message: "Position name must be at least 2 characters.",
  }),
  jobDescription: z.string().min(2, {
    message: "Job Description must be at least 2 characters.",
  }),
  jobLevel: z.string().min(2, {
    message: "Job Level must be at least 2 characters.",
  }),
  addBasicQuestionList: z
    .array(
      z.object({
        question: z.string().min(1, { message: "Question is required" }),
        questionTh: z.string().min(1, { message: "Thai question is required" }),
      })
    )
    .optional(),
  updateBasicQuestionList: z
    .array(
      z.object({
        basicQuestionID: z.string().optional(),
        jobPositionID: z.string().optional(),
        question: z.string().min(1, { message: "Question is required" }),
        questionTh: z.string().min(1, { message: "Thai question is required" }),
      })
    )
    .optional(),
  addQuestionList: z
    .array(
      z.object({
        questionEnglish: z.string().min(1, { message: "Question is required" }),
        questionThai: z
          .string()
          .min(1, { message: "Thai question is required" }),
      })
    )
    .optional(),
  updateQuestionList: z
    .array(
      z.object({
        questionID: z.number().optional(),
        jobPositionID: z.string().optional(),
        questionEnglish: z.string().min(1, { message: "Question is required" }),
        questionThai: z
          .string()
          .min(1, { message: "Thai question is required" }),
      })
    )
    .optional(),
});

const POSITION_NAME_LIMIT = 500;
const JOB_DESCRIPTION_LIMIT = 255;
const JOB_LEVEL_LIMIT = 255;

export type UpdateBasicQuestionsType = {
  basicQuestionID?: string;
  jobPositionID?: string;
  question: string;
  questionTh: string;
};

export type UpdateMasterQuestionsType = {
  questionID?: number;
  jobPositionID?: string;
  questionEnglish: string;
  questionThai: string;
};

type UpdateQuestionContextType =
  | {
      basic: {
        rowId: number | undefined;
        setRowId: Dispatch<React.SetStateAction<number | undefined>>;
        basicQuestion: UpdateBasicQuestionsType[] | undefined;
        setBasicQuestion: Dispatch<
          React.SetStateAction<UpdateBasicQuestionsType[] | undefined>
        >;
      };
      master: {
        rowId: number | undefined;
        setRowId: Dispatch<React.SetStateAction<number | undefined>>;
        masterQuestion: UpdateMasterQuestionsType[] | undefined;
        setMasterQuestion: Dispatch<
          React.SetStateAction<UpdateMasterQuestionsType[] | undefined>
        >;
      };
    }
  | undefined;

export const UpdateQuestionsContext =
  createContext<UpdateQuestionContextType>(undefined);

export function DialogForm({
  refetch,
  isEdit = false,
  data = undefined,
  isOpen = false,
  setIsOpen,
  children,
}: {
  refetch: () => void;
  isEdit: boolean;
  data: JobPositionType | undefined;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditDialog?: Dispatch<
    SetStateAction<{
      data: JobPositionType | undefined;
      isEdit: boolean;
    }>
  >;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [basicQuestionEn, setBasicQuestionEn] = useState<string>("");
  const [basicQuestionTh, setBasicQuestionTh] = useState<string>("");
  const [masterQuestionEn, setMasterQuestionEn] = useState<string>("");
  const [masterQuestionTh, setMasterQuestionTh] = useState<string>("");
  const [openBasicQuestionForm, setOpenBasicQuestionForm] =
    useState<boolean>(false);
  const [openMasterQuestionForm, setOpenMasterQuestionForm] =
    useState<boolean>(false);
  const [basicEditQuestions, setBasicEditQuestions] =
    useState<UpdateBasicQuestionsType[]>();
  const [masterEditQuestions, setMasterEditQuestions] =
    useState<UpdateMasterQuestionsType[]>();
  const [rowId, setRowId] = useState<number | undefined>(undefined);
  const [masterRowId, setMasterRowId] = useState<number | undefined>(undefined);

  const { data: divisionManager, isLoading: divisionManagerLoading } =
    api.position.getAllDivisionManager.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      divisionManagerID: data?.divisionManagerID || undefined,
      positionName: data?.positionName || "",
      jobDescription: data?.jobDescription || "",
      jobLevel: data?.jobLevel || "",
      updateBasicQuestionList: isEdit
        ? data?.basicQuestionList.map((d) => {
            return {
              jobPositionID: d.jobPositionID,
              basicQuestionID: d.basicQuestionID,
              question: d.question,
              questionTh: d.questionTh,
            };
          })
        : undefined,
      updateQuestionList: isEdit
        ? data?.masterQuestionsList.map((d) => {
            return {
              jobPositionID: d.jobPositionID,
              questionID: d.questionID,
              questionEnglish: d.questionEnglish,
              questionThai: d.questionThai,
            };
          })
        : undefined,
    },
  });

  const [basic, master, basicEdit, masterEdit] = useWatch({
    name: [
      "addBasicQuestionList",
      "addQuestionList",
      "updateBasicQuestionList",
      "updateQuestionList",
    ],
    control: form.control,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        divisionManagerID: data.divisionManagerID || undefined,
        positionName: data.positionName || "",
        jobDescription: data.jobDescription || "",
        jobLevel: data.jobLevel || "",
        updateBasicQuestionList: data.basicQuestionList?.map((d) => ({
          jobPositionID: d.jobPositionID,
          basicQuestionID: d.basicQuestionID,
          question: d.question,
          questionTh: d.questionTh,
        })),
        updateQuestionList: data.masterQuestionsList?.map((d) => ({
          jobPositionID: d.jobPositionID,
          questionID: d.questionID,
          questionEnglish: d.questionEnglish,
          questionThai: d.questionThai,
        })),
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        addBasicQuestionList: [],
        addQuestionList: [],
        divisionManagerID: "",
        jobDescription: "",
        jobLevel: "",
        positionName: "",
        updateBasicQuestionList: [],
        updateQuestionList: [],
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEdit) {
      if (basicEdit) {
        if (basicEditQuestions) {
          form.setValue("updateBasicQuestionList", [
            ...basicEdit.map((b, index) => {
              if (b.basicQuestionID === basicEditQuestions[0].basicQuestionID) {
                return basicEditQuestions[0];
              } else if (index === rowId) {
                return basicEditQuestions[0];
              }
              return b;
            }),
          ]);
        }
      } else {
        if (basicEditQuestions) {
          form.setValue("updateBasicQuestionList", [...basicEditQuestions]);
        }
      }
    } else {
      if (basic) {
        if (basicEditQuestions) {
          form.setValue("addBasicQuestionList", [
            ...basic.map((b, index) => {
              if (index === rowId) {
                return basicEditQuestions[0];
              }

              return b;
            }),
          ]);
        }
      } else {
        if (masterEditQuestions) {
          form.setValue("addQuestionList", [...masterEditQuestions]);
        }
      }
    }

    setBasicEditQuestions(undefined);
  }, [basicEditQuestions]);

  useEffect(() => {
    if (isEdit) {
      if (masterEdit) {
        if (masterEditQuestions) {
          form.setValue("updateQuestionList", [
            ...masterEdit.map((b) => {
              if (b.questionID === masterEditQuestions[0].questionID) {
                return masterEditQuestions[0];
              }

              return b;
            }),
          ]);
        }
      } else {
        if (masterEditQuestions) {
          form.setValue("updateQuestionList", [...masterEditQuestions]);
        }
      }
    } else {
      if (master) {
        if (masterEditQuestions) {
          form.setValue("addQuestionList", [
            ...master.map((b, index) => {
              if (index === masterRowId) {
                return masterEditQuestions[0];
              }

              return b;
            }),
          ]);
        }
      } else {
        if (masterEditQuestions) {
          form.setValue("addQuestionList", [...masterEditQuestions]);
        }
      }
    }

    setMasterEditQuestions(undefined);
  }, [masterEditQuestions]);

  const handleBasicQuestionEnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (basicQuestionEn.length < 500) {
      setBasicQuestionEn(e.target.value);
    }
  };

  const handleBasicQuestionThChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (basicQuestionTh.length < 500) {
      setBasicQuestionTh(e.target.value);
    }
  };

  const handleBasicQuestionSave = () => {
    if (isEdit) {
      if (basicEdit) {
        form.setValue("updateBasicQuestionList", [
          ...basicEdit,
          { question: basicQuestionEn, questionTh: basicQuestionTh },
        ]);
      } else {
        form.setValue("updateBasicQuestionList", [
          { question: basicQuestionEn, questionTh: basicQuestionTh },
        ]);
      }
    } else {
      if (basic) {
        form.setValue("addBasicQuestionList", [
          ...basic,
          { question: basicQuestionEn, questionTh: basicQuestionTh },
        ]);
      } else {
        form.setValue("addBasicQuestionList", [
          { question: basicQuestionEn, questionTh: basicQuestionTh },
        ]);
      }
    }
    setBasicQuestionEn("");
    setBasicQuestionTh("");
    setOpenBasicQuestionForm(false);
  };

  const handleMasterQuestionEnChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (masterQuestionEn.length < 500) {
      setMasterQuestionEn(e.target.value);
    }
  };

  const handleMasterQuestionThChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (masterQuestionTh.length < 500) {
      setMasterQuestionTh(e.target.value);
    }
  };

  const handleMasterQuestionSave = () => {
    if (isEdit) {
      if (masterEdit) {
        form.setValue("updateQuestionList", [
          ...masterEdit,
          {
            questionEnglish: masterQuestionEn,
            questionThai: masterQuestionTh,
          },
        ]);
      } else {
        form.setValue("updateQuestionList", [
          {
            questionEnglish: masterQuestionEn,
            questionThai: masterQuestionTh,
          },
        ]);
      }
    } else {
      if (master) {
        form.setValue("addQuestionList", [
          ...master,
          {
            questionEnglish: masterQuestionEn,
            questionThai: masterQuestionTh,
          },
        ]);
      } else {
        form.setValue("addQuestionList", [
          {
            questionEnglish: masterQuestionEn,
            questionThai: masterQuestionTh,
          },
        ]);
      }
    }
    setMasterQuestionEn("");
    setMasterQuestionTh("");
    setOpenMasterQuestionForm(false);
  };

  const handleBasicAddForm = () => {
    setOpenBasicQuestionForm(true);
  };

  const handleMasterAddForm = () => {
    setOpenMasterQuestionForm(true);
  };

  const { mutate: addJobPosition } = api.position.addJobPosition.useMutation({
    onSuccess: () => {
      toast({
        title: t("success-msg.add-success", { data: "Job Position" }),
        variant: "success",
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["getMasterQuestionsByID"],
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error adding job position: ", error);

      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateJobPosition } =
    api.position.editJobPosition.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.update-success", { data: "Job Position" }),
          variant: "success",
        });
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["getBasicQuestionsByID"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getAllJobPosition"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error updating job position: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = isEdit
      ? {
          ...values,
          jobPositionID: data?.jobPositionID,
          // updateQuestionList: masterEditQuestions,
          // updateBasicQuestionList: basicEditQuestions,
        }
      : values;

    if (isEdit) {
      updateJobPosition(payload as EditJobPositionPayloadType);
    } else {
      addJobPosition(payload);
    }
  }

  const memoizedData = useMemo(() => {
    return isEdit ? basicEdit : basic;
  }, [isEdit, basicEdit, basic]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[80%]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("job-position.edit-job-position")
              : t("job-position.add-job-position")}
          </DialogTitle>
          <DialogDescription
            className="hidden"
            aria-hidden={true}
          ></DialogDescription>
        </DialogHeader>

        <UpdateQuestionsContext.Provider
          value={{
            basic: {
              rowId,
              setRowId,
              basicQuestion: basicEditQuestions,
              setBasicQuestion: setBasicEditQuestions,
            },
            master: {
              rowId: masterRowId,
              setRowId: setMasterRowId,
              masterQuestion: masterEditQuestions,
              setMasterQuestion: setMasterEditQuestions,
            },
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="divisionManagerID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.division-manager")}</FormLabel>
                    <FormControl>
                      <DynamicDropdown
                        items={divisionManager || []}
                        displayField="firstName"
                        keyField="divisionManagerID"
                        isLoading={divisionManagerLoading}
                        searchFields={["firstName"]}
                        placeholder={t("placeholder.division-manager")}
                        selectedKey={field.value}
                        onUpdateSelectedKey={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.position-name")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t("placeholder.position-name")}
                          {...field}
                        />
                        <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${field.value.length}/${POSITION_NAME_LIMIT}`}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.job-description")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder={t("placeholder.job-description")}
                          {...field}
                          className="pb-8"
                          onChange={(e) => {
                            if (e.target.value.length <= 500) {
                              field.onChange(e); // Update only if the word count is within the limit
                            }
                          }}
                        />
                        <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${field.value.length}/${JOB_DESCRIPTION_LIMIT}`}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.job-level")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t("placeholder.job-level")}
                          {...field}
                        />
                        <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${field.value.length}/${JOB_LEVEL_LIMIT}`}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={handleBasicAddForm}
                >
                  {t("job-position.add-basic-question")}
                </Button>
              </div>

              {openBasicQuestionForm && (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Textarea
                      placeholder={t("placeholder.basic-question-en")}
                      className="pb-8"
                      value={basicQuestionEn}
                      onChange={handleBasicQuestionEnChange}
                    />
                    <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${basicQuestionEn.length}/${POSITION_NAME_LIMIT}`}</span>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder={t("placeholder.basic-question-th")}
                      className="pb-8"
                      value={basicQuestionTh}
                      onChange={handleBasicQuestionThChange}
                    />
                    <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${basicQuestionTh.length}/${POSITION_NAME_LIMIT}`}</span>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant={"secondary"}
                      disabled={!basicQuestionEn || !basicQuestionTh}
                      onClick={handleBasicQuestionSave}
                    >
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              )}

              <BasicQuestionTable data={memoizedData} />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={handleMasterAddForm}
                >
                  {t("job-position.add-master-question")}
                </Button>
              </div>

              {openMasterQuestionForm && (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Textarea
                      placeholder={t("placeholder.master-question-en")}
                      className="pb-8"
                      value={masterQuestionEn}
                      onChange={handleMasterQuestionEnChange}
                    />
                    <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${masterQuestionEn.length}/${POSITION_NAME_LIMIT}`}</span>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder={t("placeholder.master-question-en")}
                      className="pb-8"
                      value={masterQuestionTh}
                      onChange={handleMasterQuestionThChange}
                    />
                    <span className="right-6 bottom-1 absolute text-xs text-gray-400">{`${masterQuestionTh.length}/${POSITION_NAME_LIMIT}`}</span>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant={"secondary"}
                      disabled={!masterQuestionEn || !masterQuestionTh}
                      onClick={handleMasterQuestionSave}
                    >
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              )}

              <MasterQuestionTable data={isEdit ? masterEdit : master} />

              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    form.reset({
                      addBasicQuestionList: [],
                      addQuestionList: [],
                      divisionManagerID: "",
                      jobDescription: "",
                      jobLevel: "",
                      positionName: "",
                      updateBasicQuestionList: [],
                      updateQuestionList: [],
                    });
                    setIsOpen(false);
                  }}
                  variant={"outline"}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" variant={"secondary"}>
                  {t("common.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </UpdateQuestionsContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
