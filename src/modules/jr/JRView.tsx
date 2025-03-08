import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

const TABS = [
  {
    tab: "tabs.job-requisition",
    path: "/jr/job-requisition",
  },
  {
    tab: "tabs.job-position",
    path: "/jr/job-position",
  },
];

const JRView = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col flex-1 m-4">
      <section
        role="tablist"
        aria-label="JR Tabs"
        className="flex items-center"
      >
        {TABS.map((tb) => (
          <NavLink
            to={tb.path}
            key={tb.tab}
            className={({ isActive }) =>
              cn(
                "px-6 py-1 cursor-pointer select-none rounded-t-md",
                isActive ? "font-semibold bg-white" : "text-muted font-medium"
              )
            }
            role="tab"
            aria-selected={location.pathname === tb.path}
            tabIndex={location.pathname === tb.path ? 0 : -1}
          >
            {t(tb.tab)}
          </NavLink>
        ))}
      </section>

      <article
        className={cn(
          "p-4 bg-white rounded-lg",
          location.pathname === TABS[0].path && "rounded-tl-none"
        )}
      >
        <Outlet />
      </article>
    </div>
  );
};

export default JRView;
