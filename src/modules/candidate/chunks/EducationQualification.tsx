import api from "@/api"
import {
	OCRPayload,
	SaveEducationQualificationPayload,
} from "@/api/id-card/types"
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
import { EducationalQualificationType } from "@/shared/types"
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

interface EducationQualificationProps {
	documentUrl?: string
	documentData?: EducationalQualificationType
}

const formSchema = z.object({
	name: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	studentID: z
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
	ssn: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	program: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	degree: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	major: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	status: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	issueTo: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	graduationDate: z
		.date({
			invalid_type_error: t("error-msg.required"),
		})
		.nullable()
		.refine((date) => date !== null, {
			message: t("error-msg.required"),
		}),
})

const EducationQualification = ({
	documentUrl,
	documentData,
}: EducationQualificationProps) => {
	const { id } = useParams()
	const dispatch = useDispatch()

	const [isEdit, setIsEdit] = useState(false)
	const [isScanning, setIsScanning] = useState(false)

	const { mutate: callOCREducationQualification } =
		api.idCard.callOCREducationQualification.useMutation({
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
					graduationDate: mappedData?.graduationDate
						? new Date(mappedData.graduationDate)
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

	const { mutate: saveEducationQualification } =
		api.idCard.saveEducationQualification.useMutation({
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
			degree: documentData?.degree,
			issueTo: documentData?.issueTo,
			major: documentData?.major,
			program: documentData?.program,
			ssn: documentData?.ssn,
			status: documentData?.status,
			studentID: documentData?.studentID,
			dateOfBirth: documentData?.dateOfBirth
				? new Date(documentData.dateOfBirth)
				: undefined,
			graduationDate: documentData?.graduationDate
				? new Date(documentData.graduationDate)
				: undefined,
		},
	})

	const scan = () => {
		const payload: OCRPayload = {
			candidateId: id!,
			url: documentUrl!,
		}

		callOCREducationQualification(payload)
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: SaveEducationQualificationPayload = {
			...values,
			candidateID: id!,
		}

		if (documentData?.qualificationID) {
			payload["qualificationID"] = documentData.qualificationID
		}

		saveEducationQualification(payload)
	}

	return (
		<section className="grid bg-white grid-cols-1 sm:grid-cols-2 text-[15px] p-3">
			<div className="border-accent sm:border-r sm:pr-3 sm:pb-0 sm:border-0 pb-3 border-b">
				<div className="flex items-center justify-between w-full">
					<h4 className="font-semibold">
						{t("common.ai-progress")}:{" "}
						<span>{t("common.education-qualification")}</span>
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
							name="studentID"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.studentID")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.studentID"
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
							name="ssn"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.ssn")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.ssn")}
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
							name="program"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.program")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.program"
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
							name="degree"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.degree")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.degree")}
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
							name="major"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.major")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.major")}
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
							name="status"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.status")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t("fields.status")}
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
							name="issueTo"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.issueTo")} :
									</FormLabel>
									{isEdit ? (
										<FormControl>
											<Input
												variant="outline"
												className="h-[40px] text-xs"
												placeholder={t(
													"fields.issueTo"
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
							name="graduationDate"
							render={({ field }) => (
								<FormItem className="grid items-center grid-cols-2 gap-3">
									<FormLabel className="text-xs">
										{t("fields.graduationDate")} :
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
																	"fields.graduationDate"
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

export default EducationQualification
