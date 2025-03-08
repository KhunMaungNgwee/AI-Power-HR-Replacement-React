import { F2FSlotType } from "@/api/line2/types";
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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  dateTimeSlot1: z.date(),
  dateTimeSlot2: z.date(),
  dateTimeSlot3: z.date(),
});

export function DialogForm({
  data = undefined,
  open,
  setOpen,
  children,
}: {
  data: F2FSlotType | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState<
    | { slotOneFlag: boolean; slotTwoFlag: boolean; slotThreeFlag: boolean }
    | undefined
  >(undefined);

  const combineDateAndTime = (
    dateString: string | undefined,
    timeString: string | undefined
  ): Date | undefined => {
    if (!dateString || !timeString) return undefined;
    const datePart = new Date(dateString);
    const timePart = new Date(timeString);

    if (isNaN(datePart.getTime()) || isNaN(timePart.getTime()))
      return undefined;

    // Combine date and time parts
    datePart.setHours(timePart.getHours());
    datePart.setMinutes(timePart.getMinutes());
    datePart.setSeconds(0); // Optional: Reset seconds to 0
    datePart.setMilliseconds(0); // Optional: Reset milliseconds to 0

    return datePart;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTimeSlot1: combineDateAndTime(data?.slotDate1, data?.slotTime1),
      dateTimeSlot2: combineDateAndTime(data?.slotDate2, data?.slotTime2),
      dateTimeSlot3: combineDateAndTime(data?.slotDate3, data?.slotTime3),
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        dateTimeSlot1: combineDateAndTime(data?.slotDate1, data?.slotTime1),
        dateTimeSlot2: combineDateAndTime(data?.slotDate2, data?.slotTime2),
        dateTimeSlot3: combineDateAndTime(data?.slotDate3, data?.slotTime3),
      });

      setSelectedSlot({
        slotOneFlag: data?.selectSlot1Flag,
        slotTwoFlag: data?.selectSlot2Flag,
        slotThreeFlag: data?.selectSlot3Flag,
      });
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div>{children}</div>
      <DialogContent className="sm:max-w-[825px] max-h-[90%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("dialog-title.f2f-title")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex w-full gap-4">
          <div className="flex flex-1 gap-4 items-center">
            <span className="text-xs">{t("fields.division-manager")} :</span>
            <p className="bg-[#F6F7F9] px-2 py-3 text-xs text-[#B1B1B1] italic flex-1 rounded-lg">
              {data?.divisionManager}
            </p>
          </div>
          <div className="flex flex-1 gap-4 items-center">
            <span className="text-xs">{t("fields.job-position")} :</span>
            <p className="bg-[#F6F7F9] px-2 py-3 text-xs text-[#B1B1B1] italic flex-1 rounded-lg">
              {data?.jobPosition}
            </p>
          </div>
        </div>
        <Form {...form}>
          <form className="mb-8">
            <li className="list-none flex flex-col items-center gap-8 mt-8">
              <ul className="flex items-center gap-4">
                <Checkbox
                  className="data-[state=checked]:rounded-full data-[state=checked]:bg-success"
                  checked={selectedSlot?.slotOneFlag || false}
                />

                <FormField
                  control={form.control}
                  name="dateTimeSlot1"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-1")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          readonly={true}
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
                <Checkbox
                  className="data-[state=checked]:rounded-full data-[state=checked]:bg-success"
                  checked={selectedSlot?.slotTwoFlag || false}
                />

                <FormField
                  control={form.control}
                  name="dateTimeSlot2"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-2")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          readonly={true}
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
                <Checkbox
                  className="data-[state=checked]:rounded-full data-[state=checked]:bg-success"
                  checked={selectedSlot?.slotThreeFlag || false}
                />

                <FormField
                  control={form.control}
                  name="dateTimeSlot3"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <FormLabel>{t("fields.slot-3")} :</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          readonly={true}
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
              {t("common.close")}
            </Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
