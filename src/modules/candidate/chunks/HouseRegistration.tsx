import api from "@/api"
import { OCRPayload, SaveHouseRegistrationPayload } from "@/api/id-card/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { HouseRegistrationType } from "@/shared/types"
import { hideLoader, openLoader } from "@/store/features/loaderSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { t } from "i18next"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { z } from "zod"
import DocumentViewer from "./DocumentViewer"

interface HouseRegistrationProps {
	documentUrl?: string
	documentData?: HouseRegistrationType
}

const formSchema = z.object({
	registrationNumber: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	registrationOffice: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	houseAddress: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	villageName: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	houseName: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	houseType: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	houseCharacteristics: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	houseNumberAssignmentDate: z
		.date({
			invalid_type_error: t("error-msg.required"),
		})
		.nullable()
		.refine((date) => date !== null, {
			message: t("error-msg.required"),
		}),
	name: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	nationality: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	gender: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	dateOfBirth: z
		.date({
			invalid_type_error: t("error-msg.required"),
		})
		.nullable()
		.refine((date) => date !== null, {
			message: t("error-msg.required"),
		}),
	mother: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	father: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	origin: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
})

const HouseRegistration = ({
	documentUrl,
	documentData,
}: HouseRegistrationProps) => {
	const { id } = useParams()
	const dispatch = useDispatch()

	const [isEdit, setIsEdit] = useState(false)
	const [isScanning, setIsScanning] = useState(false)

	const { mutate: callOCRHouseRegistration } =
		api.idCard.callOCRHouseRegistration.useMutation({
			onMutate: () => setIsScanning(true),
			onSettled: () => setIsScanning(false),
			onSuccess: (data) => {
				setIsEdit(true)

				const mappedData = data

				if (mappedData) {
					Object.entries(mappedData).map(
						([key, value]) =>
							(mappedData[key as keyof typeof data] = value ?? "")
					)
				}

				form.reset({
					...mappedData,
					dateOfBirth: mappedData?.dateOfBirth
						? new Date(mappedData.dateOfBirth)
						: undefined,
					houseNumberAssignmentDate:
						mappedData?.houseNumberAssignmentDate
							? new Date(mappedData.houseNumberAssignmentDate)
							: undefined,
				})

				toast({
					variant: "success",
					title: t("success-title.scan"),
					description: t("success-msg.scan"),
				})
			},
			onError: (error: Error) => {
				console.error(error)

				toast({
					variant: "destructive",
					title: t("error-title.scan"),
					description: error.message,
				})
			},
		})

	const { mutate: saveHouseRegistration } =
		api.idCard.saveHouseRegistration.useMutation({
			onMutate: () => dispatch(openLoader()),
			onSettled: () => {
				dispatch(hideLoader())

				setIsEdit(false)
			},
			onSuccess: () => {
				toast({
					variant: "success",
					title: t("success-title.update"),
					description: t("success-msg.update"),
				})
			},
			onError: (error: Error) => {
				console.error(error)
	
				toast({
					variant: "destructive",
					title: t("error-title.update"),
					description: t("error-msg.update"),
				})
			},
		})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			registrationNumber: documentData?.registrationNumber,
			registrationOffice: documentData?.registrationOffice,
			houseAddress: documentData?.houseAddress,
			villageName: documentData?.villageName,
			houseName: documentData?.houseName,
			houseType: documentData?.houseType,
			houseCharacteristics: documentData?.houseCharacteristics,
			houseNumberAssignmentDate: documentData?.houseNumberAssignmentDate
				? new Date(documentData.houseNumberAssignmentDate)
				: undefined,
			name: documentData?.name,
			nationality: documentData?.nationality,
			gender: documentData?.gender,
			dateOfBirth: documentData?.dateOfBirth
				? new Date(documentData.dateOfBirth)
				: undefined,
			mother: documentData?.mother,
			father: documentData?.father,
			origin: documentData?.origin,
		},
	})

	const scan = () => {
		const payload: OCRPayload = {
			candidateId: id!,
			url: documentUrl!,
		}

		callOCRHouseRegistration(payload)
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: SaveHouseRegistrationPayload = {
			...values,
			candidateID: id!,
		}

		if (documentData?.houseRegistrationID) {
			payload["houseRegistrationID"] = documentData.houseRegistrationID
		}

		saveHouseRegistration(payload)
	}

	return (
		<section className="grid bg-white grid-cols-1 sm:grid-cols-2 text-[15px] p-3">
			<div className="border-accent sm:border-r sm:pr-3 sm:pb-0 sm:border-0 pb-3 border-b">
				<div className="flex items-center justify-between w-full">
					<h4 className="font-semibold">
						{t("common.ai-progress")}:{" "}
						<span>{t("common.house-registration")}</span>
					</h4>

					<Button
						variant="link"
						className="font-semibold text-black"
						disabled={isScanning}
						onClick={() => setIsEdit(!isEdit)}
					>
						<Pencil1Icon /> {t("common.edit")}
					</Button>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-1"
					>
						<FormField
							control={form.control}
							name="registrationNumber"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.registrationNumber")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.registrationNumber"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="registrationOffice"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.registrationOffice")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.registrationOffice"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="houseAddress"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.houseAddress")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.houseAddress"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="villageName"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.villageName")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.villageName"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="houseName"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.houseName")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.houseName"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="houseType"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.houseType")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.houseType"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="houseCharacteristics"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.houseCharacteristics")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.houseCharacteristics"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="houseNumberAssignmentDate"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.houseNumberAssignmentDate")}{" "}
										:
									</FormLabel>

									{isEdit ? (
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className="h-[40px] px-3 text-xs border-secondary flex justify-between items-center"
													>
														{field.value ? (
															format(
																field.value,
																"dd MMM yyyy"
															)
														) : (
															<span className="text-muted-foreground whitespace-break-spaces break-all">
																{t(
																	"fields.houseNumberAssignmentDate"
																)}
															</span>
														)}
														<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
														new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									) : (
										<div className="candidate-data-display-box">
											{field.value
												? format(
														field.value,
														"dd MMM yyyy"
												  )
												: ""}
										</div>
									)}

									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.name")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.name")}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nationality"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.nationality")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.nationality"
												)}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="gender"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.gender")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.gender")}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.dateOfBirth")} :
									</FormLabel>

									{isEdit ? (
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className="h-[40px] px-3 text-xs border-secondary flex justify-between items-center"
													>
														{field.value ? (
															format(
																field.value,
																"dd MMM yyyy"
															)
														) : (
															<span className="text-muted-foreground">
																{t(
																	"fields.dateOfBirth"
																)}
															</span>
														)}
														<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
														new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									) : (
										<div className="candidate-data-display-box">
											{field.value
												? format(
														field.value,
														"dd MMM yyyy"
												  )
												: ""}
										</div>
									)}

									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="mother"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.mother")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.mother")}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="father"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.father")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.father")}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="origin"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.origin")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.origin")}
												{...field}
											/>
										</FormControl>
									) : (
										<div className="candidate-data-display-box">
											{field.value}
										</div>
									)}
									<FormMessage className="col-start-2" />
								</FormItem>
							)}
						/>

						{isEdit && (
							<div className="flex items-center justify-center pt-4">
								<Button
									type="submit"
									variant="secondary"
									className="min-w-[120px]"
								>
									{t("common.submit")}
								</Button>
							</div>
						)}
					</form>
				</Form>
			</div>

			<div className="sm:pl-3">
				<DocumentViewer
					documentUrl={documentUrl}
					isScanning={isScanning}
					scanFn={scan}
					disabled={!documentUrl}
				/>
			</div>
		</section>
	)
}

export default HouseRegistration
