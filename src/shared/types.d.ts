export type APIResponse<T> = {
  message: string;
  status: number; // 0 is success
  data: T;
};

export type TimeChoiceType = {
  value: string;
  text: string;
};

export interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface CandidateType extends TimeStamps {
  candidateID: string;
  documentID: number;
  name: string;
  phoneNumber: string;
  ageRange: string;
  email: string;
  idCardFlag: boolean;
  houseRegistrationFlag: boolean;
  educationLevelFlag: boolean;
  cvFlag: boolean;
  statusDocument: string;
  statusInterview: string;
  country: string | null;
  expectedSalary: number | null;
  currency: string | null;
  interviewID: string | null;
  f2FStatus: null | string;
  statusScoreCheck: null | string;
  commentApprover: null | string;
  interviewScore: null | string;
  type: null | string;
  province: null | string;
  educationLevel: null | string;
  source: string;
  jobPosition: null | string;
}

export interface CandidateDetailsType extends TimeStamps {
  candidateID: string;
  documentID: number;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  educationalQualification: string;
  email: string;
  address: string;
  province: string;
  company: string;
  profileUrl: string;
  idCardUrl: string;
  houseRegistrationUrl: string;
  educationLevelUrl: string;
  cvUrl: string;
  workShiftFlag: boolean;
  workOvertimeFlag: boolean;
  criminalOffenseFlag: boolean;
  status: string;
  basicCandidateAnswerList: CandidateAnswerType[];
  idCardObject?: IDCardType;
  type: "HO" | "OP";
  houseRegistrationsObject?: HouseRegistrationType;
  educationalQualifications?: EducationalQualificationType;
}

export interface IDCardType extends TimeStamps {
  idCardID: string;
  candidateID: string;
  identificationNumber: string;
  name: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  dateOfIssue: string;
  dateOfExpiry: string;
}

export interface HouseRegistrationType extends TimeStamps {
  houseRegistrationID: string;
  candidateID: string;
  registrationNumber: string;
  registrationOffice: string;
  houseAddress: string;
  villageName: string;
  houseName: string;
  houseType: string;
  houseCharacteristics: string;
  name: string;
  nationality: string;
  gender: string;
  nationalIdNumber: string;
  mother: string;
  father: string;
  origin: string;
  houseNumberAssignmentDate: string;
  dateOfBirth: string;
  registeredDate: Date;
}

export interface EducationalQualificationType extends TimeStamps {
  qualificationID: string;
  candidateID: string;
  name: string;
  studentID: string;
  dateOfBirth: string;
  ssn: string;
  program: string;
  degree: string;
  major: string;
  status: string;
  issueTo: string;
  graduationDate: string;
}

export interface CandidateAnswerType extends TimeStamps {
  basicResponseID: string;
  candidateID: string;
  basicQuestionID: string;
  questionFlag: boolean;
  basicQuestionEn: string;
  basicQuestionTh: string;
}

export interface JobRequisitionType extends TimeStamps {
  jobRequisition: string;
  position: string;
  headCount: string | number;
  requestBy: string;
}
