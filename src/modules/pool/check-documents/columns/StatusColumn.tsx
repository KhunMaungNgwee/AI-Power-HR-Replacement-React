import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusColumnProps = {
	children: string
	icon?: boolean
	className?: string
}

const StatusColumn = ({ children, icon, className }: StatusColumnProps) => {
	return (
		<div className="flex items-center justify-center">
			<Badge
				variant="outline"
				className={cn(
					"w-min flex items-center gap-1 select-none hover:bg-accent leading-[0.9rem] px-3",
					className
				)}
			>
				{icon && (
					<div className="bg-vivid w-1.5 h-1.5 rounded-full"></div>
				)}
				{children}
			</Badge>
		</div>
	)
}

export default StatusColumn
