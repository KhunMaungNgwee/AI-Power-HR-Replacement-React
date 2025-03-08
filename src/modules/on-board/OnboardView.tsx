import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { columns, columnVisibility } from "./columns";
const TABS = [
  {
    tab: "tabs.check-documents",
    path: "/on-board",
  },
];

const OnboardView = () => {
  const { t } = useTranslation();
  const { data, isFetching } = api.candidate.getAllOnboardCandidates.useQuery();
  return (
    <div className="flex flex-col flex-1 m-4">
      <h1 className="mb-3 text-2xl font-bold">{t("title.on-board")}</h1>

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

      <article className="p-4 bg-white rounded-lg rounded-tl-none overflow-x-scroll">
        <TableUI
          data={data}
          columns={columns}
          loading={isFetching}
          header={t("common.all-candidates")}
          headerDescription={t("on-board.recruiter-select-candidates")}
          columnVisibility={columnVisibility}
          filterColumns={["name"]}
          sortColumn="createdAt"
          fallbackSortColumn="candidateName"
          search={false}
          tableCellClass="w-[30px]"
        ></TableUI>
      </article>
    </div>
  );
};

export default OnboardView;
