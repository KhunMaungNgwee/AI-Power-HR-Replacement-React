import { Button } from "@/components/ui/button";
import { t } from "i18next";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

export default function ErrorView() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <h1>{t("error-msg.exclamation")}</h1>
        <p>{t("error-msg.error-page-desc")}</p>
        <p className="text-2xl">
          <i>
            {error.status} {error.statusText}
          </i>
        </p>
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
  }

  if (error instanceof Error) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <h1>{t("error-msg.exclamation")}</h1>
        <p>{t("error-msg.error-page-desc")}</p>
        <p className="text-2xl">
          <i>{error.message}</i>
        </p>
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
  }

  return (
    <div className="flex flex-col items-center gap-3 justify-center min-h-screen">
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
}
