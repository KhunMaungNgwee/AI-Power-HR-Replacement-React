import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <p className="text-4xl font-bold">
        <i>404</i>
      </p>
      <h1>{t("error-msg.exclamation")}</h1>
      <p>{t("error-msg.error-page-desc")}</p>
      <Button
        variant={"secondary"}
        onClick={() => {
          navigate("/");
        }}
      >
        {t("common.back-to-home")}
      </Button>
    </div>
  );
};

export default NotFoundView;
