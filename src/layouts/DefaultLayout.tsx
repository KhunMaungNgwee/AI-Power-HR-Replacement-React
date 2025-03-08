import { useAuth } from "@/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar.tsx";
import ProfileBox from "./common/ProfileBox";
import { SelectBox } from "@/components/select/Select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TH, GB } from "country-flag-icons/react/3x2";

const LANGUAGES = [
  {
    label: "lang.thai",
    value: "th",
    icon: <TH title="Thailand" className="w-[24px] h-[16px] inline-block" />,
  },
  {
    label: "lang.english",
    value: "en",
    icon: <GB title="British" className="w-[24px] h-[16px] inline-block" />,
  },
];

type LangType = "en" | "th";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [lang, setLang] = useState<LangType>("en");

  const { i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "th") => {
    i18n.changeLanguage(lng); // Change language
  };

  useEffect(() => {
    changeLanguage(lang);
  }, [lang]);

  const setLanguage = (value: string) => {
    setLang(value as LangType);
  };

  return !isAuthenticated ? (
    <Navigate to={"/auth/login"} state={{ from: location }} replace />
  ) : (
    <div className="h-svh flex overflow-hidden">
      <DesktopSidebar />
      <main className="flex flex-col w-full overflow-y-auto">
        <nav className="flex justify-end gap-4 p-3">
          <SelectBox
            classes="w-fit"
            options={LANGUAGES}
            value={lang}
            onChange={setLanguage}
            placeholder="Select Language"
          />
          <ProfileBox />
        </nav>

        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
