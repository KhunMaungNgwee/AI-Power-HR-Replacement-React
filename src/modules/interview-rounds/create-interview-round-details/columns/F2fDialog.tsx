import { CandidateByInterviewId } from "@/api/interview/types"
import { Button } from "@/components/ui/button"

import { Calendar } from "lucide-react"
import { DialogForm } from "../chunks/Dialog"

type ActionsColumnType = {
	data: CandidateByInterviewId
}

const F2fDialog = ({ data }: ActionsColumnType) => {
	return (
		<div className="flex items-center justify-center">
			<DialogForm data={data}>
				<Button variant="columnIcon" size="icon">
					<Calendar className="text-secondary w-4 h-4" />
				</Button>
			</DialogForm>
		</div>
	)
}

export default F2fDialog
