import { useTranslation } from "react-i18next"
import DocumentViewer from "./DocumentViewer"

interface CVFormProps {
	documentUrl?: string
}

const CVForm = ({ documentUrl }: CVFormProps) => {
	const { t } = useTranslation()

	return (
		<section className="grid bg-white grid-cols-1 sm:grid-cols-2 text-[15px] p-3">
			<div className="border-accent sm:border-r sm:pr-3 sm:pb-0 sm:border-0 pb-3 border-b">
				<h4 className=" font-semibold">
					{t("common.ai-progress")}: {t("common.cv-form")}
				</h4>
			</div>
			<div className="sm:pl-3">
				<DocumentViewer
					disabled={!documentUrl}
					documentUrl={documentUrl}
				/>
			</div>
		</section>
	)
}

export default CVForm
