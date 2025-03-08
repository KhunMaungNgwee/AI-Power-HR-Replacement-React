import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { t } from "i18next"
import { ChevronLeftIcon } from "lucide-react"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { columns, columnVisibility } from "./columns"

const InterviewRoundsResultsView = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const location = useLocation()

	if (!id) {
		navigate("/not-found")
		return null
	}

	const TABS = [
		{
			tab: "tabs.check-interview-results",
			path: `/interview-rounds/results/${id}`,
		},
	]

	const { data, isFetching } = api.interview.getAllInterviewRound.useQuery()

	return (
		<div className="m-4">
			<div className="flex gap-3 mb-4">
				<Button
					variant="link"
					className="flex items-center gap-1 font-bold text-black"
					onClick={() => navigate(-1)}
				>
					<ChevronLeftIcon className="stroke-black" />
					{t("common.back")}
				</Button>

				<h1 className="text-2xl font-bold">{t("title.interview")}</h1>
			</div>

			<section
				role="tablist"
				aria-label="Pool Tabs"
				className="flex items-center"
			>
				{TABS.map((tb) => (
					<NavLink
						to={tb.path}
						key={tb.tab}
						className={({ isActive }) =>
							cn(
								"px-6 py-1 cursor-pointer select-none rounded-t-md",
								isActive
									? "font-semibold bg-white"
									: "text-muted font-medium"
							)
						}
						role="tab"
						aria-selected={location.pathname === tb.path}
						tabIndex={location.pathname === tb.path ? 0 : -1}
					>
						{t(tb.tab)}
					</NavLink>
				))}
			</section>

			<article className="h-full p-4 bg-white rounded-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={`${t("title.all-candidates")} > ${
						location.state.departmentName
					}`}
					columnVisibility={columnVisibility}
					filterColumns={["name"]}
					sortColumn="createdAt"
					search={false}
				></TableUI>
			</article>
		</div>
	)
}

export default InterviewRoundsResultsView
