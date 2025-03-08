import api from "@/api";
import {
  AddInterviewRoundPayload,
  InterviewRoundType,
  UpdateInterviewRoundPayload,
} from "@/api/interview/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/date-time-picker";
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
import QrCodeBox from "@/components/ui/qr-code-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { OP_QR_BASE_URL, HO_QR_BASE_URL } from "@/shared/constants";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { CircleXIcon, RefreshCcw } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { z } from "zod";

type InterviewRoundFormDialogType = {
  children: ReactNode;
  isEdit: boolean;
  editData?: InterviewRoundType;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const TYPE = [
  { label: "HO", value: "HO" },
  { label: "OP", value: "OP" },
];

const FormSchema = z.object({
  departmentRequestID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  provinceID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  divisionManagerID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  jobPositionID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  educationLevelID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  ageRangeID: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  jobDescription: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  startDateTime: z.date(),
  endDateTime: z.date(),
  noCVPassed: z.number({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
  qrImageLink: z
    .string({
      invalid_type_error: t("error-msg.required"),
      required_error: t("error-msg.required"),
    })
    .refine(
      (data) => {
        if (data == "") {
          return false;
        }
        return true;
      },
      { message: t("error-msg.required") }
    ),
  type: z.string({
    invalid_type_error: t("error-msg.required"),
    required_error: t("error-msg.required"),
  }),
});

const InterviewRoundFormDialog = ({
  children,
  isEdit,
  editData,
  open,
  setOpen,
}: InterviewRoundFormDialogType) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: divisionManagers, isLoading: divisionManagersLoading } =
    api.position.getAllDivisionManager.useQuery({
      enabled: open,
    });
  const { data: departments, isLoading: departmentsLoading } =
    api.interview.getAllDepartmentRequest.useQuery({
      enabled: open,
    });
  const { data: ageRanges, isLoading: ageRangesLoading } =
    api.interview.getAllAgeRange.useQuery({
      enabled: open,
    });
  const { data: educationLevels, isLoading: educationLevelsLoading } =
    api.interview.getAllEducationLevel.useQuery({
      enabled: open,
    });
  const { data: provinces, isLoading: provincesLoading } =
    api.interview.getAllProvince.useQuery({
      enabled: open,
    });
  const { data: jobPositions, isLoading: jobPositionsLoading } =
    api.position.getAllJobPosition.useQuery({
      enabled: open,
    });

  const { mutate: addInterviewRound } =
    api.interview.addInterviewRound.useMutation({
      onMutate: () => dispatch(openLoader()),
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllInterviewRound"],
        });

        setOpen(false);

        toast({
          variant: "success",
          title: t("success-title.add"),
          description: t("success-msg.add"),
        });
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

  const { mutate: updateInterviewRound } =
    api.interview.updateInterviewRound.useMutation({
      onMutate: () => dispatch(openLoader()),
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllInterviewRound"],
        });

        setOpen(false);

        toast({
          variant: "success",
          title: t("success-title.update"),
          description: t("success-msg.update"),
        });
      },
      onError: (error: Error) => {
        console.error(error);

        toast({
          variant: "destructive",
          title: t("error-title.update"),
          description: t("error-msg.update"),
        });
      },
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ageRangeID: editData?.ageRangeID,
      departmentRequestID: editData?.departmentRequestID,
      divisionManagerID: editData?.divisionManagerID,
      educationLevelID: editData?.educationLevelID,
      jobPositionID: editData?.jobPositionID,
      provinceID: editData?.provinceID,
      jobDescription: editData?.jobDescription,
      noCVPassed: editData?.noCVPassed,
      startDateTime: editData?.startTime
        ? new Date(editData?.startTime)
        : undefined,
      endDateTime: editData?.endTime ? new Date(editData?.endTime) : undefined,
      qrImageLink: editData?.qrImageLink,
      type: editData?.type,
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  const generateNewQR = () => {
    const type = form.getValues("type");
    const jobPositionID = form.getValues("jobPositionID");

    if (!jobPositionID || !type) {
      form.setError("qrImageLink", {
        type: "custom",
        message: t("error-msg.position-or-type-required"),
      });

      return;
    }
    const qrLink =
      type === "HO"
        ? `${HO_QR_BASE_URL}${jobPositionID}`
        : `${OP_QR_BASE_URL}${jobPositionID}`;
    form.setValue("qrImageLink", qrLink);
    form.clearErrors("qrImageLink");
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const endDate = data.endDateTime;
    const startDate = data.startDateTime;
    endDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    function replaceFunction() {
      const type = form.getValues("type");
      if (type == "HO") {
        return data.qrImageLink.replace(HO_QR_BASE_URL, "");
      } else {
        return data.qrImageLink.replace(OP_QR_BASE_URL, "");
      }
    }

    if (isEdit && editData) {
      const payload: UpdateInterviewRoundPayload = {
        ...data,
        interviewID: editData.interviewID,
        refQrID: replaceFunction(),
        endDate,
        startDate,
        endTime: data.endDateTime,
        startTime: data.startDateTime,
      };
      updateInterviewRound(payload);
    } else {
      const payload: AddInterviewRoundPayload = {
        ...data,
        refQrID: replaceFunction(),
        endDate,
        startDate,
        endTime: data.endDateTime,
        startTime: data.startDateTime,
      };
      addInterviewRound(payload);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] max-w-[1100px]">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>{t("common.details")}</AlertDialogTitle>

          <AlertDialogDescription></AlertDialogDescription>

          <AlertDialogCancel
            asChild
            className="size-fit absolute top-0 right-0 p-0 bg-transparent border-0"
          >
            <Button variant="ghost" size="icon" className="size-fit">
              <CircleXIcon />
            </Button>
          </AlertDialogCancel>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="departmentRequestID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.department-request")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={departments || []}
                      displayField="departmentRequestName"
                      keyField="departmentRequestID"
                      isLoading={departmentsLoading}
                      searchFields={["departmentRequestName"]}
                      placeholder={t("placeholder.department-request")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provinceID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.province")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={provinces || []}
                      displayField={
                        i18n.language === "en" ? "name_EN" : "name_TH"
                      }
                      keyField="provinceID"
                      isLoading={provincesLoading}
                      searchFields={[
                        i18n.language === "en" ? "name_EN" : "name_TH",
                      ]}
                      placeholder={t("placeholder.province")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="divisionManagerID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.division-manager")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={divisionManagers || []}
                      displayField={"firstName"}
                      keyField="divisionManagerID"
                      isLoading={divisionManagersLoading}
                      searchFields={["firstName"]}
                      placeholder={t("placeholder.division-manager")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="educationLevelID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.education-level")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={educationLevels || []}
                      displayField={"educationLevelName"}
                      keyField="educationLevelID"
                      isLoading={educationLevelsLoading}
                      searchFields={["educationLevelName"]}
                      placeholder={t("placeholder.education-level")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobPositionID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.job-position")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={jobPositions || []}
                      displayField={"positionName"}
                      keyField="jobPositionID"
                      isLoading={jobPositionsLoading}
                      searchFields={["positionName"]}
                      placeholder={t("placeholder.job-position")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={(newKey) => {
                        field.onChange(newKey);
                        form.setValue("qrImageLink", "");
                      }}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageRangeID"
              render={({ field }) => (
                <FormItem className="grid items-center grid-cols-3 gap-3">
                  <FormLabel>{t("fields.age-range")} :</FormLabel>
                  <FormControl>
                    <DynamicDropdown
                      items={ageRanges || []}
                      displayField={"ageRange"}
                      keyField="ageRangeID"
                      isLoading={ageRangesLoading}
                      searchFields={["ageRange"]}
                      placeholder={t("placeholder.age-range")}
                      selectedKey={field.value}
                      onUpdateSelectedKey={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-3 gap-3">
                    <FormLabel>{t("fields.job-description")} :</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholder.job-description")}
                        className="min-h-[100px] col-span-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-3 gap-3">
                    <FormLabel>{t("fields.start-date")} :</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        className="col-span-2"
                        disabled={{
                          after: form.getValues("endDateTime"),
                        }}
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-3 gap-3">
                    <FormLabel>{t("fields.end-date")} :</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        className="col-span-2"
                        disabled={{
                          before: form.getValues("startDateTime"),
                        }}
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-3 gap-3">
                    <FormLabel>{t("fields.type")} :</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("qrImageLink", "");
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={t("fields.select-type")}
                            className="font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPE.map((opt, index) => (
                            <SelectItem value={opt.value} key={index}>
                              <span className="font-bold"> {opt.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="noCVPassed"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-3 gap-3">
                    <FormLabel>
                      {t("fields.number-of-candidate-passed")} :
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t(
                          "placeholder.number-of-candidate-passed"
                        )}
                        className=" col-span-2"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="qrImageLink"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      {/* <FormLabel></FormLabel> */}
                      <FormControl>
                        <QrCodeBox
                          qrCodeLink={field.value}
                          generateQRFn={generateNewQR}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-2">
                  <div className="border-accent aspect-square flex flex-col items-center justify-center gap-3 text-xs border rounded-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-accent size-[45%] hover:bg-accent/50 active:bg-accent/50 rounded-full"
                      onClick={generateNewQR}
                    >
                      <RefreshCcw />
                    </Button>

                    <span className="text-center">
                      {t("pool.create-a-new-qr")}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    className="rounded-lg"
                  >
                    {isEdit ? t("common.update") : t("common.create")}
                  </Button>

                  <AlertDialogCancel
                    type="button"
                    className="bg-destructive hover:bg-destructive/80 hover:text-white active:bg-destructive/80 active:text-white text-white rounded-lg"
                  >
                    {t("common.cancel")}
                  </AlertDialogCancel>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InterviewRoundFormDialog;
