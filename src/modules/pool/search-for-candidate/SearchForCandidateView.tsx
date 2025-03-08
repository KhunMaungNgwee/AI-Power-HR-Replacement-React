import { useEffect, useMemo, useState } from "react";
import { SelectBox } from "@/components/select/Select";
import TableUI from "@/components/table/TableUI";
import { columns } from "./columns/columns";
import api from "@/api";
import { CandidateType } from "@/shared/types";
import { useTranslation } from "react-i18next";

const options = [
  { label: "HR", value: "hr" },
  { label: "Store Social Staff", value: "store-social-staff" },
  { label: "Sports Consultant", value: "sports-consultant" },
];

const SearchForCandidateView = () => {
  const { data, isFetching } = api.candidate.getCandidates.useQuery();
  const { data: ageRangeData } = api.interview.getAllAgeRange.useQuery();
  const [ageRange, setAgeRange] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);

  const [age, setAge] = useState<string>("");
  const { t } = useTranslation();
  const sortAgeRange = (a: { label: string }, b: { label: string }) => {
    const parseMin = (label: string) => parseInt(label.split("-")[0], 10);
    const minA = parseMin(a.label);
    const minB = parseMin(b.label);

    return minA - minB;
  };

  useEffect(() => {
    if (ageRangeData) {
      const ageRanges = ageRangeData.map((age) => {
        return { label: age.ageRange, value: age.ageRange };
      });

      setAgeRange(ageRanges.sort(sortAgeRange));
    }
  }, [ageRangeData]);

  const preprocessData = (
    data: CandidateType[] | undefined
  ): CandidateType[] | undefined => {
    return data?.map((item) => ({
      ...item,
      ageRange: item.ageRange ?? "-",
      educationLevel: item.educationLevel ?? "-",
      province: item.province ?? "-",
      type: item.type ?? "-",
    }));
  };

  const processedData = useMemo(() => preprocessData(data), [data]);

  const handleAgeRangeChange = (value: string) => {
    if (value !== "notSelected") {
      if (
        !ageRange?.some(
          (item) => item.label === "Clear Age" && item.value === "notSelected"
        )
      ) {
        ageRange?.unshift({ label: "Clear Age", value: "notSelected" });
      }
      setAge(value);
    } else {
      ageRange?.shift();
      setAge("");
    }
  };
  const table = (
    <TableUI
      extraQuery={[
        {
          column: "ageRange",
          value: age,
        },
      ]}
      search={true}
      filterColumnsState={true}
      header={t("title.all-candidates")}
      columnVisibility={{ createdAt: false, ageRange: false }}
      columns={columns}
      data={processedData}
      loading={isFetching}
      sortColumn="createdAt"
      tableCellClass="w-[30px]"
      globalFilterEnabled={true}
    >
      <SelectBox
        placeholder="fields.select-age"
        onChange={handleAgeRangeChange}
        value={age}
        options={ageRange || []}
        classes="w-fit"
      />
    </TableUI>
  );

  return (
    <div>
      {table}
      <div className="flex justify-end mt-4">
        <SelectBox
          options={options}
          placeholder="placeholder.add-to-event"
          classes="w-fit"
        />
      </div>
    </div>
  );
};

export default SearchForCandidateView;
