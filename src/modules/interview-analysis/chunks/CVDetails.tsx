import { CVDetailsType } from "@/api/candidate/types"
import { ImageViewer, PDFViewer } from "@/components/viewers"
import { reasonFormatter } from "@/helper"
import { useTranslation } from "react-i18next"

interface CVDetailsProps {
	cvUrl?: string
	cvDetails?: CVDetailsType
}

const CVDetails = ({ cvUrl, cvDetails }: CVDetailsProps) => {
	const { t } = useTranslation()

	return (
		<section className="p-4 px-6 space-y-3 bg-white rounded shadow">
			<h5 className="font-bold">{t("interview-analysis.cv-details")}</h5>

			<div className="grid grid-cols-2 gap-2">
				<div className="w-[90%] mx-auto">
					{cvUrl?.endsWith(".pdf") ? (
						<PDFViewer
							pdfLink={cvUrl}
							className="m-0"
							rotatePoint={0}
						/>
					) : cvUrl?.endsWith(".docx") ? (
						<a
							href={cvUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary/80 hover:text-secondary text-sm underline break-all"
						>
							{t("placeholder.click-here-to-view-word-file")}
						</a>
					) : (
						<ImageViewer
							imageUrl={cvUrl}
							altText="Document Image"
							className="m-0"
							rotatePoint={0}
						/>
					)}
				</div>

				<div className="space-y-3 text-sm">
					<div className="p-2">
						<h6 className="font-bold">
							{t("interview-analysis.profile-summary")}
						</h6>
						<p>{cvDetails?.profileSummary}</p>
					</div>

					<div className="p-2">
						<h6 className="font-bold">{t("common.total-score")}</h6>
						<p>{cvDetails?.score}</p>
					</div>

					<div className="p-2">
						<h6 className="font-bold">
							{t("interview-analysis.reason-score")}
						</h6>
						<ul className="pl-5 list-disc">
							{reasonFormatter(cvDetails?.reasonScore).map(
								(reason, index) => (
									<li key={index}>{reason}</li>
								)
							)}
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

export default CVDetails
