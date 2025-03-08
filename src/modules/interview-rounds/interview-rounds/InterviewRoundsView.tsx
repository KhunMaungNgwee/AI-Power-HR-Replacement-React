import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import { columns, columnVisibility } from "./columns";
import { useTranslation } from "react-i18next";

const TABS = [
  {
    tab: "tabs.interview-rounds",
    path: "/interview-rounds",
  },
];

const InterviewRoundsView = () => {
  const { t } = useTranslation();
  const { data, isFetching } =
    api.interview.getAllInterviewRoundApproved.useQuery();
  const location = useLocation();
  return (
    <div className="m-4">
      <h1 className="mb-3 text-2xl font-bold">{t("title.interview")}</h1>

      <section
        role="tablist"
        aria-label="Pool Tabs"
        className="flex items-center"
      >
        {TABS.map((tb) => (
          <NavLink
            to={tb.path}
            key={tb.tab}
            state={location.state}
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

      <article className="p-4 bg-white rounded-lg rounded-tl-none">
        <TableUI
          data={data}
          columns={columns}
          loading={isFetching}
          header={t("common.all-candidates")}
          columnVisibility={columnVisibility}
          filterColumns={["name"]}
          sortColumn="createdAt"
          search={false}
        ></TableUI>
      </article>
    </div>
  );
};

export default InterviewRoundsView;
