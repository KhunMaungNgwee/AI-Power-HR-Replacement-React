import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { ChevronLeftIcon } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { columns, columnVisibility } from "./columns";

const CreateInterviewRoundDetailsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  if (!id) {
    navigate("/not-found");
    return null;
  }

  const { data, isFetching } =
    api.candidate.getCandidateByInterviewID.useQuery(id);

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
        <h3 className="text-2xl font-bold">{`${t("title.view")} '${
          location.state.departmentName
        }'`}</h3>
      </section>

      <section className="p-4 bg-white rounded-lg">
        <TableUI
          data={data}
          columns={columns}
          loading={isFetching}
          columnVisibility={columnVisibility}
          filterColumns={["name"]}
          sortColumn="createdAt"
          toolbarClassNames="flex justify-between gap-2 w-full"
        >
          <></>
        </TableUI>
      </section>
    </div>
  );
};

export default CreateInterviewRoundDetailsView;
