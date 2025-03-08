import { QuestionAndAnswerType } from "@/api/candidate/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { useTranslation } from "react-i18next"

type QnAAnalysisType = {
	questionsAndAnswers?: QuestionAndAnswerType[]
}

const QnAAnalysis = ({
	questionsAndAnswers,
}: QnAAnalysisType) => {
	const { t, i18n } = useTranslation()

	return (
		<section className="p-4 px-6 space-y-8 bg-white rounded shadow">
			<h5 className="font-bold">
				{t("interview-analysis.question-and-answer-analysis")}
			</h5>

			<div>
				<div className="bg-gray-900 text-secondary-foreground rounded-t-xl grid items-center gap-4 grid-cols-3 md:grid-cols-5 px-5 h-[45px] text-[15px]">
					<h6 className="md:col-span-2 col-span-1">
						{t("common.questions")}
					</h6>
					<h6 className="md:col-span-2 col-span-1">
						{t("common.answers")}
					</h6>
					<h6 className="flex items-center justify-center gap-1">
						{t("common.score")}
						<Button
							variant="secondary"
							size="icon"
							className="hover:bg-transparent active:bg-transparent bg-transparent"
						>
							<Pencil1Icon className="w-4 h-4" />
						</Button>
					</h6>
				</div>

				{questionsAndAnswers?.map((qna, index) => (
					<div
						key={index}
						className={cn(
							"grid grid-cols-3 md:grid-cols-5 px-5 min-h-[52px] text-sm items-center gap-4 py-2",
							index % 2 === 0 ? "bg-accent" : "bg-white"
						)}
					>
						<p className="md:col-span-2 col-span-1">
							{i18n.language === "en"
								? qna.questionEnglish
								: qna.questionThai}
						</p>
						<p className="md:col-span-2 col-span-1">{qna.answer}</p>
						<p className="text-center">{qna.score}</p>
					</div>
				))}
			</div>
		</section>
	)
}

export default QnAAnalysis
