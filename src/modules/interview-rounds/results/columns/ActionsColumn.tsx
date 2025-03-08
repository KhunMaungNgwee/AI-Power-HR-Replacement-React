import { Button } from "@/components/ui/button";
import { t } from "i18next";

type ActionsColumnType = {
  interviewID: string;
};

const ActionsColumn = ({ interviewID }: ActionsColumnType) => {
  const handleClick = () => {
    console.log(interviewID);
  };
  return (
    <div className="flex items-center justify-center w-full">
      <Button
        variant="secondary"
        className="min-w-[140px]"
        onClick={handleClick}
      >
        {t("common.submit")}
      </Button>
    </div>
  );
};

export default ActionsColumn;
