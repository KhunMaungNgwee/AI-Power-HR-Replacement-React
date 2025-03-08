import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const TABS = [
  {
    tab: "tabs.check-documents",
    path: "/pool/check-documents",
  },
  {
    tab: "tabs.search-for-candidate",
    path: "/pool/search-for-candidate",
  },
  {
    tab: "tabs.create-interview-round",
    path: "/pool/create-interview-round",
  },
];

const PoolView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex flex-col flex-1 m-4">
      <h1 className="mb-3 text-2xl font-bold">{t("title.pool")}</h1>

      <section
        role="tablist"
        aria-label="Pool Tabs"
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

export default PoolView;
