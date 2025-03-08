import { CandidateByInterviewId } from "@/api/interview/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DateTimePicker from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  dateTimeSlot: z.date(),
});

export function DialogForm({
  data = null,
  children,
}: {
  data: CandidateByInterviewId | null;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTimeSlot: new Date(),
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-[90%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">F2F Appointment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex w-full gap-4">
          <div className="flex flex-1 gap-4 items-center">
            <span className="text-xs">{t("fields.division-manager")} :</span>
            <p className="bg-[#F6F7F9] px-2 py-3 text-xs text-[#B1B1B1] italic flex-1 rounded-lg">
              {data?.commentApprover || "K.Evano"}
            </p>
          </div>
          <div className="flex flex-1 gap-4 items-center">
            <span className="text-xs">{t("fields.job-position")} :</span>
            <p className="bg-[#F6F7F9] px-2 py-3 text-xs text-[#B1B1B1] italic flex-1 rounded-lg">
              HR
            </p>
          </div>
        </div>
        <Form {...form}>
          <form className="mb-8">
            <li className="list-none flex flex-col items-center gap-8 mt-8">
              <ul className="flex items-center gap-4">
                <Checkbox className="data-[state=checked]:rounded-full data-[state=checked]:bg-success" />

                <FormField
                  control={form.control}
                  name="dateTimeSlot"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-1")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      {/* <FormMessage className="col-start-2" /> */}
                    </FormItem>
                  )}
                />
              </ul>
              <ul className="flex items-center gap-4">
                <Checkbox className="data-[state=checked]:rounded-full data-[state=checked]:bg-success" />

                <FormField
                  control={form.control}
                  name="dateTimeSlot"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-2")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      {/* <FormMessage className="col-start-2" /> */}
                    </FormItem>
                  )}
                />
              </ul>
              <ul className="flex items-center gap-4">
                <Checkbox className="data-[state=checked]:rounded-full data-[state=checked]:bg-success" />

                <FormField
                  control={form.control}
                  name="dateTimeSlot"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-3")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      {/* <FormMessage className="col-start-2" /> */}
                    </FormItem>
                  )}
                />
              </ul>
            </li>
          </form>
        </Form>
        <DialogClose asChild>
          <div className="flex justify-center">
            <Button className="w-28 text-sm" variant={"destructive"}>
              Close
            </Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
