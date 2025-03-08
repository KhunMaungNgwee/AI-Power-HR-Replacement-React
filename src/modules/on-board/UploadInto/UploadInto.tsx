import api from "@/api";
import { Button } from "@/components/ui/button";
import CVForm from "@/modules/candidate/chunks/CVForm";
import EducationQualification from "@/modules/candidate/chunks/EducationQualification";
import HouseRegistration from "@/modules/candidate/chunks/HouseRegistration";
import IDCard from "@/modules/candidate/chunks/IDCard";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DetailsBlock from "@/modules/candidate/chunks/DetailsBlock";
import UpdateInto from "./chunks/UpdateInto";

const UploadInto = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState<number>(0);


  if (!id) {
    navigate("/not-found");
    return null;
  }

  const { data, refetch } = api.candidate.getCandidateByCandidateID.useQuery(
    id,
    {
      queryKey: ["getCandidateByCandidateID", id],
    }
  );

  const changeActiveCard = (cardNum: number) => {
    if (activeCard === cardNum) setActiveCard(0);
    else setActiveCard(cardNum);
  };

  const CARDS = [
    <UpdateInto data={data} />,
    <IDCard documentUrl={data?.idCardUrl} documentData={data?.idCardObject} />,
    <HouseRegistration
      documentUrl={data?.houseRegistrationUrl}
      documentData={data?.houseRegistrationsObject}
    />,
    <EducationQualification
      documentUrl={data?.educationLevelUrl}
      documentData={data?.educationalQualifications}
    />,
    <CVForm documentUrl={data?.cvUrl} />,
  ];
  const renderedCard = CARDS[activeCard];

  return (
    <div className="m-4 flex flex-col">
      <section className="flex items-center gap-3 mb-4">
        <Button
          variant="link"
          className="flex items-center gap-1 font-bold text-black"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="stroke-black" />
          {t("common.back")}
        </Button>
        <h3 className="text-2xl font-bold">{t("title.upload-into")}</h3>
      </section>

      <div className="container space-y-4">
        <DetailsBlock
          isUploadInto={true}
          data={data}
          activeCard={activeCard}
          changeActiveCard={changeActiveCard}
          refetch={refetch}
        />

        {renderedCard}
      </div>
      
    </div>
  );
};

export default UploadInto;
