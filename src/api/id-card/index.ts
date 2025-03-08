import {
	EducationalQualificationType,
	HouseRegistrationType,
	IDCardType,
} from "@/shared/types"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import axios from "axios"
import {
	OCRPayload,
	SaveEducationQualificationPayload,
	SaveHouseRegistrationPayload,
	SaveIdCardPayload,
} from "./types"

const BASE_URL = "/IDCard"

export const callOCRIdCard = {
	useMutation: (
		opt?: UseMutationOptions<IDCardType, Error, OCRPayload, unknown>
	) =>
		useMutation({
			mutationKey: ["callOCRIdCard"],
			mutationFn: async (payload: OCRPayload) => {
				const response = await axios.post(
					`${BASE_URL}/CallOCRIDCardApi`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}

export const saveIdCard = {
	useMutation: (
		opt?: UseMutationOptions<null, Error, SaveIdCardPayload, unknown>
	) =>
		useMutation({
			mutationKey: ["saveIdCard"],
			mutationFn: async (payload: SaveIdCardPayload) => {
				const response = await axios.post(
					`${BASE_URL}/AddIDCard`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}

export const callOCRHouseRegistration = {
	useMutation: (
		opt?: UseMutationOptions<
			HouseRegistrationType,
			Error,
			OCRPayload,
			unknown
		>
	) =>
		useMutation({
			mutationKey: ["callOCRHouseRegistration"],
			mutationFn: async (payload: OCRPayload) => {
				const response = await axios.post(
					`${BASE_URL}/CallOCRHouseRegistrationApi`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}

export const saveHouseRegistration = {
	useMutation: (
		opt?: UseMutationOptions<
			null,
			Error,
			SaveHouseRegistrationPayload,
			unknown
		>
	) =>
		useMutation({
			mutationKey: ["saveHouseRegistration"],
			mutationFn: async (payload: SaveHouseRegistrationPayload) => {
				const response = await axios.post(
					`${BASE_URL}/AddHouseRegistration`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}

export const callOCREducationQualification = {
	useMutation: (
		opt?: UseMutationOptions<
			EducationalQualificationType,
			Error,
			OCRPayload,
			unknown
		>
	) =>
		useMutation({
			mutationKey: ["callOCREducationQualification"],
			mutationFn: async (payload: OCRPayload) => {
				const response = await axios.post(
					`${BASE_URL}/CallOCREducationalQualificationApi`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}

export const saveEducationQualification = {
	useMutation: (
		opt?: UseMutationOptions<
			null,
			Error,
			SaveEducationQualificationPayload,
			unknown
		>
	) =>
		useMutation({
			mutationKey: ["saveEducationQualification"],
			mutationFn: async (payload: SaveEducationQualificationPayload) => {
				const response = await axios.post(
					`${BASE_URL}/AddEducationalQualification`,
					payload
				)

				const { data, status, message } = response.data

				if (status !== 0) {
					throw new Error(message)
				}

				return data
			},
			...opt,
		}),
}
