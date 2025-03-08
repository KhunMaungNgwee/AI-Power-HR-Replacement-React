import { TimeStamps } from "@/shared/types";

export interface InterviewRoundType extends TimeStamps {
  interviewID: string;
  type: string;
  refQrID: string;
  departmentRequestID: string;
  departmentRequestName: string;
  provinceID: string;
  provinceName: string;
  divisionManager: string;
  divisionManagerID: string;
  educationLevelID: string;
  educationLevelName: string;
  jobPositionID: string;
  jobPositionName: string;
  ageRangeID: string;
  ageRange: string;
  jobDescription: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  slot1Date: string;
  slot1Time: string;
  slot2Date: string;
  slot2Time: string;
  slot3Date: string;
  slot3Time: string;
  noCVPassed: number;
  qrImageLink: string;
  onBoardPeopleCount: number;
  peopleCount: number;
}

export interface CandidateByInterviewId extends TimeStamp {
  candidateID: string;
  documentID: number;
  name: string;
  phoneNumber: string;
  divisionManagerID: string;
  divisionManagerName: string;
  email: string;
  idCardFlag: boolean;
  houseRegistrationFlag: boolean;
  educationLevelFlag: boolean;
  cvFlag: boolean;
  statusDocument: string;
  statusInterview: string;
  country: string;
  expectedSalary: number;
  currency: string;
  interviewID: string;
  f2FStatus: string | null;
  statusScoreCheck: string | null;
  commentApprover: string | null;
  interviewScore: number;
  type: string | null;
  province: string | null;
  educationLevel: string | null;
  source: string | null;
  jobPosition: string | null;
}

export interface ProvinceType extends TimeStamps {
  name_EN: string;
  name_TH: string;
  provinceID: string;
}

export interface AgeRangeType extends TimeStamps {
  ageRangeID: string;
  ageRange: string;
}

export interface EducationLevelType extends TimeStamps {
  educationLevelID: string;
  educationLevelName: string;
}

export interface InterviewHistoryType extends TimeStamps {
  interviewHistoryID: string;
  candidateID: string;
  interviewComment: string;
  score: number;
  status: boolean;
  result: string;
  approverName: string;
}

export interface AddInterviewRoundPayload {
  refQrID: string;
  departmentRequestID: string;
  provinceID: string;
  divisionManagerID: string;
  educationLevelID: string;
  jobPositionID: string;
  ageRangeID: string;
  jobDescription: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  noCVPassed: number;
  qrImageLink: string;
  type: string;
}

export interface UpdateInterviewRoundPayload {
  interviewID: string;
  refQrID: string;
  departmentRequestID: string;
  provinceID: string;
  divisionManagerID: string;
  educationLevelID: string;
  jobPositionID: string;
  ageRangeID: string;
  jobDescription: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  noCVPassed: number;
  qrImageLink: string;
  type: string;
}

export interface UpdateInterviewRoundStatusPayload {
  interviewID: string;
  status: string;
}

export interface InterviewQuestionnaireType {
  questionnaire: string;
  answer: string;
  score: string;
}

export interface InterviewScoreType {
  interviewScore: string;
  answer: string;
  score: string;
}

export type onBoardingCandidatesType = {
  interviewID: string;
};

export interface AgeRangeType extends TimeStamps {
  ageRangeID: string;
  ageRange: string;
}
