import api from "@/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  ChangeEvent,
  DragEvent as ReactDragEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { PDFViewer } from "../viewers";
import { PlusIcon } from "lucide-react";

type MultipleFileUploadDialogType = {
  allowedTypes?: string[];
  children: ReactNode;
  multiple?: boolean;
  onFileUpload: (urls: string[]) => void;
};

const MultipleFileUploadDialog = ({
  allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
  multiple = false,
  children,
  onFileUpload,
}: MultipleFileUploadDialogType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { mutateAsync: uploadFileDocument } =
    api.auth.uploadFileDocument.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
    });

  const handleSelectFile = () => fileInputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      setFile((prev) => {
        if (prev) {
          return [...prev, ...Array.from(files)];
        }
        return Array.from(files);
      });

      fileInputRef.current!.value = "";
    }
  };

  const onDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);

    event.dataTransfer!.dropEffect = "copy";
  };

  const onDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < Array.from(files).length; i++) {
      if (files[i].type.split("/")[0] != "image") continue;
      setFile((prev) => {
        if (prev) {
          return [...prev, ...Array.from(files)];
        }
        return Array.from(files);
      });
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        // Create an array of promises for each file upload
        const uploadPromises = Array.from(file).map((singleFile) =>
          uploadFileDocument(singleFile)
        );

        // Wait for all uploads to complete
        const uploadedFiles = await Promise.all(uploadPromises);

        // Process the returned data

        onFileUpload(uploadedFiles.map((item) => item.file));
        // Close modal and reset file state
        setIsOpen(false);
        setFile(null);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[800px] max-h-[600px] rounded-lg p-2 py-6 pt-12 bg-white">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex flex-col items-center gap-4">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "flex flex-wrap justify-center items-center w-11/12 max-w-[800px] h-[400px] sm:w-10/12 rounded-xl border-2 border-dashed border-gray-400 relative",
              isDragging ? "border-secondary" : ""
            )}
          >
            <div className="w-full h-full grid grid-cols-3 overflow-y-auto p-6 gap-4">
              {file ? (
                Array.from(file).map((file, index) => (
                  <div
                    key={index}
                    className="flex p-4 gap-2 relative border rounded h-[160px]"
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-5 h-5 rounded-full absolute top-4 translate-y-[-50%] right-4 translate-x-[50%]"
                      onClick={() =>
                        setFile((prev) => {
                          if (prev) {
                            return prev.length === 1
                              ? null
                              : prev.filter((item) => item.name !== file.name);
                          }
                          return prev;
                        })
                      }
                    >
                      <Cross2Icon className="w-3 h-3 font-bold text-white" />
                    </Button>
                    {file.type === "application/pdf" ? (
                      <PDFViewer
                        pdfLink={URL.createObjectURL(file)}
                        rotatePoint={0}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Image File"
                        className="object-contain w-full h-full"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="min-h-[320px] flex flex-col items-center justify-center gap-2 col-span-3">
                  <p className="px-1 text-sm text-center">
                    {t("upload.select-or-drag-and-drop-here")}
                  </p>
                  <p className="text-xs text-center px-3 text-[#666]">
                    {t("upload.image-pdf-type-less-than-10mb")}
                  </p>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:text-secondary/80 active:text-secondary/80 mt-3"
                    onClick={handleSelectFile}
                  >
                    {t("common.select-file")}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {file ? (
            <div className="flex gap-2 items-center justify-center">
              <Button
                variant="outline"
                className="border-secondary text-secondary hover:text-secondary/80 active:text-secondary/80"
                onClick={handleSelectFile}
              >
                <PlusIcon /> {t("upload.add-more-files")}
              </Button>
              <Button onClick={handleUpload}>{t("common.upload")}</Button>
            </div>
          ) : (
            <Button onClick={handleUpload}>{t("common.upload")}</Button>
          )}
        </div>
      </DialogContent>

      <input
        multiple={multiple}
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={onFileChange}
        className="hidden"
        aria-label="File Selector"
      />
    </Dialog>
  );
};

export default MultipleFileUploadDialog;
