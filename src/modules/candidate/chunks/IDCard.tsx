import api from "@/api"
import { OCRPayload, SaveIdCardPayload } from "@/api/id-card/types"
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
import { IDCardType } from "@/shared/types"
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

interface IDCardProps {
	documentUrl?: string
	documentData?: IDCardType
}

const formSchema = z.object({
	identificationNumber: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	name: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	lastName: z
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
	address: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	dateOfIssue: z
		.date({
			invalid_type_error: t("error-msg.required"),
		})
		.nullable()
		.refine((date) => date !== null, {
			message: t("error-msg.required"),
		}),
	dateOfExpiry: z
		.date({
			invalid_type_error: t("error-msg.required"),
		})
		.nullable()
		.refine((date) => date !== null, {
			message: t("error-msg.required"),
		}),
})

const IDCard = ({ documentUrl, documentData }: IDCardProps) => {
	const { id } = useParams()
	const dispatch = useDispatch()

	const [isEdit, setIsEdit] = useState(false)
	const [isScanning, setIsScanning] = useState(false)

	const { mutate: callOCRIdCard } = api.idCard.callOCRIdCard.useMutation({
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
				dateOfExpiry: mappedData?.dateOfExpiry
					? new Date(mappedData.dateOfExpiry)
					: undefined,
				dateOfIssue: mappedData?.dateOfIssue
					? new Date(mappedData.dateOfIssue)
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

	const { mutate: saveIdCard } = api.idCard.saveIdCard.useMutation({
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
			name: documentData?.name,
			address: documentData?.address,
			dateOfBirth: documentData?.dateOfBirth
				? new Date(documentData.dateOfBirth)
				: undefined,
			dateOfExpiry: documentData?.dateOfExpiry
				? new Date(documentData.dateOfExpiry)
				: undefined,
			dateOfIssue: documentData?.dateOfIssue
				? new Date(documentData.dateOfIssue)
				: undefined,
			identificationNumber: documentData?.identificationNumber,
			lastName: documentData?.lastName,
		},
	})

	const scan = () => {
		const payload: OCRPayload = {
			candidateId: id!,
			url: documentUrl!,
		}

		callOCRIdCard(payload)
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: SaveIdCardPayload = {
			...values,
			candidateID: id!,
		}

		if (documentData?.idCardID) {
			payload["idCardID"] = documentData.idCardID
		}

		saveIdCard(payload)
	}

	return (
		<section className="grid bg-white grid-cols-1 sm:grid-cols-2 text-[15px] p-3">
			<div className="border-accent sm:border-r sm:pr-3 sm:pb-0 sm:border-0 pb-3 border-b">
				<div className="flex items-center justify-between w-full">
					<h4 className="font-semibold">
						{t("common.ai-progress")}:{" "}
						<span>{t("common.id-card")}</span>
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
							name="identificationNumber"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.identificationNumber")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.identificationNumber"
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
							name="lastName"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.lastName")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.lastName"
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
							name="address"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.address")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.address"
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
							name="dateOfIssue"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.dateOfIssue")} :
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
																	"fields.dateOfIssue"
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
							name="dateOfExpiry"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.dateOfExpiry")} :
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
																	"fields.dateOfExpiry"
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

export default IDCard
