import api from "@/api";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CVForm from "../chunks/CVForm";
import DetailsBlock from "../chunks/DetailsBlock";
import EducationQualification from "../chunks/EducationQualification";
import HouseRegistration from "../chunks/HouseRegistration";
import IDCard from "../chunks/IDCard";
import ProfileCheckList from "../chunks/ProfileCheckList";

const ReviewView = () => {
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
    <ProfileCheckList data={data?.basicCandidateAnswerList} />,
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
        <h3 className="text-2xl font-bold">{t("title.review")}</h3>
      </section>

      <div className="container space-y-4">
        <DetailsBlock
          isReview={true}
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

export default ReviewView;
