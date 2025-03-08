import api from "@/api"
import { UpdateInterviewRoundStatusPayload } from "@/api/interview/types"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { hideLoader, openLoader } from "@/store/features/loaderSlice"
import { t } from "i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

type StatusColumnType = {
	interviewID: string
}

const StatusColumn = ({ interviewID }: StatusColumnType) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { mutate: updateInterviewRoundStatus } =
		api.interview.updateInterviewRoundStatus.useMutation({
			onMutate: () => dispatch(openLoader()),
			onSettled: () => dispatch(hideLoader()),
			onSuccess: () => {
				toast({
					variant: "success",
					title: t("success-title.update"),
					description: t("success-msg.update"),
				})

				navigate("/interview-rounds")
			},
			onError: () => {
				toast({
					variant: "destructive",
					title: t("error-title.update"),
					description: t("error-msg.update"),
				})
			},
		})

	const handleApprove = () => {
		const payload: UpdateInterviewRoundStatusPayload = {
			interviewID,
			status: "Approved",
		}

		updateInterviewRoundStatus(payload)
	}

	return (
		<div className="flex items-center justify-center w-full">
			<Button
				variant="outline"
				className="bg-accent text-secondary hover:text-secondary/80 active:text-secondary/80 border-0 shadow-none"
				onClick={handleApprove}
			>
				{t("pool.approve-for-interview")}
			</Button>
		</div>
	)
}

export default StatusColumn
