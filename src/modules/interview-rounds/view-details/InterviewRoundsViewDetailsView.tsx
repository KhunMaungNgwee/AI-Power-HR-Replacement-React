import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { ChevronLeftIcon } from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { columns, columnVisibility } from "./columns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    tab: "tabs.check-interview-results",
    path: "/interview-rounds/view-details",
  },
];

const InterviewRoundsViewDetailsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data, isFetching } = api.candidate.getCandidateByInterviewID.useQuery(
    id as string,
    { queryKey: ["getCandidateByInterviewID", id], enabled: !!id }
  );

  const table = useMemo(
    () => (
      <TableUI
        data={data}
        columns={columns}
        header={`${t("common.all-candidates")} > ${
          location.state.departmentName
        }`}
        loading={isFetching}
        columnVisibility={columnVisibility}
        filterColumns={["name"]}
        sortColumn="createdAt"
      >
        <></>
      </TableUI>
    ),
    [data]
  );

  return (
    <div className="m-4">
      <section className="flex items-center gap-3 mb-4">
        <Button
          variant="link"
          className="flex items-center gap-1 font-bold text-black"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="stroke-black" />
          {t("common.back")}
        </Button>
        <h3 className="text-2xl font-bold">{`${t("title.interview")}`}</h3>
      </section>

      <section
        role="tablist"
        aria-label="Pool Tabs"
        className="flex items-center"
      >
        {TABS.map((tb) => (
          <NavLink
            to={`${tb.path}/${id}`}
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

      <section className="p-4 bg-white rounded-lg">{table}</section>
    </div>
  );
};

export default InterviewRoundsViewDetailsView;
