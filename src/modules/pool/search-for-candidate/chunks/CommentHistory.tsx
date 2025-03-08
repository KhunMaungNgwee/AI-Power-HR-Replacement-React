import { useTranslation } from "react-i18next"
import { DateBadge } from "./common/DateBadge"

type CommentHistoryPropsType = {
	date: string
	divisionManager: string
	comment: string
}

export const CommentHistory = ({
	date,
	divisionManager,
	comment,
}: CommentHistoryPropsType) => {
	const { t } = useTranslation()
	return (
		<div className="grid grid-cols-12 text-xs">
			<div className="col-span-2 pt-2">
				<DateBadge date={date} />
			</div>

			<div className="col-span-4 p-2">
				<div className="space-y-1">
					<p className="text-[0.8rem]">
						{t("common.job-interviewer-comment")}
					</p>
					<p className="text-muted/70 italic">
						{t("common.division-comment-by")} {divisionManager}
					</p>
				</div>
			</div>

			<div className="col-span-6">
				<div className="bg-accent h-20 p-2 rounded-md">
					<p>{comment}</p>
				</div>
			</div>
		</div>
	)
}
