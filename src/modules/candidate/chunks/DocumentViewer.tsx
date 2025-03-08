import { Button } from "./../../../components/ui/button"
import { ImageViewer, PDFViewer } from "@/components/viewers"
import { SymbolIcon } from "@radix-ui/react-icons"
import { RotateCwSquareIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface DocumentViewerProps {
	documentUrl?: string
	isScanning?: boolean
	scanFn?: () => void
	disabled: boolean
}

const DocumentViewer = ({
	documentUrl,
	isScanning,
	scanFn,
	disabled,
}: DocumentViewerProps) => {
	const { t } = useTranslation()

	const [rotatePoint, setRotatePoint] = useState(0)

	const rotate = (direction: "left" | "right") => {
		setRotatePoint((prev) => prev + (direction === "left" ? -1 : 1))
	}

	const handleScan = () => {
		if (scanFn) scanFn()
	}

	return (
		<div className="flex flex-col w-full gap-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<h4 className="p-1.5 pl-0 font-semibold">
						{t("common.document-upload")}
					</h4>

					{documentUrl && !documentUrl.endsWith(".docx") && (
						<Button
							variant="ghost"
							size="icon"
							disabled={isScanning}
							onClick={() => rotate("right")}
						>
							<RotateCwSquareIcon />
						</Button>
					)}
				</div>

				<Button
					variant="outline"
					className="w-[100px] font-semibold"
					disabled={
						isScanning ||
						disabled ||
						(documentUrl ? documentUrl.endsWith(".docx") : false)
					}
					onClick={handleScan}
				>
					<SymbolIcon
						className={`mr-1 ${isScanning ? "animate-spin" : ""}`}
					/>
					{t("common.scan")}
				</Button>
			</div>

			<div className="flex items-center justify-center w-full p-2 m-auto rounded">
				{documentUrl?.endsWith(".pdf") ? (
					<PDFViewer
						pdfLink={documentUrl}
						isScanning={isScanning}
						rotatePoint={rotatePoint}
					/>
				) : documentUrl?.endsWith(".docx") ? (
					<a
						href={documentUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-secondary/80 hover:text-secondary text-sm underline break-all"
					>
						{t("candidate.click-here-to-view-word-file")}
					</a>
				) : (
					<ImageViewer
						imageUrl={documentUrl}
						altText="Document Image"
						rotatePoint={rotatePoint}
						isScanning={isScanning}
					/>
				)}
			</div>
		</div>
	)
}

export default DocumentViewer
