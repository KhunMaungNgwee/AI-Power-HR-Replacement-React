import { DivisionManagerType } from "@/api/position/types"
import { Button } from "@/components/ui/button"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { DialogForm } from "../chunks/Dialog"

const ManageColumn = ({ data }: { data: DivisionManagerType }) => {
	return (
		<div className="flex items-center justify-center">
			<DialogForm isEdit={true} data={data}>
				<Button variant={"columnIcon"} size={"icon"}>
					<Pencil2Icon />
				</Button>
			</DialogForm>
		</div>
	)
}

export default ManageColumn
