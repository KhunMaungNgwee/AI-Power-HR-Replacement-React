import api from "@/api"
import { useNavigate, useParams } from "react-router-dom"
import ChartAndVideo from "./chunks/ChartAndVideo"
import FaceToFaceInterview from "./chunks/FaceToFaceInterview"
import InterviewProfile from "./chunks/InterviewProfile"
import QnAAnalysis from "./chunks/QnAAnalysis"

const InterviewAnalysisView = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	if (!id) {
		navigate("/not-found")
		return null
	}

	const { data } = api.candidate.getInterviewDetails.useQuery(id, {
		queryKey: ["getInterviewDetails", id],
	})

	return (
		<main className="min-h-svh bg-accent w-full py-2">
			<div className="md:px-9 container p-3 mx-auto space-y-6">
				<InterviewProfile data={data} />

				<ChartAndVideo data={data} />

				<QnAAnalysis
					questionsAndAnswers={data?.questionAndAnswerAnalysis}
				/>

				{/* <CVDetails cvUrl={data?.cvUrl} cvDetails={data?.cvDetail} /> */}

				<FaceToFaceInterview cData={data} />
			</div>
		</main>
	)
}

export default InterviewAnalysisView
