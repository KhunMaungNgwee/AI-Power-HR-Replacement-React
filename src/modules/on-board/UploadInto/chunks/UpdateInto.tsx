import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronRight, CircleAlert, CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContractOfEmploymentDialog } from "./dialogs/ContractOfEmploymentDialog";
import { DocumentUpload } from "./dialogs/DocumentUploadDialog";
import { HealthCheckUpDialog } from "./dialogs/HealthCheckupDialog";
import api from "@/api";
import { CandidateDetailsType } from "@/shared/types";
import { useParams } from "react-router-dom";
import { ReminderDialog } from "./dialogs/ReminderDialog";
import { useEffect, useState } from "react";
import ScoreColumn from "@/modules/interview-rounds/view-details/chunks/ScoreColumn";
import { Skeleton } from "@/components/ui/skeleton";

type UpdateIntoPropsType = {
  data?: CandidateDetailsType;
};

const UpdateInto = ({ data }: UpdateIntoPropsType) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [docUploadOpen, setDocUploadOpen] = useState<boolean>(false);
  const [isOpenCED, setIsOpenCED] = useState<boolean>(false);
  const [isHealthCheckUp, setIsHealthCheckUp] = useState<boolean>(false);
  const [openScoreCheckDialog, setOpenScoreCheckDialog] =
    useState<boolean>(false);

  const { data: updateIntoData } = api.uploadInto.getUploadIntoById.useQuery(
    id as string,
    {
      queryKey: ["getUploadIntoById", id],
      enabled: !!id,
      staleTime: 0,
    }
  );

  useEffect(() => {
    if (updateIntoData) {
      const checkDueDate = updateIntoData?.docTypeList.some((item) => {
        return (
          new Date(item.dueDate) < new Date() &&
          item.status === "Waiting for Candidate"
        );
      });
      if (checkDueDate) {
        setIsOpen(checkDueDate);
      }
    }
  }, [updateIntoData]);

  const handleDocUpload = () => {
    setDocUploadOpen(true);
  };

  return (
    <section className=" bg-white p-6 rounded-lg">
      <h2 className="font-bold text-xl">{t("title.update-into")}</h2>
      <ol className="mt-8 flex flex-col gap-2">
        {updateIntoData?.docTypeList.map((item, index) => (
          <li
            className="grid grid-cols-3 items-center border-b py-2"
            key={index}
          >
            <div>
              {" "}
              <span>{index + 1}.</span> {item.documentType}
            </div>
            <span className="text-gray-500">
              {data && item.status === "Waiting for Candidate" ? (
                <>
                  <CircleAlert
                    fill="#EE9923"
                    className="inline-block text-white"
                  />{" "}
                  {t("common.waiting-for-candidate")}
                </>
              ) : (
                <>
                  <CircleCheck
                    fill="#00AC4F"
                    className="inline-block text-white"
                  />{" "}
                  {t("common.completed")}
                </>
              )}
            </span>

            <span className="flex gap-4 text-xs">
              {data && item.documentType === "Contract of Employment" ? (
                <ContractOfEmploymentDialog
                  uploadIntoData={updateIntoData}
                  candidate={data}
                  isOpen={isOpenCED}
                  setIsOpen={setIsOpenCED}
                  setOpenScoreCheck={setOpenScoreCheckDialog}
                  uploadDocTypeData={item}
                >
                  <Button variant={"outline"} className="text-gray-500 text-xs">
                    <span>{t("fields.open-or-check")}</span> <ChevronRight />
                  </Button>
                </ContractOfEmploymentDialog>
              ) : data && item.documentType === "Document Upload" ? (
                <DocumentUpload
                  open={docUploadOpen}
                  setOpen={setDocUploadOpen}
                  setOpenScoreCheck={setOpenScoreCheckDialog}
                  uploadDocTypeData={item}
                  uploadIntoData={updateIntoData}
                  candidate={data}
                >
                  <Button
                    disabled={
                      updateIntoData.docTypeList[0].status ==
                      "Waiting for Candidate"
                    }
                    variant={"outline"}
                    className="text-gray-500 text-xs"
                    onClick={handleDocUpload}
                  >
                    <span>{t("fields.open-or-check")}</span> <ChevronRight />
                  </Button>
                </DocumentUpload>
              ) : (
                <HealthCheckUpDialog
                  data={data}
                  uploadDocTypeData={item}
                  uploadIntoData={updateIntoData}
                  isOpen={isHealthCheckUp}
                  setIsOpen={setIsHealthCheckUp}
                  setOpenScoreCheck={setOpenScoreCheckDialog}
                >
                  <Button
                    disabled={
                      updateIntoData.docTypeList[0].status ===
                        "Waiting for Candidate" ||
                      updateIntoData.docTypeList[1].status ===
                        "Waiting for Candidate"
                    }
                    variant={"outline"}
                    className="text-gray-500 text-xs"
                  >
                    <span>{t("fields.open-or-check")}</span> <ChevronRight />
                  </Button>
                </HealthCheckUpDialog>
              )}
              <div className="px-8 py-2 flex gap-2 items-center border rounded-lg bg-gray-50 relative">
                {new Date(item?.dueDate).getTime() < Date.now() &&
                  item.status === "Waiting for Candidate" && (
                    <span className="w-4 h-4 bg-destructive rounded-full absolute left-2 bottom-1/2 top-1/2 -translate-y-1/2"></span>
                  )}
                <div>{t("fields.due-date")}</div>
                <span className="text-gray-600">
                  {format(new Date(item?.dueDate || Date.now()), "h ':' m")} |{" "}
                  {format(new Date(item?.dueDate || Date.now()), "P")}
                </span>
              </div>
            </span>
          </li>
        ))}
        {!updateIntoData && (
          <>
            <li className="grid grid-cols-3 items-center border-b py-2 gap-2">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
            </li>
            <li className="grid grid-cols-3 items-center border-b py-2 gap-2">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
            </li>
            <li className="grid grid-cols-3 items-center border-b py-2 gap-2">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
            </li>
          </>
        )}
      </ol>
      <div className="grid grid-cols-3 mt-12">
        <div></div>
        <div></div>
        <div className="border-l-2 px-4 leading-none border-l-[#EE3223] flex flex-col gap-2">
          <p className="flex gap-2">
            <span className="font-semibold">
              {t("fields.update-into-status")}:
            </span>
            {updateIntoData ? (
              <>
                <span className="text-gray-500 text-nowrap">
                  {updateIntoData?.status}
                </span>
                {updateIntoData &&
                updateIntoData?.docTypeList.some(
                  (item) => item.status === "Waiting for Candidate"
                ) ? (
                  <span className="w-5 h-5 bg-[#FA8500] rounded-full"></span>
                ) : (
                  <span className="w-5 h-5 bg-[#37b95e] rounded-full"></span>
                )}
              </>
            ) : (
              <Skeleton className="h-3 w-full bg-gray-200" />
            )}
          </p>
          <p className="flex gap-2">
            <span className="font-semibold text-nowrap">
              {t("fields.recruiter-interview")}:
            </span>
            {updateIntoData ? (
              <span className="text-gray-500">
                {updateIntoData?.recruiterName}
              </span>
            ) : (
              <Skeleton className="h-3 w-full bg-gray-200" />
            )}
          </p>
          <p className="flex gap-2 text-sm">
            <span className="font-semibold text-nowrap">
              {t("on-board.approve-date")}:
            </span>
            {updateIntoData ? (
              <span className="text-gray-600">
                {updateIntoData?.approveDate
                  ? format(new Date(updateIntoData?.approveDate), "h ':' m")
                  : "--:-- "}{" "}
                |{" "}
                {updateIntoData?.approveDate
                  ? format(
                      new Date(updateIntoData?.approveDate || Date.now()),
                      "P"
                    )
                  : "--/--/----"}
              </span>
            ) : (
              <Skeleton className="h-3 w-full bg-gray-200" />
            )}
          </p>
        </div>
      </div>

      <ReminderDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={updateIntoData?.docTypeList}
      />

      <ScoreColumn
        candidateID={data?.candidateID}
        open={openScoreCheckDialog}
        setOpen={setOpenScoreCheckDialog}
        useF2FInterview={false}
      >
        <></>
      </ScoreColumn>
    </section>
  );
};

export default UpdateInto;
