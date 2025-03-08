import api from "@/api";
import { UpdateCandidateDocumentPayload } from "@/api/candidate/types";
import cvFormIcon from "@/assets/icons/cv-form.svg";
import cvFormWhiteIcon from "@/assets/icons/cv-form-white.svg";
import educationQualificationWhiteIcon from "@/assets/icons/education-qualification-white.svg";
import educationQualificationIcon from "@/assets/icons/education-qualification.svg";
import houseRegistrationWhiteIcon from "@/assets/icons/house-registration-white.svg";
import houseRegistrationIcon from "@/assets/icons/house-registration.svg";
import idCardWhiteIcon from "@/assets/icons/id-card-white.svg";
import idCardIcon from "@/assets/icons/id-card.svg";
import FileUploadDialog from "@/components/dialogs/FileUploadDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CandidateDetailsType } from "@/shared/types";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
  BadgeAlert,
  BadgeCheck,
  CloudOffIcon,
  CloudUploadIcon,
  FileSpreadsheet,
  PencilIcon,
  SearchIcon,
} from "lucide-react";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

type DetailsBlockType = {
  data?: CandidateDetailsType;
  isReview?: boolean;
  isUploadInto?: boolean;
  isEditing?: boolean;
  setIsEditing?: React.Dispatch<SetStateAction<boolean>>;
  activeCard: number;
  changeActiveCard: (index: number) => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CandidateDetailsType, Error>>;
};

type FieldType =
  | "cvUrl"
  | "idCardUrl"
  | "houseRegistrationUrl"
  | "educationLevelUrl";

type CardType = {
  icon: string;
  activeIcon: string;
  text: string;
  type: string;
  field: FieldType;
  disabled: boolean;
};

const INFORMATION_CARDS: CardType[] = [
  {
    icon: idCardIcon,
    activeIcon: idCardWhiteIcon,
    text: "common.id-card",
    type: "IdCard",
    field: "idCardUrl" as FieldType,
    disabled: false,
  },
  {
    icon: houseRegistrationIcon,
    activeIcon: houseRegistrationWhiteIcon,
    text: "common.house-registration",
    type: "HouseRegistration",
    field: "houseRegistrationUrl" as FieldType,
    disabled: false,
  },
  {
    icon: educationQualificationIcon,
    activeIcon: educationQualificationWhiteIcon,
    text: "common.education-qualification",
    type: "EducationQualification",
    field: "educationLevelUrl" as FieldType,
    disabled: false,
  },
  {
    icon: cvFormIcon,
    activeIcon: cvFormWhiteIcon,
    text: "common.cv-form",
    type: "CV",
    field: "cvUrl" as FieldType,
    disabled: false,
  },
];

const DetailsBlock = ({
  data,
  activeCard,
  changeActiveCard,
  refetch,
  isEditing,
  isReview = false,
  isUploadInto = false,
  setIsEditing,
}: DetailsBlockType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState<CardType[]>(INFORMATION_CARDS);

  const cardsStatus = useMemo(
    () => [
      Boolean(data?.idCardUrl),
      Boolean(data?.houseRegistrationUrl),
      Boolean(data?.educationLevelUrl),
      Boolean(data?.cvUrl),
    ],
    [data]
  );

  useEffect(() => {
    setCards((prev) => {
      return prev.map((card) => {
        if (card.type === "CV") {
          return { ...card, disabled: data?.type !== "HO" };
        }
        return card;
      });
    });
  }, [data]);

  const { mutate: updateCandidateDocument } =
    api.candidate.updateCandidateDocument.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        refetch();

        toast({
          variant: "success",
          title: t("success-title.update"),
          description: t("success-msg.update"),
        });
      },
      onError: (error: Error) => {
        console.error(error);

        toast({
          variant: "destructive",
          title: t("error-title.update"),
          description: t("error-msg.update"),
        });
      },
    });

  const { mutate: updateStatusDocument } =
    api.candidate.updateStatusDocument.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSettled: () => dispatch(hideLoader()),
      onSuccess: () => {
        toast({
          variant: "success",
          title: t("success-title.update"),
          description: t("success-msg.update"),
        });

        navigate("/pool/check-documents");
      },
      onError: (error: Error) => {
        console.error(error);

        toast({
          variant: "destructive",
          title: t("error-title.update"),
          description: t("error-msg.update"),
        });
      },
    });

  const handleFileUpload = (url: string, field: FieldType) => {
    const payload: UpdateCandidateDocumentPayload = {
      candidateID: id!,
      documentID: data?.documentID || 0,
      cvUrl: data?.cvUrl || "",
      educationLevelUrl: data?.educationLevelUrl || "",
      houseRegistrationUrl: data?.houseRegistrationUrl || "",
      idCardUrl: data?.idCardUrl || "",
    };

    payload[field] = url;

    updateCandidateDocument(payload);
  };

  const handleApprove = () => {
    updateStatusDocument(id!);
  };

  return (
    <section className="flex-nowrap flex items-center justify-around gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-stretch w-full gap-4">
        <div className="flex flex-col items-center justify-between">
          <Avatar className="min-w-[80px] mt-4 h-auto aspect-square">
            <AvatarImage src={data?.profileUrl || ""} alt="profile image" />
            <AvatarFallback className="text-xl capitalize">
              {`${data?.firstname?.[0]?.toUpperCase() || ""}${
                data?.lastname?.[0]?.toUpperCase() || ""
              }`}
            </AvatarFallback>
          </Avatar>

          {!isUploadInto && (
            <Button
              variant={activeCard === 0 ? "default" : "secondaryOutline"}
              className="h-6 px-2 text-xs font-medium rounded-sm"
              size="sm"
              onClick={() => changeActiveCard(0)}
            >
              <FileSpreadsheet />
              {t("candidate.profile-checklist")}
            </Button>
          )}
        </div>

        <div className="grid w-full grid-cols-4 gap-4">
          <div className="mt-2">
            <h6 className="text-sm font-semibold">
              {t("common.name")}: {data?.firstname}
            </h6>
            <h6 className="mb-3 text-sm font-semibold">
              {t("common.last-name")}: {data?.lastname}
            </h6>

            <p className="text-muted text-xs">{data?.phoneNumber}</p>
            <p className="text-muted text-xs break-all">{data?.email}</p>
            <p className="text-muted text-xs break-all">
              {t("common.education-qualification")} :{" "}
              {data?.educationalQualification}
            </p>
            <p className="text-muted text-xs break-all">
              {t("common.province")} : {data?.province}
            </p>
          </div>

          <div className="grid items-stretch justify-center max-w-xl grid-cols-4 col-span-3 gap-4 mx-auto">
            {cards.map((card, index) => (
              <div
                key={card.text}
                data-active={activeCard === index + 1}
                aria-disabled={card.disabled}
                className="bg-accent rounded-xl aspect-square flex flex-col items-center w-full gap-2 p-2 shadow resize-none max-h-[140px] aria-disabled:bg-black/50 data-[active=true]:bg-primary data-[active=true]:text-white group"
              >
                {!card.disabled ? (
                  <div className="place-self-end w-[10px] h-[10px]">
                    {cardsStatus[index] ? (
                      <BadgeCheck className="size-3 text-success group-data-[active=true]:text-white rounded-full shadow" />
                    ) : (
                      <BadgeAlert className="size-3 text-destructive group-data-[active=true]:text-white rounded-full shadow" />
                    )}
                  </div>
                ) : (
                  <div className="place-self-end w-[10px] h-[10px]"></div>
                )}

                <div className="flex flex-col items-center justify-center gap-3 my-auto">
                  <img
                    src={activeCard === index + 1 ? card.activeIcon : card.icon}
                    alt="Card Icon"
                    className="w-8 h-8 mt-auto"
                  />

                  <h5
                    className={cn(
                      "xl:text-[0.8rem] text-xs text-center",
                      activeCard === index + 1 && "font-medium"
                    )}
                  >
                    {t(card.text)}
                  </h5>
                </div>

                {card.disabled ? (
                  <div className="flex items-center gap-3 mt-auto">
                    <CloudOffIcon className="size-3.5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-auto">
                    <SearchIcon
                      className="hover:scale-125 active:scale-125 size-3 transition-transform cursor-pointer"
                      onClick={() => changeActiveCard(index + 1)}
                    />

                    {(isEditing || isUploadInto) && (
                      <FileUploadDialog
                        onFileUpload={(url: string) =>
                          handleFileUpload(url, card.field)
                        }
                      >
                        <CloudUploadIcon className="hover:scale-125 active:scale-125 size-3 transition-transform cursor-pointer" />
                      </FileUploadDialog>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h5 className="text-secondary w-full col-span-4 text-xs">
            {t("common.address")} : {data?.address}
          </h5>
        </div>
      </div>

      <div className="space-y-1 max-w-[100px] flex flex-col">
        {!isReview && !isUploadInto && (
          <Button
            variant="outline"
            className="max-w-[100px] w-full text-[13px] text-secondary hover:text-secondary border-secondary bg-white font-semibold gap-1"
            onClick={setIsEditing ? () => setIsEditing(!isEditing) : undefined}
          >
            <PencilIcon className="size-3" />
            {isEditing ? t("common.cancel") : t("common.edit")}
          </Button>
        )}

        {!isUploadInto && (
          <Button
            variant="secondary"
            className="w-[100px] text-[13px] font-semibold"
            onClick={handleApprove}
          >
            {t("common.approve")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default DetailsBlock;
