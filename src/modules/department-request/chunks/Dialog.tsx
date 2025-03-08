import api from "@/api";
import {
  DepartmentRequestType,
  UpdateDepartmentRequestType,
} from "@/api/position/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  departmentRequestName: z.string().min(2, {
    message: t("err-msg.department-request-name-field-err"),
  }),
  address: z.string().min(2, {
    message: t("err-msg.address-field-err"),
  }),
});

export function DialogForm({
  isEdit = false,
  data = null,
  children,
}: {
  isEdit: boolean;
  data: DepartmentRequestType | null;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentRequestName: data?.departmentRequestName || "",
      address: data?.address || "",
    },
  });

  const { mutate: addDepartmentRequest } =
    api.position.addDepartmentRequest.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.add-success", { data: "Department request" }),
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getAllDepartmentRequest"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error adding department request: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: updateDepartmentRequest } =
    api.position.editDepartmentRequest.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.update-success", {
            data: "Department request",
          }),
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getAllDepartmentRequest"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error updating department request: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = isEdit
      ? { ...values, departmentRequestID: data?.departmentRequestID }
      : values;

    if (isEdit) {
      updateDepartmentRequest(payload as UpdateDepartmentRequestType);
    } else {
      addDepartmentRequest(payload);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("title.department-request-update")
              : t("title.department-request-add")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="departmentRequestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.department-request-name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.department-request-name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {t("fields.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fields.address")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => {
                    if (!isEdit) {
                      form.reset({ departmentRequestName: "", address: "" });
                    }
                  }}
                  variant={"outline"}
                >
                  {t("common.cancel")}
                </Button>
              </DialogClose>
              <Button type="submit" variant={"secondary"}>
                {t("common.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
