import api from "@/api"
import {
	CandidateData,
	UpdateStatusInterviewPayload,
} from "@/api/candidate/types"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fetchFileFromURL } from "@/helper"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { hideLoader, openLoader } from "@/store/features/loaderSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { Cross1Icon } from "@radix-ui/react-icons"
import { t } from "i18next"
import { FileAudio2, FileVideo2Icon } from "lucide-react"
import {
	ChangeEvent,
	DragEvent as ReactDragEvent,
	useEffect,
	useRef,
	useState,
} from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import * as z from "zod"

type FaceToFaceInterviewProps = {
	cData?: CandidateData
}

const formSchema = z.object({
	interviewerName: z
		.string({
			invalid_type_error: t("error-msg.required"),
			required_error: t("error-msg.required"),
		})
		.min(2, { message: t("error-msg.required") }),
	interviewScore: z.number({
		invalid_type_error: t("error-msg.required"),
		required_error: t("error-msg.required"),
	}),
	commentApprover: z
		.string({
			invalid_type_error: t("error-msg.required"),
		})
		.optional(),
	interviewRecordFile: z
		.instanceof(File, {
			message: t("error-msg.required"),
		})
		.refine((file) => file.size > 0, {
			message: t("error-msg.required"),
		}),
	statusScoreCheck: z.string(),
})

const FaceToFaceInterview = ({ cData }: FaceToFaceInterviewProps) => {
	const dispatch = useDispatch()
	const { id } = useParams()
	const navigate = useNavigate()

	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const [isDragging, setIsDragging] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			interviewerName: cData?.interviewerName,
			interviewScore: cData?.interviewScore,
			interviewRecordFile: undefined,
			statusScoreCheck: cData?.statusScoreCheck,
			commentApprover: cData?.commentApprover,
		},
	})

	useEffect(() => {
		async function fetchAndBind() {
			if (cData?.interviewRecordUrl) {
				const fileToBind = await fetchFileFromURL(
					cData?.interviewRecordUrl
				)

				if (fileToBind instanceof File)
					form.setValue("interviewRecordFile", fileToBind)
			}
		}

		fetchAndBind()
	}, [cData])

	const handleSelectFile = () => fileInputRef.current?.click()

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const files = target.files

		if (files) {
			form.setValue("interviewRecordFile", files[0])
			fileInputRef.current!.value = ""
		}
	}

	const onDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(true)

		event.dataTransfer!.dropEffect = "copy"
	}

	const onDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)
	}

	const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)

		const files = event.dataTransfer?.files
		if (!files) return

		for (let i = 0; i < files.length; i++) {
			if (files[i].type.split("/")[0] != "image") continue

			form.setValue("interviewRecordFile", files[0])
		}
	}

	const { mutate: uploadFileDocument } =
		api.auth.uploadFileDocument.useMutation({
			onMutate: () => {
				dispatch(openLoader())
			},
			onSuccess: (data) => {
				const payload: UpdateStatusInterviewPayload = {
					candidateID: id!,
					interviewerName: form.getValues().interviewerName,
					interviewRecordUrl: data.file,
					interviewScore: form.getValues().interviewScore,
					statusScoreCheck: form.getValues().statusScoreCheck,
					commentApprover: form.getValues().commentApprover || "",
				}

				updateStatusInterview(payload)
			},
			onSettled: () => dispatch(hideLoader()),
		})

	const { mutate: updateStatusInterview } =
		api.candidate.updateStatusInterview.useMutation({
			onMutate: () => dispatch(openLoader()),
			onSettled: () => dispatch(hideLoader()),
			onSuccess: () => {
				toast({
					variant: "success",
					title: t("success-title.update"),
					description: t("success-msg.update"),
				})

				navigate("/pool/check-documents")
			},
			onError: () => {
				toast({
					variant: "destructive",
					title: t("error-title.update"),
					description: t("error-msg.update"),
				})
			},
		})

	function onSubmit(values: z.infer<typeof formSchema>) {
		uploadFileDocument(values.interviewRecordFile)
	}

	const handleUpdateStatus = (status: string) => {
		form.setValue("statusScoreCheck", status)

		form.handleSubmit(onSubmit)()
	}

	return (
		<>
			<section className="p-4 px-6 space-y-4 bg-white rounded shadow">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-2 pb-4"
					>
						<div className="pr-6 space-y-8 border-r">
							<h5 className="mb-3 font-bold">
								{t("interview-analysis.face-to-face-interview")}
							</h5>

							<FormField
								control={form.control}
								name="interviewerName"
								render={({ field }) => (
									<FormItem className="grid items-center grid-cols-2 gap-4">
										<FormLabel>
											{t("common.interviewer-name")}:
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"placeholder.interviewer-name"
												)}
												readOnly={Boolean(
													cData?.statusScoreCheck
												)}
												{...field}
											/>
										</FormControl>
										<FormMessage className="col-start-2" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="interviewScore"
								render={({ field }) => (
									<FormItem className="grid items-center grid-cols-2 gap-4">
										<FormLabel>
											{t("common.interview-score")}:
										</FormLabel>
										<FormControl>
											<Input
												variant="default"
												{...field}
												type="number"
												placeholder={t(
													"placeholder.interview-score"
												)}
												readOnly={Boolean(
													cData?.statusScoreCheck
												)}
												onChange={(event) =>
													field.onChange(
														+event.target.value
													)
												}
											/>
										</FormControl>
										<FormMessage className="col-start-2" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="commentApprover"
								render={({ field }) => (
									<FormItem className="grid items-center grid-cols-2 gap-4">
										<FormLabel>
											{t(
												"interview-analysis.comment-by-approver"
											)}
											:
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder={t(
													"placeholder.comment"
												)}
												readOnly={Boolean(
													cData?.statusScoreCheck
												)}
												{...field}
											/>
										</FormControl>
										<FormMessage className="col-start-2" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="interviewRecordFile"
							render={({ field }) => (
								<FormItem className="flex items-center justify-center gap-3 pl-6">
									<FormLabel>{t("common.upload")}:</FormLabel>
									<FormControl>
										<div
											onDragOver={onDragOver}
											onDragLeave={onDragLeave}
											onDrop={onDrop}
											className={cn(
												"flex justify-center items-center w-full lg:w-9/12 max-w-[320px] py-3 aspect-square rounded-xl bg-accent",
												isDragging
													? "border-secondary"
													: ""
											)}
										>
											{field.value instanceof File ? (
												<div className="size-full relative flex flex-col items-center justify-center gap-3">
													{field.value?.type?.startsWith(
														"video"
													) ? (
														<FileVideo2Icon className="size-10" />
													) : (
														<FileAudio2 className="size-10" />
													)}
													<div className="flex items-center gap-2 text-xs">
														<span>
															{field.value.name
																.length > 15
																? `${field.value.name.slice(
																		0,
																		14
																  )}...${field.value.name
																		.split(
																			"."
																		)
																		.pop()}`
																: field.value
																		.name}
														</span>
														<div className="w-1 h-1 bg-black rounded-full"></div>
														<Dialog>
															<DialogTrigger
																asChild
															>
																<Button
																	type="button"
																	variant="link"
																	className="text-secondary p-0 text-xs"
																>
																	{t(
																		"common.preview"
																	)}
																</Button>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[500px] bg-white">
																<DialogHeader>
																	<DialogTitle>
																		{t(
																			"common.preview"
																		)}
																	</DialogTitle>
																	<DialogDescription className="flex items-center gap-2">
																		{
																			field
																				.value
																				.name
																		}{" "}
																		|{" "}
																		{
																			field
																				.value
																				.size
																		}{" "}
																		bytes
																	</DialogDescription>
																</DialogHeader>
																<div>
																	{field.value.type.startsWith(
																		"video"
																	) ? (
																		<video
																			src={URL.createObjectURL(
																				field.value
																			)}
																			controls
																		/>
																	) : (
																		<audio
																			src={URL.createObjectURL(
																				field.value
																			)}
																			controls
																		/>
																	)}
																</div>
																<DialogFooter>
																	<DialogClose
																		asChild
																	>
																		<Button type="button">
																			{t(
																				"common.close"
																			)}
																		</Button>
																	</DialogClose>
																</DialogFooter>
															</DialogContent>
														</Dialog>

														<span className="mr-1 text-xs">
															{(
																field.value
																	.size /
																1024 /
																1024
															).toFixed(2)}{" "}
															MB
														</span>
													</div>

													{!cData?.statusScoreCheck && (
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="size-fit top-2 right-2 absolute p-0"
															onClick={() =>
																field.onChange(
																	null
																)
															}
														>
															<Cross1Icon className="w-3 h-3" />
														</Button>
													)}
												</div>
											) : (
												<div className="flex flex-col items-center justify-center gap-2">
													<p className="mx-2 text-sm text-center">
														{t(
															"upload.select-or-drag-and-drop-here"
														)}
													</p>
													<p className="text-xs text-[#666] text-center mx-4">
														{t(
															"upload.video-audio-file-type-less-than-10mb"
														)}
													</p>

													<Button
														variant="outline"
														type="button"
														className="border-secondary text-secondary hover:text-secondary active:text-secondary mt-3"
														onClick={
															handleSelectFile
														}
													>
														{t(
															"common.select-file"
														)}
													</Button>
												</div>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</section>

			<section className="flex justify-center gap-3">
				<Button
					variant="secondary"
					className="min-w-[100px] md:min-w-[160px]"
					disabled={Boolean(cData?.statusScoreCheck)}
					onClick={() => handleUpdateStatus("Accepted")}
				>
					{t("common.accept")}
				</Button>
				<Button
					variant="default"
					className="min-w-[100px] md:min-w-[160px]"
					disabled={Boolean(cData?.statusScoreCheck)}
					onClick={() => handleUpdateStatus("Rejected")}
				>
					{t("common.reject")}
				</Button>
			</section>
			<input
				type="file"
				ref={fileInputRef}
				accept="video/mp4, video/avi, video/mpeg, audio/mp3, audio/mpeg"
				className="hidden"
				aria-label="File Selector"
				onChange={onFileChange}
			/>
		</>
	)
}

export default FaceToFaceInterview
