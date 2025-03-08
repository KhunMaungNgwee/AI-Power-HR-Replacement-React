import api from "@/api"
import { VideoType } from "@/api/candidate/types"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import {
	ClipboardIcon,
	CrossCircledIcon,
	DotsVerticalIcon,
	LayersIcon,
	PlayIcon,
} from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type ActionsColumnType = {
	candidateID: string
	status: string
}

const ActionsColumn = ({ status, candidateID }: ActionsColumnType) => {
	const { t, i18n } = useTranslation()

	const [videos, setVideos] = useState<VideoType[]>([])
	const [videoDialog, setVideoDialog] = useState(false)

	const { data } = api.candidate.getVideosByCandidateId.useQuery(
		candidateID,
		{
			queryKey: ["getCandidateVideos", candidateID],
			enabled: videoDialog,
		}
	)

	useEffect(() => {
		if (data) setVideos(data)
	}, [data])

	return (
		<div className="flex items-center justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="columnIcon"
						size="icon"
						className="rounded data-[state=open]:bg-accent"
					>
						<DotsVerticalIcon className="text-secondary hover:text-secondary focus:text-secondary w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<Link
							to={`/candidate-information/${candidateID}`}
							state={{ from: "/pool/check-documents" }}
						>
							<DropdownMenuItem className="p-3 text-[0.8rem] gap-2">
								<ClipboardIcon className="text-secondary hover:text-secondary focus:text-secondary w-4 h-4" />
								{t("pool.candidate-details")}
							</DropdownMenuItem>
						</Link>

						{status === "Validate Interview" && (
							<>
								<DropdownMenuItem
									className="p-3 text-[0.8rem] gap-2"
									onClick={() => setVideoDialog(true)}
								>
									<PlayIcon className="text-secondary hover:text-secondary focus:text-secondary w-4 h-4" />
									{t("pool.watch-videos")}
								</DropdownMenuItem>

								<Link
									to={`/interview-analysis/${candidateID}`}
									state={{ from: "/pool/check-documents" }}
								>
									<DropdownMenuItem className="p-3 text-[0.8rem] gap-2">
										<LayersIcon className="text-secondary hover:text-secondary focus:text-secondary w-4 h-4" />
										{t("pool.interview-analysis")}
									</DropdownMenuItem>
								</Link>
							</>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={videoDialog}>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader className="relative space-y-0">
						<AlertDialogTitle>
							{t("pool.interview-videos")}
						</AlertDialogTitle>
						<AlertDialogDescription></AlertDialogDescription>

						<Button
							variant="ghost"
							size="icon"
							className="w-fit h-fit absolute top-0 right-0"
							onClick={() => setVideoDialog(false)}
						>
							<CrossCircledIcon className="size-6" />
						</Button>
					</AlertDialogHeader>

					<section className="flex justify-center w-full">
						<Carousel className="w-full max-w-sm">
							<CarouselContent>
								{videos.map((vd, index) => (
									<CarouselItem key={index}>
										<Card className="flex flex-col justify-between h-full gap-2 border-0 shadow-none">
											<p className="font-medium">
												{`${(index + 1)
													.toString()
													.padStart(2, "0")}.`}{" "}
												{i18n.language === "en"
													? vd.questionEnglish
													: vd.questionThai}
											</p>
											<CardContent className=" flex items-center justify-center">
												<video
													src={vd.responseUrl}
													className="object-contain w-full h-full resize-none"
													controls
													playsInline
												/>
											</CardContent>
										</Card>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</section>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default ActionsColumn
