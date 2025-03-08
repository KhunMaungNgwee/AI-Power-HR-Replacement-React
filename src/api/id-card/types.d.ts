import {
    EducationalQualificationType,
    HouseRegistrationType,
    IDCardType,
} from "@/shared/types"

export type OCRPayload = {
	url: string
	candidateId: string
}

export interface SaveIdCardPayload
	extends Omit<IDCardType, "createdAt", "updatedAt"> {
	idCardID?: string | null
	candidateID: string
    createdAt?: string
    updatedAt?: string
}

export interface SaveHouseRegistrationPayload
	extends Omit<HouseRegistrationType, "createdAt", "updatedAt"> {
	houseRegistrationID?: string | null
	candidateID: string
    createdAt?: string
    updatedAt?: string
}

export interface SaveEducationQualificationPayload
	extends Omit<EducationalQualificationType, "createdAt", "updatedAt"> {
	qualificationID?: string | null
	candidateID: string
    createdAt?: string
    updatedAt?: string
}
