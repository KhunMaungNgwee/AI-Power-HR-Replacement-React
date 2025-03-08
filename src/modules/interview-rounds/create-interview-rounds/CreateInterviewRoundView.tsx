import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useState } from "react";
import { columns, columnVisibility } from "./columns";
import InterviewRoundFormDialog from "./dialogs/InterviewRoundFormDialog";

const CreateInterviewRoundView = () => {
  const { data, isFetching } = api.interview.getAllInterviewRound.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <TableUI
        data={data}
        columns={columns}
        loading={isFetching}
        sort={false}
        search={false}
        columnVisibility={columnVisibility}
      >
        <section className="w-full pb-2">
          <InterviewRoundFormDialog
            isEdit={false}
            open={dialogOpen}
            setOpen={setDialogOpen}
          >
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              + {t("common.new")}
            </Button>
          </InterviewRoundFormDialog>
        </section>
      </TableUI>
    </div>
  );
};

export default CreateInterviewRoundView;
