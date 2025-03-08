import { CandidateData } from "@/api/candidate/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type InterviewProfileType = {
  data?: CandidateData;
};

const InterviewProfile = ({ data }: InterviewProfileType) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <section className="sm:flex hidden w-full gap-3 pr-3 bg-white rounded-lg shadow">
        <div className="bg-primary text-primary-foreground flex items-center justify-center w-10 min-h-full rounded-l-lg">
          <h4 className="whitespace-nowrap -rotate-90">
            {t("common.interview-profile")}
          </h4>
        </div>

        <div className="grow flex items-center gap-6 my-3 ml-8">
          <Avatar className="min-w-[80px] h-auto aspect-square mt-3">
            <AvatarImage src={data?.profileUrl || ""} alt="Profile Image" />
            <AvatarFallback className="capitalize">
              {data?.firstName[0]}
              {data?.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h6 className="text-sm font-semibold">
              {t("common.name")}: {data?.firstName}
            </h6>
            <h6 className="mb-3 text-sm font-semibold">
              {t("common.last-name")}: {data?.lastName}
            </h6>

            <p className="text-muted text-xs">{data?.phoneNumber}</p>
            <p className="text-muted text-xs">{data?.email}</p>
            <p className="text-muted text-xs">
              {t("common.education-qualification")} : {data?.degree}
            </p>
            <p className="text-muted text-xs">
              {t("common.province")} : {data?.address}
            </p>
          </div>
        </div>

        <div className="pl-0 my-3">
          <div className="bg-lightBlue text-lightBlue-foreground py-4 border-lightBlue-foreground rounded-xl h-[140px] w-[140px] flex flex-col justify-center gap-4 items-center border border-dashed">
            <h6 className="text-lg font-semibold">{t("common.total-score")}</h6>
            <h6 className="text-6xl font-bold select-none">
              {data?.totalScore ?? "-"}
            </h6>
          </div>
        </div>
      </section>

      <section className="sm:hidden relative flex w-full gap-3 pr-3 bg-white rounded-lg shadow">
        <div className="bg-primary text-primary-foreground flex items-center justify-center w-10 min-h-full rounded-l-lg">
          <h4 className="whitespace-nowrap -rotate-90">
            {t("common.interview-profile")}
          </h4>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="active:bg-transparent hover:bg-transparent right-1 top-1 absolute"
          onClick={() => navigate(-1)}
        >
          <CrossCircledIcon className="stroke-black w-4 h-4" />
        </Button>

        <div className="grid items-center w-full grid-cols-1 gap-3">
          <Avatar className="min-w-[80px] h-auto aspect-square mt-3">
            <AvatarImage src={data?.profileUrl || ""} alt="Profile Image" />
            <AvatarFallback className="capitalize">
              {data?.firstName[0]}
              {data?.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h6 className="text-sm font-semibold">
              {t("common.name")}: {data?.firstName}
            </h6>
            <h6 className="mb-3 text-sm font-semibold">
              {t("common.last-name")}: {data?.lastName}
            </h6>

            <p className="text-muted text-xs">{data?.phoneNumber}</p>
            <p className="text-muted text-xs">{data?.email}</p>
            <p className="text-muted text-xs">
              {t("common.education-qualification")} : {data?.degree}
            </p>
            <p className="text-muted text-xs">
              {t("common.province")} : {data?.address}
            </p>
          </div>

          <div className="pl-0 mx-auto my-3">
            <div className="bg-lightBlue text-lightBlue-foreground py-4 border-lightBlue-foreground rounded-xl h-[140px] w-[140px] flex flex-col justify-center gap-4 items-center border border-dashed">
              <h6 className="text-lg font-semibold">
                {t("common.total-score")}
              </h6>
              <h6 className="text-6xl font-bold select-none">
                {data?.totalScore ?? "-"}
              </h6>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewProfile;
