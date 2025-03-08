import { TimeStamps } from "@/shared/types"

export interface DepartmentRequestType extends TimeStamps {
	departmentRequestID: string
	departmentRequestName: string
	address: string
}

export type DepartmentRequestPayload = {
	departmentRequestName: string
	address: string
}

export interface PostResponse {
	data: string
	status: number
	message: string
}

export interface UpdateDepartmentRequestType {
	departmentRequestID: string
	departmentRequestName: string
	address: string
}

export interface DivisionManagerType extends TimeStamps {
	divisionManagerID: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	position: string
	lineCode: string
	lineUserID: string
}

export interface UpdateDivisionManagerType {
	divisionManagerID: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	position: string
	lineCode: string
	lineUserID: string
}

export type DivisionManagerPayload = {
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	position: string
	lineCode: string
	lineUserID?: string
}

export interface AddDepartmentResponse {
	data: string
	status: number
	message: string
}

export type BasicQuestionType = {
	basicQuestionID?: string
	jobPositionID?: string
	question: string
	questionTh: string
	createdAt?: string
	updatedAt?: string
}

export type MasterQuestionType = {
	questionID: number
	jobPositionID: string
	questionThai: string
	questionEnglish: string
	createdAt: string
	updatedAt: string
}

export interface JobPositionType extends TimeStamps {
	jobPositionID: string
	divisionManagerID: string
	jobDescription: string
	positionName: string
	jobLevel: string
	basicQuestionList: BasicQuestionType[]
	masterQuestionsList: MasterQuestionType[]
}

export type MasterQuestion = {
	questionThai: string
	questionEnglish: string
}

export type BasicQuestion = {
	question: string
	questionTh: string
}

export interface AddJobPositionPayloadType {
	divisionManagerID: string
	jobDescription: string
	positionName: string
	jobLevel: string
	addQuestionList?: MasterQuestion[] | undefined
	addBasicQuestionList?: BasicQuestion[] | undefined
}

export interface EditJobPositionPayloadType {
	jobPositionID: string
	divisionManagerID: string
	jobDescription: string
	positionName: string
	jobLevel: string
	updateQuestionList?: MasterQuestion[] | undefined
	updateBasicQuestionList?: BasicQuestion[] | undefined
}

