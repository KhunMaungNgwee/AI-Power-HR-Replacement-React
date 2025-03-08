import TableUI from "@/components/table/TableUI";
import { columns } from "./columns";
import { SelectBox } from "@/components/select/Select";
import type { JobRequisitionType } from "@/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SOURCE = [
  { label: "fields.job-requisition", value: "jobRequisition" },
  { label: "fields.position", value: "position" },
  { label: "fields.head-count", value: "headCount" },
  { label: "fields.request-by", value: "requestBy" },
];

const JobRequisitionView = () => {
  const [selectedState, setSelectedState] = useState("jobRequisition");
  const { t } = useTranslation();

  const data: JobRequisitionType[] = [
    {
      jobRequisition: "Software Developer",
      position: "Full Stack Developer",
      headCount: 3,
      requestBy: "John Doe",
      createdAt: "2024-02-01T12:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
    },
    {
      jobRequisition: "Data Analyst",
      position: "Business Analyst",
      headCount: 2,
      requestBy: "Jane Smith",
      createdAt: "2024-03-05T08:30:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
    },
    {
      jobRequisition: "UI/UX Designer",
      position: "Product Designer",
      headCount: 1,
      requestBy: "Alice Johnson",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
    },
    {
      jobRequisition: "DevOps Engineer",
      position: "Site Reliability Engineer",
      headCount: 4,
      requestBy: "Bob Brown",
      createdAt: "2024-01-10T14:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
    },
    {
      jobRequisition: "Project Manager",
      position: "Agile Coach",
      headCount: 1,
      requestBy: "Emily White",
      createdAt: "2024-02-20T10:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
    },
  ];

  return (
    <div>
      <TableUI
        data={data}
        columns={columns}
        loading={false}
        header={t("common.job-requisition")}
        columnVisibility={{ createdAt: false }}
        sortColumn="createdAt"
        filterColumns={[selectedState ? selectedState : SOURCE[0].value]}
        filterColumnsState={true}
      >
        <SelectBox
          placeholder={t("placeholder.job-requisition")}
          options={SOURCE}
          classes="w-fit"
          onChange={setSelectedState}
        />
      </TableUI>
    </div>
  );
};

export default JobRequisitionView;
