import { Button } from "@/components/ui/button";
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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CandidateType } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import z from "zod";
import { CommentHistory } from "../chunks/CommentHistory";
import { format } from "date-fns";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import { SkeletonLoader } from "../loader/SkeletonLoader";
import { CommentByCandidateIdType } from "@/api/candidate/types";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  commentMessage: z.string().min(2, {
    message: "Message is required!",
  }),
});

export function InterviewCommentDialog({
  data,
  isOpen = false,
  isEdit = false,
  children,
  handleOpenChange,
  comments,
  commentFetching,
}: {
  data: CandidateType;
  isOpen: boolean;
  isEdit: boolean;
  handleOpenChange: (open: boolean) => void;
  comments: CommentByCandidateIdType[] | undefined;
  commentFetching: boolean;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commentMessage: "",
    },
  });

  const { mutate: addInterviewComment } =
    api.candidate.addInterviewComment.useMutation({
      onSuccess: () => {
        toast({
          title: "Interview Comment added successfully",
          variant: "success",
        });

        form.resetField("commentMessage");
        queryClient.invalidateQueries({ queryKey: ["getCommentByCandidate"] });
      },

      onError: (error) => {
        console.error("Error adding department request: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      candidateID: data.candidateID,
      commentedByID: "00000000-0000-0000-0000-000000000000",
    };
    addInterviewComment(payload);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div>{children}</div>
      <DialogContent className="lg:max-w-[860px] max-h-[65%] gap-2 overflow-auto">
        <DialogHeader>
          <DialogTitle className="first-letter:text-primary mb-4 text-2xl">
            {t("pool.interview-comment")}
          </DialogTitle>

          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border-accent pb-4 space-y-4 border-b"
          >
            <FormField
              control={form.control}
              name="commentMessage"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-lg font-semibold tracking-tight">
                    {t("fields.comment-to-candidate")}:
                  </FormLabel>

                  <div className="flex gap-10 mt-2 text-sm">
                    <div className="flex gap-4">
                      <h6 className="font-medium text-black">
                        {t("fields.candidate-name")}
                      </h6>
                      <span className="text-muted">{data?.name || ""}</span>
                    </div>

                    <div className="flex gap-4">
                      <h6 className="font-medium text-black">
                        {t("fields.job")}
                      </h6>
                      <span className="text-muted">
                        {data?.jobPosition || "-"}
                      </span>
                    </div>
                  </div>

                  <FormControl>
                    <Textarea
                      className="h-[175px] bg-[#F6F7F9]"
                      placeholder="Type your comment here.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section className="flex justify-between gap-2">
              <div className="text-muted italic">
                <div className=" flex gap-1 text-xs">
                  <p>{t("common.division-comment-by")}:</p>
                  <p>K.Evano</p>
                </div>

                <div className="flex gap-1 text-[10px]">
                  <p>{t("common.date-comment")}:</p>
                  <p>{format(new Date(Date.now()), "dd LLL yyyy")}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!isEdit) {
                        form.reset({ commentMessage: "" });
                      }
                    }}
                    variant={"outline"}
                  >
                    {t("common.cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="hover:bg-secondary/70 bg-secondary"
                  variant={"secondary"}
                >
                  {t("common.submit")}
                </Button>
              </div>
            </section>
          </form>
        </Form>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">
            {t("common.interview-comment-history")}:
          </h3>
          <div className="space-y-2">
            {commentFetching ? (
              <SkeletonLoader />
            ) : comments && comments.length !== 0 ? (
              comments.map((comment, index) => (
                <CommentHistory
                  key={index}
                  date={format(comment.createdAt, "dd LLL yyyy")}
                  divisionManager={"K.Evno"}
                  comment={comment.commentMessage}
                />
              ))
            ) : (
              <p className="text-sm mb-8 ps-1 min-h-16">
                {t(`dialog-desc.no-comment`)}
              </p>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
