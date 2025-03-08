import { TimeStamps } from "@/shared/types";

export interface UploadIntoType extends TimeStamps {
  uploadIntoID: string;
  status: string;
  approveDate: string;
  recruiterID: string;
  recruiterName: string;
  docTypeList: {
    uploadIntoID: string;
    id: string;
    candidateID: string;
    status: string;
    documentType: string;
    dueDate: string;
    approveDate: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
export interface UploadDocType {
  uploadIntoID: string;
  id: string;
  candidateID: string;
  status: string;
  documentType: string;
  dueDate: string;
  approveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractOfEmploymentType extends TimeStamps {
  candidateID: string;
  contactNumber: string;
  salary: number;
  workStartDate: string;
  email: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
}

export interface AddContractOfEmploymentType {
  candidateID: string;
  contactNumber: string;
  salary: number;
  workStartDate: string;
  email: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
  uploadIntoID: string;
  dueDate: string;
}

export type CandidateID = string | undefined;

export interface ContractOfEmploymentResponseType extends TimeStamps {
  contractEmploymentID: string;
  candidateID: string;
  candidateName: string;
  contactNumber: string;
  salary: number;
  workStartDate: string;
  email: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
  commentedMemberName: string | null; //not available at the moment
  status: string; //only "waiting for candidate" for now
}

export interface UpdateContractOfEmploymentType {
  contractEmploymentID: string;
  candidateID: string;
  contactNumber: string;
  salary: number;
  workStartDate: string;
  email: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
}

export interface HealthCheckupType extends TimeStamps {
  healthCheckupID: string;
  candidateID: string;
  hospitalName: string;
  hospitalLocation: string;
  hospitalType: boolean;
  note: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
  status: string;
}

export interface MasterDocumentType extends TimeStamps {
  documentMasterID: string;
  name_En: string;
  name_Th: string;
}

export interface DocumentUploadType extends TimeStamps {
  documentUploadID: string;
  candidateID: string;
  comment: string;
  commentedMemberID: string;
  status: string;
  approveDate: string;
  dueDate: string;
  uploadIntoID: string;
  uploadedDocUrlList: UploadedDocumentListType[];
}

export interface UploadedDocumentListType {
  documentUrlID: string;
  documentMasterID: string;
  documentUploadID: string;
  candidateID: string;
  documentUrl: string;
}

export interface FilterType {
  documentUrlID?: string;
  documentMasterID: string;
  documentUploadID?: string;
  candidateID?: string;
  documentUrl: string;
}

export interface DocumentUploadPayloadType {
  candidateID: string;
  comment: string | undefined;
  commentedMemberID: string;
  dueDate: string;
  uploadIntoID: string;
  uploadedDocUrlList: DocumentUrlListPayloadType[];
}

export interface UpdateDocumentUploadPayloadType {
  documentUploadID: string;
  candidateID: string;
  comment: string | undefined;
  commentedMemberID: string;
  dueDate: string;
  uploadIntoID: string;
  uploadedDocUrlList: DocumentUrlListPayloadType[];
}

export interface DocumentUrlListPayloadType {
  documentMasterID: string;
  documentUrl: string;
}

export interface AddHealthCheckupPayloadType {
  uploadIntoID: string;
  candidateID: string;
  hospitalName: string;
  hospitalLocation: string;
  hospitalType: boolean;
  note: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
}

export interface UpdateHealthCheckupPayloadType {
  healthCheckupID: string;
  candidateID: string;
  hospitalName: string;
  hospitalLocation: string;
  hospitalType: boolean;
  note: string;
  documentUrl: string;
  comment: string;
  commentedMemberID: string;
  status: string;
}
