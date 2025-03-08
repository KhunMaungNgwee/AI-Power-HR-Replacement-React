import {
	keepPreviousData,
	useMutation,
	UseMutationOptions,
	useQuery,
	UseQueryOptions,
} from "@tanstack/react-query"
import axios from "axios"
import {
	AddJobPositionPayloadType,
	DepartmentRequestPayload,
	DepartmentRequestType,
	DivisionManagerPayload,
	DivisionManagerType,
	EditJobPositionPayloadType,
	JobPositionType,
	PostResponse,
	UpdateDepartmentRequestType,
	UpdateDivisionManagerType,
} from "./types"

const BASE_URL = "/Position"

export const getAllDepartmentRequest = {
	useQuery: (opt?: UseQueryOptions<DepartmentRequestType[], Error>) =>
		useQuery<DepartmentRequestType[], Error>({
			queryKey: ["getAllDepartmentRequest"],
			queryFn: async () => {
				const response = await axios.get(
					`${BASE_URL}/GetDepartmentRequest`
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			throwOnError: true,
			placeholderData: keepPreviousData,
			...opt,
		}),
}

export const addDepartmentRequest = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			DepartmentRequestPayload,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["addDepartmentRequest"],
			mutationFn: async (payload: DepartmentRequestPayload) => {
				const response = await axios.post(
					`${BASE_URL}/AddDepartmentRequest`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}

export const editDepartmentRequest = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			UpdateDepartmentRequestType,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["editDepartmentRequest"],
			mutationFn: async (payload: UpdateDepartmentRequestType) => {
				const response = await axios.post(
					`${BASE_URL}/updateDepartmentRequest`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}

export const getAllDivisionManager = {
	useQuery: (
		opt?: Omit<
			UseQueryOptions<DivisionManagerType[], Error>,
			"queryKey"
		> & { queryKey?: string[] }
	) =>
		useQuery({
			queryKey: ["getAllDivisionManager", "masterData"],
			queryFn: async () => {
				const response = await axios.get(
					`${BASE_URL}/GetDivisionManager`
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			throwOnError: true,
			placeholderData: keepPreviousData,
			staleTime: 1000 * 60 * 60,
			...opt,
		}),
}

export const addDivisionManager = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			DivisionManagerPayload,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["addDivisionManager"],
			mutationFn: async (payload: DivisionManagerPayload) => {
				const response = await axios.post(
					`${BASE_URL}/AddDivisionManager`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}

export const editDivisionManager = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			UpdateDivisionManagerType,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["editDivisionManager"],
			mutationFn: async (payload: UpdateDivisionManagerType) => {
				const response = await axios.post(
					`${BASE_URL}/UpdateDivisionManager`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}

export const getAllJobPosition = {
	useQuery: (
		opt?: Omit<UseQueryOptions<JobPositionType[], Error>, "queryKey"> & {
			queryKey?: string[]
		}
	) =>
		useQuery({
			queryKey: ["getAllJobPosition", "masterData"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/GetJobPosition`)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			throwOnError: true,
			placeholderData: keepPreviousData,
			staleTime: 1000 * 60 * 60,
			...opt,
		}),
}

export const addJobPosition = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			AddJobPositionPayloadType,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["addJobPosition"],
			mutationFn: async (payload: AddJobPositionPayloadType) => {
				const response = await axios.post(
					`${BASE_URL}/AddJobPosition`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}

export const editJobPosition = {
	useMutation: (
		opt?: UseMutationOptions<
			PostResponse,
			Error,
			EditJobPositionPayloadType,
			unknown
		>
	) => {
		return useMutation({
			mutationKey: ["editJobPosition"],
			mutationFn: async (payload: EditJobPositionPayloadType) => {
				const response = await axios.post(
					`${BASE_URL}/UpdateJobPosition`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(
						message ||
							"An error occurred while processing the request."
					)
				}

				return data
			},
			...opt,
		})
	},
}
