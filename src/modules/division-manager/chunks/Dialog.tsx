import api from "@/api";
import {
  DivisionManagerType,
  UpdateDivisionManagerType,
} from "@/api/position/types";
import { Button } from "@/components/ui/button";
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
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  phoneNumber: z
    .string()
    .min(6, { message: "Phone number must be at least 6" }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  lineCode: z.string().min(2, {
    message: "Line Code must be at least 2 characters.",
  }),
  lineUserID: z.string().optional(),
});

export function DialogForm({
  isEdit = false,
  data = null,
  children,
}: {
  isEdit: boolean;
  data: DivisionManagerType | null;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber || "",
      position: data?.position || "",
      lineCode: data?.lineCode || "",
      lineUserID: data?.lineUserID || "",
    },
  });

  const { mutate: addDivisionManager } =
    api.position.addDivisionManager.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.add-success", { data: "Division Manager" }),
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getAllDivisionManager"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error adding division manager: ", error);
        form.setError("lineCode", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: updateDivisionManager } =
    api.position.editDivisionManager.useMutation({
      onSuccess: () => {
        toast({
          title: t("success-msg.update-success", { data: "Division Manager" }),
          variant: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["getAllDivisionManager"],
        });

        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error updating division manager: ", error);
        form.setError("lineCode", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = isEdit
      ? { ...values, divisionManagerID: data?.divisionManagerID }
      : values;

    if (isEdit) {
      updateDivisionManager(payload as UpdateDivisionManagerType);
    } else {
      addDivisionManager(payload);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("title.division-manager-update")
              : t("title.division-manager-add")}
          </DialogTitle>

          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.first-name")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.first-name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.last-name")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.last-name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.email")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.phoneNumber")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.position")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.position")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lineCode"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.line-code")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("fields.line-code")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lineUserID"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("fields.line-user-id")}</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        fieldState.error?.message &&
                        "border border-destructive focus:border-none"
                      }
                      placeholder={t("placeholder.line-user-id")}
                      {...field}
                    />
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
                      form.reset({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phoneNumber: "",
                        position: "",
                        lineCode: "",
                        lineUserID: "",
                      });
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
