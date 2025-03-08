import api from "@/api";
import { JobPositionType } from "@/api/position/types";
import TableUI from "@/components/table/TableUI";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DialogForm } from "./chunks/Dialog";
import { columns } from "./columns/columns";
import { useTranslation } from "react-i18next";

type JobPositionContextType = {
  state: {
    data: JobPositionType | undefined;
    isEdit: boolean;
    isOpen: boolean;
  };
  action: Dispatch<
    SetStateAction<{
      data: JobPositionType | undefined;
      isEdit: boolean;
    }>
  >;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const JobPositionContext = createContext<
  JobPositionContextType | undefined
>(undefined);

const JobPositionView = () => {
  const [currentJobPositionData, setCurrentJobPositionData] = useState<{
    data: JobPositionType | undefined;
    isEdit: boolean;
  }>({ data: undefined, isEdit: false });
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentJobPositionData.isEdit) {
      setIsOpen(true);
    }
  }, [currentJobPositionData.isEdit]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentJobPositionData({ data: undefined, isEdit: false });
    }
  }, [isOpen]);

  const { data, isLoading, refetch } =
    api.position.getAllJobPosition.useQuery();

  const invalidateQueries = () => {
    refetch();
  };

  const memoizedTable = useMemo(
    () => (
      <TableUI
        data={data}
        columns={columns}
        loading={isLoading}
        sortColumn="createdAt"
        header={t("title.job-position")}
        columnVisibility={{ createdAt: false }}
      >
        <Button variant={"secondary"} onClick={() => setIsOpen(true)}>
          <PlusIcon className="me-1 w-6 h-6" />
          <span>{t("common.add")}</span>
        </Button>
      </TableUI>
    ),
    [data, isLoading, i18n.language]
  );

  return (
    <section className="m-4">
      <JobPositionContext.Provider
        value={{
          state: { data: undefined, isEdit: false, isOpen: isOpen },
          action: setCurrentJobPositionData,
          setIsOpen: setIsOpen,
        }}
      >
        <div className="p-6 bg-white rounded-lg">{memoizedTable}</div>
      </JobPositionContext.Provider>
      <DialogForm
        refetch={invalidateQueries}
        isEdit={currentJobPositionData.isEdit}
        data={currentJobPositionData.data}
        setIsEditDialog={setCurrentJobPositionData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <></>
      </DialogForm>
    </section>
  );
};

export default JobPositionView;
