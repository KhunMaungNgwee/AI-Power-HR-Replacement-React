import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CandidateType } from "@/shared/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { CRCHistory } from "../chunks/CRCHistory";
import { History } from "../chunks/History";
import { format } from "date-fns";
import { SkeletonLoader } from "../loader/SkeletonLoader";
import { CandidateHistoryType } from "@/api/candidate/types";
import { InterviewHistoryType } from "@/api/interview/types";

export function HistoryDialog({
  data,
  children,
  isOpen = false,
  handleOpenChange,
  candidateHistory,
  candidateHistoryFetching,
  crcHistory,
  crcHistoryFetching,
}: {
  data: CandidateType;
  children: React.ReactNode;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  candidateHistory: CandidateHistoryType[] | undefined;
  candidateHistoryFetching: boolean;
  crcHistory: InterviewHistoryType[] | undefined;
  crcHistoryFetching: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div>{children}</div>
      <DialogContent className="lg:max-w-[860px] max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle className="first-letter:text-primary text-2xl">
            {t("common.history")}
          </DialogTitle>

          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <section className="py-4 border-b border-gray-200">
          <h3 className="mb-4 text-lg font-semibold">
            {t("common.candidate-history")}:
          </h3>

          <div className="flex gap-10 mt-2 text-sm">
            <div className="flex gap-4">
              <h6 className="font-medium text-black">
                {t("fields.candidate-name")}
              </h6>
              <span className="text-muted">{data?.name || ""}</span>
            </div>

            <div className="flex gap-4">
              <h6 className="font-medium text-black">{t("fields.job")}</h6>
              <span className="text-muted">{data?.jobPosition || "-"}</span>
            </div>
          </div>

          <div>
            {candidateHistoryFetching ? (
              <SkeletonLoader />
            ) : candidateHistory && candidateHistory.length !== 0 ? (
              candidateHistory.map((history, index) => (
                <History
                  date={format(new Date(history.updatedAt), "MMM dd, yyyy")}
                  message={history.historyDetails}
                  key={index}
                />
              ))
            ) : (
              <p className="text-sm mb-8 py-4">{t(`dialog-desc.no-history`)}</p>
            )}
          </div>
        </section>

        <section className="py-4">
          <h3 className="mb-4 text-lg font-semibold">
            {t("common.crc-interview-history")}:
          </h3>

          <div className="space-y-6">
            {crcHistoryFetching ? (
              <SkeletonLoader />
            ) : crcHistory && crcHistory.length !== 0 ? (
              crcHistory.map((history, index) => (
                <CRCHistory
                  key={index}
                  divisionManager={history.approverName}
                  status={`${
                    history.status ? t("candidate.ever") : t("candidate.never")
                  }`}
                  result={history.result}
                  date={format(new Date(history.updatedAt), "MMM dd, yyyy")}
                  score={history.score}
                />
              ))
            ) : (
              <p className="text-sm mb-8 py-4">{t(`dialog-desc.no-history`)}</p>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
