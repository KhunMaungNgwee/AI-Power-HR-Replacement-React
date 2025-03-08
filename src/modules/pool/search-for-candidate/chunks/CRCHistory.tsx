import { useTranslation } from "react-i18next"
import { DateBadge } from "./common/DateBadge"

export const CRCHistory = ({
	date,
	divisionManager,
	result,
	score,
	status,
}: {
	date: string
	divisionManager: string
	status: string
	score: number
	result: string
}) => {
	const { t } = useTranslation()
	return (
		<div className="grid grid-cols-12 text-xs">
			<div className="col-span-2">
				<DateBadge date={date} />
			</div>

			<div className="col-span-3">
				<div className="space-y-1">
					<p className="text-[0.8rem]">
						{t("common.job-interviewer-comment")}
					</p>
					<p className="text-muted/70 italic">
						{t("common.division-comment-by")} {divisionManager}
					</p>
				</div>
			</div>

			<div className="grid items-start content-start grid-cols-3 col-span-7">
				<div className="ps-2 flex items-center justify-center flex-1">
					<p>{t("fields.status")}:</p>
					<div className="flex justify-center px-2">
						<div className="bg-[#F6F7F9] px-2 py-1 rounded-md h-fit">
							<p className="font-semibold">{status}</p>
						</div>
					</div>
				</div>

				<div className="ps-2 flex items-center justify-center flex-1 border-l">
					<p>{t("common.result")}:</p>
					<div className="flex justify-center px-2">
						<div className="bg-[#F6F7F9] px-2 py-1 rounded-md h-fit">
							<p className="font-semibold">{result}</p>
						</div>
					</div>
				</div>

				<div className="ps-2 flex items-center justify-center flex-1 border-l">
					<p>{t("common.score")}:</p>
					<div className="flex justify-center px-2">
						<div className="bg-[#F6F7F9] px-2 py-1 rounded-md h-fit">
							<p className="font-semibold">{score}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
