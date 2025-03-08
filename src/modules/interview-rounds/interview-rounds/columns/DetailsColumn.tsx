import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { t } from "i18next"
import { UserRoundCogIcon } from "lucide-react"
import { Link } from "react-router-dom"

type DetailsColumnType = {
	interviewID: string
	departmentName: string
}

const DetailsColumn = ({ interviewID, departmentName }: DetailsColumnType) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						to={`view-details/${interviewID}`}
						state={{ departmentName }}
					>
						<div className="flex items-center justify-center w-full">
							<Button variant="columnIcon" size="icon">
								<UserRoundCogIcon />
							</Button>
						</div>
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<p>{t("common.details")}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default DetailsColumn
