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
import { Form } from "@/components/ui/form";
import { CandidateDetailsType } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DocReaderIcon } from "@/modules/interview-rounds/view-details/chunks/icons/DocReaderIcon";
import { Input } from "@/components/ui/input";
import DocClipBoardIcon from "@/modules/on-board/chunks/icons/DocClipBoardIcon";
import { CheckCircle2Icon, CircleAlert, Pencil } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import api from "@/api";
import { useState, useEffect, SetStateAction } from "react";
import FileUploadDialog from "@/components/dialogs/FileUploadDialog";
import {
  DocumentUploadPayloadType,
  FilterType,
  UploadDocType,
  UploadedDocumentListType,
  UploadIntoType,
} from "@/api/upload-into/types";
import i18next from "i18next";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const formSchema = z.object({
  documentUrl: z.string().optional(),
});

export function DocumentUpload({
  candidate = null,
  uploadDocTypeData,
  open,
  setOpen,
  setOpenScoreCheck,
  children,
  uploadIntoData,
}: {
  candidate?: CandidateDetailsType | null;
  uploadDocTypeData: UploadDocType;
  open?: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setOpenScoreCheck: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  uploadIntoData: UploadIntoType;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentUrl: undefined,
    },
  });

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [file, setFile] = useState<string | undefined>("");
  const [uploadedDocumentList, setUploadedDocumentList] = useState<
    UploadedDocumentListType[] | FilterType[] | null | undefined
  >(undefined);
  const [selectedDocumentMasterID, setSelectedDocumentMasterID] =
    useState<string>("");
  const [filteredDocumentList, setFilteredDocumentList] = useState<
    FilterType[] | undefined
  >(undefined);
  const [comment, setComment] = useState<string>("");

  const { data: masterDocumentData } =
    api.uploadInto.getAllMasterDocumentList.useQuery();

  const { data: uploadedDocumentData } =
    api.uploadInto.getDocumentUploadByID.useQuery(
      candidate?.candidateID as string,
      {
        queryKey: ["getDocumentUploadByID"],
        enabled: !!candidate?.candidateID,
      }
    );

  useEffect(() => {
    if (uploadedDocumentData) {
      setUploadedDocumentList(uploadedDocumentData.uploadedDocUrlList);
    }
  }, [uploadedDocumentData]);

  useEffect(() => {
    if (uploadedDocumentList && selectedDocumentMasterID) {
      const filteredList = uploadedDocumentList.filter(
        (doc) => doc.documentMasterID === selectedDocumentMasterID
      );

      setFilteredDocumentList(filteredList);
    }
  }, [uploadedDocumentList]);

  useEffect(() => {
    if (isEdit && selectedDocumentMasterID && uploadedDocumentList?.length) {
      const filteredList = uploadedDocumentList.filter(
        (doc) => doc.documentMasterID === selectedDocumentMasterID
      );

      setFilteredDocumentList(filteredList);
    } else {
      setFilteredDocumentList(undefined);
    }
  }, [isEdit, selectedDocumentMasterID, filteredDocumentList?.toString()]);

  useEffect(() => {
    if (file) {
      setUploadedDocumentList((prevList) => {
        const newList = [
          ...(prevList || []), // Keep all existing items
          {
            documentUrlID: Date.now().toString(),
            documentMasterID: selectedDocumentMasterID,
            documentUrl: file, // Add the new file
          },
        ];

        // Update the filtered list
        const filteredList = newList.filter(
          (doc) => doc.documentMasterID === selectedDocumentMasterID
        );

        setFilteredDocumentList(filteredList); // Separate filtered list
        return newList;
      });

      setFile("");
    }
  }, [file]);

  useEffect(() => {
    if (uploadedDocumentData?.comment) {
      setComment(uploadedDocumentData.comment);
    }
  }, [uploadedDocumentData]);

  const { mutate: addDocumentUpload } =
    api.uploadInto.addDocumentUpload.useMutation({
      onSuccess: () => {
        toast({
          title: "Document Upload added successfully",
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["getDocumentUploadByID"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getUploadIntoById"],
        });
        setOpen(false);
        setIsEdit(false);
      },
      onError: (error) => {
        console.error("Error adding Document Upload: ", error);

        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const onSubmit = () => {
    if (uploadedDocumentList && candidate && uploadDocTypeData) {
      const uploadedDocUrlList = uploadedDocumentList.map(
        ({ documentMasterID, documentUrl }) => ({
          documentMasterID,
          documentUrl,
        })
      );

      const payload: DocumentUploadPayloadType = {
        candidateID: candidate?.candidateID,
        comment: comment,
        commentedMemberID: uploadIntoData.recruiterID,
        dueDate: uploadDocTypeData?.dueDate,
        uploadIntoID: uploadDocTypeData?.uploadIntoID,
        uploadedDocUrlList: uploadedDocUrlList,
      };

      addDocumentUpload(payload);
    }
  };
  const handleUpload = (url: string) => {
    setFile(url);
  };

  const handleRemove = (id: string | undefined) => {
    const updatedList = uploadedDocumentList?.filter(
      (item) => item.documentUrlID !== id
    );
    setUploadedDocumentList(updatedList);
    setFile("");
  };

  const handleOnClick = (docMasterID: string) => {
    setSelectedDocumentMasterID(docMasterID);
  };

  const handleScoreCheck = () => {
    setOpen(false);
    setOpenScoreCheck(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[850px] max-h-[90%] text-xs">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("fields.document-upload")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-x-2 border-b">
          <div className="col-span-5 flex items-center gap-4">
            <div>
              <Link
                to={`/candidate-information/${candidate?.candidateID}`}
                state={{ from: "/upload-into/" }}
              >
                <Button variant={"columnIcon"} size="icon">
                  <DocClipBoardIcon />
                </Button>
              </Link>

              <Button
                variant={"columnIcon"}
                size="icon"
                onClick={handleScoreCheck}
              >
                <DocReaderIcon width="21" height="23" />
              </Button>
            </div>
            <span className="font-semibold col-span-1">
              {t("interview-rounds.candidate-name")}
            </span>
            <div className="flex gap-5 col-span-2 items-center">
              <span className="text-gray-400">
                {candidate?.firstname + " " + candidate?.lastname}
              </span>
            </div>
          </div>

          {uploadedDocumentData?.approveDate ? (
            <div className="col-span-4 flex items-center gap-2">
              <span className="font-semibold">
                {t("on-board.approve-date")}
              </span>
              <span className="text-gray-400">
                {format(new Date(uploadedDocumentData?.approveDate), "h ':' m")}{" "}
                | {format(new Date(uploadedDocumentData?.approveDate), "P")}
                {format(
                  new Date(uploadedDocumentData?.approveDate),
                  "h ':' m"
                )}{" "}
                | {format(new Date(uploadedDocumentData?.approveDate), "P")}
              </span>
            </div>
          ) : null}

          <div className="col-start-10 col-span-3 flex items-center gap-2">
            {uploadDocTypeData.status === "Waiting for Candidate" ? (
              <>
                <CircleAlert fill="#EE9923" color="white" />
                <span className="text-warning">
                  {t("common.waiting-for-candidate")}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2Icon fill="#00AC4F" color="white" />
                <span className="text-success">{t("common.completed")}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 items-center">
          <h1 className="text-xl font-semibold">
            {t("fields.document-upload")}
          </h1>
          <div className="flex justify-between items-center">
            <span>{t("fields.due-date")}</span>
            <span className="border rounded-lg w-[240px] px-4 py-3 bg-gray-50 text-gray-500">
              {format(
                new Date(uploadedDocumentData?.dueDate || Date.now()),
                "h ':' m"
              )}{" "}
              |{" "}
              {format(
                new Date(uploadedDocumentData?.dueDate || Date.now()),
                "P"
              )}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form className="grid grid-cols-2 gap-y-4 border-b-2 border-b-[#9D0A0A]">
            <div className="border-r p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h6>{t("fields.document-lists")}</h6>
                <div className="flex items-center">
                  <Button
                    type="button"
                    className="text-gray-500 text-xs"
                    size={"icon"}
                    variant={"columnIcon"}
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    <Pencil color="#6b7280" />
                  </Button>
                  <span className="text-gray-500">Edit</span>
                </div>
              </div>
              {masterDocumentData &&
                masterDocumentData.map((item, index) => (
                  <div
                    className="flex items-center gap-2"
                    key={item.documentMasterID}
                  >
                    <Button
                      type="button"
                      className={`${
                        item.documentMasterID === selectedDocumentMasterID &&
                        isEdit
                          ? "border-destructive border-2"
                          : "bg-[#F6F7F9]"
                      } w-full text-left items-start`}
                      variant="ghost"
                      onClick={() => handleOnClick(item.documentMasterID)}
                      disabled={!isEdit}
                    >
                      {index + 1}:{" "}
                      {i18next.language === "en" ? item.name_En : item.name_Th}
                    </Button>
                  </div>
                ))}
            </div>
            <div className="p-4 pt-9 flex flex-col gap-2">
              <label
                htmlFor="documentUpload"
                className="text-nowrap text-gray-500"
              >
                {t("fields.document-upload")}
              </label>
              <div className="flex w-full">
                <Input
                  name="documentUrl"
                  defaultValue={file}
                  id="documentUpload"
                  className="col-span-8 text-xs rounded-r-none rounded-l-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />

                <FileUploadDialog onFileUpload={handleUpload}>
                  <Button
                    disabled={
                      !isEdit ||
                      selectedDocumentMasterID === "" ||
                      uploadedDocumentData?.status === "Completed" ||
                      uploadedDocumentData?.status === "Approved"
                    }
                    className="rounded-r-lg rounded-l-none bg-gray-400 hover:bg-gray-400 text-xs"
                  >
                    Upload File
                  </Button>
                </FileUploadDialog>
              </div>
              <div className="flex flex-col gap-4 h-60 overflow-y-scroll">
                {filteredDocumentList &&
                  filteredDocumentList.map((item) => {
                    const fileName = item.documentUrl?.split("/").pop();
                    return (
                      <div
                        className="flex items-center justify-between gap-2 pr-3"
                        key={item.documentUrlID}
                      >
                        <p className="flex-1 break-all">{fileName}</p>
                        {uploadDocTypeData.status ===
                          "Waiting for Candidate" && (
                          <Cross1Icon
                            className="cursor-pointer text-destructive h-5 w-5 flex-shrink-0"
                            onClick={() => handleRemove(item.documentUrlID)}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-between items-center text-gray-500 mt-auto">
                <span className="flex-1">{t("fields.date-update")}</span>
                <span className="flex-1">
                  {format(
                    new Date(uploadedDocumentData?.updatedAt || Date.now()),
                    "h ':' m"
                  )}{" "}
                  |{" "}
                  {format(
                    new Date(uploadedDocumentData?.updatedAt || Date.now()),
                    "P"
                  )}
                </span>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-8">
            <span className="font-semibold col-span-1">
              {t("fields.recruiter-interview")} :
            </span>
            <div className="flex gap-5 col-span-2 items-center">
              <span className="text-gray-400">
                {uploadIntoData.recruiterName}
              </span>
              <span className="text-gray-400">
                {uploadIntoData.recruiterName}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="grid grid-cols-3 gap-2 col-span-7 items-center">
              <label
                htmlFor="comment"
                className="col-span-1 text-black font-semibold"
              >
                {t("fields.comment")} :
              </label>
              <Input
                id="comment"
                className="bg-[#F6F7F9] text-xs text-gray-400 col-span-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="gap-4 col-span-5 grid grid-cols-2">
              {uploadedDocumentData?.status !== "Completed" && (
                <Button
                  className="min-w-28 text-xs border-secondary hover:border-secondary text-secondary hover:text-secondary"
                  variant={"outline"}
                  onClick={onSubmit}
                  disabled={
                    !uploadedDocumentList ||
                    uploadedDocumentList.length === 0 ||
                    uploadedDocumentData?.status === "Completed"
                  }
                >
                  {t("common.submit")}
                </Button>
              )}
              <DialogClose asChild>
                <Button
                  className="col-start-2 w-28 text-xs"
                  variant={"destructive"}
                >
                  {uploadedDocumentData?.status === "Completed" ||
                  (uploadedDocumentData && uploadedDocumentData.approveDate)
                    ? t("common.back")
                    : t("common.cancel")}
                </Button>
              </DialogClose>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
