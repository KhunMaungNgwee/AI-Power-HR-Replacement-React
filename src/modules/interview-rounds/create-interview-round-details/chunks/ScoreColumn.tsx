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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { t } from "i18next";
import { ClipboardCopyIcon } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/api";
import InterviewProfile from "@/modules/interview-analysis/chunks/InterviewProfile";
import ChartAndVideo from "@/modules/interview-analysis/chunks/ChartAndVideo";
import { SetStateAction } from "react";

type ScoreColumnType = {
  candidateID: string | undefined;
  open?: boolean;
  setOpen?: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
};

const ScoreColumn = ({
  candidateID,
  open,
  setOpen,
  children,
}: ScoreColumnType) => {
  const { data } = api.candidate.getInterviewDetails.useQuery(candidateID!, {
    queryKey: ["getInterviewDetails", candidateID],
    enabled: candidateID !== undefined,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{t("title.cv-score-viewer")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <InterviewProfile data={data} />

        <ChartAndVideo data={data} />

        <Separator />

        <section className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <h6 className="font-bold">{t("interview-rounds.job-title")}</h6>
            <span className="text-muted">HR</span>
          </div>
          <div className="flex items-center gap-1">
            <h6 className="font-bold">
              {t("interview-rounds.candidate-name")}
            </h6>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/review/${candidateID}`}
                    state={{
                      from: "/pool/create-interview-round",
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-fit p-1 rounded-full"
                    >
                      <ClipboardCopyIcon className="text-secondary" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("common.review")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-muted">Jane Cooper</span>
          </div>
          <div className="flex items-center gap-3">
            <h6 className="font-bold">{t("interview-rounds.score-date")}</h6>
            <span className="text-muted">22 : 47 | 25/6/2567</span>
          </div>
        </section>

        <section className="bg-accent rounded-2xl text-sm">
          <div className="bg-black/90 rounded-t-2xl px-6 py-2 text-white">
            <h3 className="font-medium">{t("interview-rounds.description")}</h3>
          </div>

          <p className="px-3 py-2">
            Merchandising Planning / Budgeting / Ordering (Total 40 points)
            [30]: Pakha has experience in managing product stock, negotiating
            with vendors, and analyzing product costs to achieve gross profit
            goals, which aligns well with the responsibilities of merchandising
            planning, budgeting, and ordering. However, there is no specific
            mention of experience in creating company-wide promotions or
            managing merchandise plans for each season.
            <br />
            <br />
            Inventory Control (Total 20 points) [15]: Pakha has experience in
            managing product stock to prevent missing items and forecasting
            product orders, which aligns with inventory control
            responsibilities. However, there is no specific mention of
            experience in reducing the cost of stock holding or communicating
            with RKJ on defective products.
            <br />
            <br />
            Communication (Total 15 points) [12]: Pakha has demonstrated good
            communication skills through negotiating with vendors and
            coordinating with various departments. However, there is no specific
            mention of experience in communicating with RKJ or other departments
            like VMD/Store Operation.
          </p>

          <div className="grid grid-cols-5 py-3 pl-6 font-medium text-black bg-white">
            <h3 className="col-span-4">
              {t("interview-rounds.conclusion-summary")}
            </h3>
            <h3 className="text-center">{t("interview-rounds.score-total")}</h3>
          </div>

          <div className="rounded-b-2xl grid grid-cols-5 text-black bg-white">
            <p className="bg-border rounded-bl-2xl col-span-4 px-3 py-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia
              doloremque tempora ipsum repellat aspernatur quas, magnam ducimus
              quod! Dolorum reiciendis molestias vitae. Veritatis velit
              dignissimos nemo, earum veniam laboriosam omnis.
            </p>
            <p className="rounded-br-2xl flex items-center justify-center text-3xl font-semibold border">
              90
            </p>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreColumn;
