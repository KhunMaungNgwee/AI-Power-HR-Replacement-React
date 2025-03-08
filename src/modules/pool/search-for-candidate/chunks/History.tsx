import { DateBadge } from "./common/DateBadge"

export const History = ({
	date,
	message,
}: {
	date: string
	message: string
}) => {
	return (
		<div className="grid grid-cols-12 space-y-2 text-xs">
			<div className="col-span-2 pt-2">
				<DateBadge date={date} />
			</div>

			<div className="col-span-10">
				<div className=" bg-[#F6F7F9] p-2 rounded-md h-20">
					<p>{message}</p>
				</div>
			</div>
		</div>
	)
}
