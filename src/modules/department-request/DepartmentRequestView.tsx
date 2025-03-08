import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { DialogForm } from "./chunks/Dialog";
import { columns } from "./columns";
import { useTranslation } from "react-i18next";

const DepartmentRequestView = () => {
  const { data, isFetching } = api.position.getAllDepartmentRequest.useQuery();
  const { t } = useTranslation();
  return (
    <section className="m-4">
      <div className="p-6 bg-white rounded-lg">
        <TableUI
          data={data}
          columns={columns}
          loading={isFetching}
          header={t("title.department-request")}
          columnVisibility={{ createdAt: false }}
          filterColumns={["departmentRequestName"]}
          sortColumn="createdAt"
        >
          <DialogForm isEdit={false} data={null}>
            <Button variant={"secondary"}>
              <PlusIcon className="me-1 w-6 h-6" />
              <span>{t("common.add")}</span>
            </Button>
          </DialogForm>
        </TableUI>
      </div>
    </section>
  );
};

export default DepartmentRequestView;
