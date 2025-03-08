import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { columns, columnVisibility } from "./columns";
import { SelectBox } from "@/components/select/Select";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";
import ScoreColumn from "@/modules/interview-rounds/view-details/chunks/ScoreColumn";
import { CandidateType } from "@/shared/types";
import { useTranslation } from "react-i18next";

const SOURCE = [
  { label: "fields.name", value: "name" },
  { label: "fields.phoneNumber", value: "phoneNumber" },
  { label: "fields.email", value: "email" },
  { label: "fields.source", value: "source" },
  { label: "fields.job", value: "job" },
  { label: "fields.type", value: "type" },
];

type CheckScoreDialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  candidateID: string | undefined;
  setCandidateID: React.Dispatch<SetStateAction<string | undefined>>;
} | null;

export const CheckScoreDialogContext =
  createContext<CheckScoreDialogContextType>(null);

const CheckDocumentsView = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState("");
  const { t } = useTranslation();
  const [candidateID, setCandidateID] = useState<string | undefined>(undefined);
  const { data, isFetching } = api.candidate.getCandidates.useQuery();
  const checkScoreDialogState = useContext(CheckScoreDialogContext);

  const preprocessData = (
    data: CandidateType[] | undefined
  ): CandidateType[] | undefined => {
    return data?.map((item) => ({
      ...item,
      job: item.jobPosition ?? "-",
      type: item.type ?? "-",
    }));
  };

  const processedData = preprocessData(data);

  return (
    <div>
      <CheckScoreDialogContext.Provider
        value={{ open, setOpen, candidateID, setCandidateID }}
      >
        <TableUI
          globalFilterEnabled={false}
          data={processedData}
          columns={columns}
          loading={isFetching}
          header={t("common.all-candidates")}
          columnVisibility={columnVisibility}
          filterColumns={[selectedState ? selectedState : SOURCE[0].value]}
          filterColumnsState={true}
          sortColumn="createdAt"
          tableCellClass="w-[30px]"
        >
          <SelectBox
            placeholder={"placeholder.filter-by-name"}
            options={SOURCE}
            classes="w-fit"
            onChange={setSelectedState}
          />
        </TableUI>
      </CheckScoreDialogContext.Provider>
      <ScoreColumn
        candidateID={checkScoreDialogState?.candidateID}
        open={open}
        setOpen={setOpen}
        useF2FInterview={false}
      >
        <></>
      </ScoreColumn>
    </div>
  );
};

export default CheckDocumentsView;
