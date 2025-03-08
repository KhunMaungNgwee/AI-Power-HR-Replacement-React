import { TimeStamps } from "@/shared/types";

export interface VideoType extends TimeStamps {
  responseID: number;
  candidateID: string;
  questionID: number;
  responseUrl: string;
  questionThai: string;
  questionEnglish: string;
}

export interface BasicQuestionAnswerType extends TimeStamps {
  basicResponseID: string;
  candidateID: string;
  basicQuestionID: string;
  questionFlag: boolean;
  basicQuestionEn: string;
  basicQuestionTh: string;
}

export interface UpdateCandidateDocumentPayload {
  documentID: number;
  candidateID: string;
  idCardUrl: string;
  houseRegistrationUrl: string;
  educationLevelUrl: string;
  cvUrl: string;
}

export interface QuestionAndAnswerType extends TimeStamps {
  analysisID: number;
  candidateID: string;
  questionID: number;
  questionThai: string;
  questionEnglish: string;
  answer: string;
  score: number;
  reason_Score: string;
}

export interface CVDetailsType extends TimeStamps {
  candidateCVResultID: string;
  candidateID: string;
  candidateDocumentID: number;
  name: string;
  recommendedPosition: string;
  profileSummary: string;
  score: number;
  reasonScore: string;
}

export interface CandidateData extends TimeStamps {
  candidateID: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  province: string;
  company: string;
  profileUrl: string;
  curFaceUrl: string;
  heatmapUrl: string;
  originalUrl: string;
  plotUrl: string;
  videoUrl: string;
  cvUrl: string;
  totalScore: number;
  neutral_plot_url: string;
  happiness_plot_url: string;
  sadness_plot_url: string;
  surprise_plot_url: string;
  fear_plot_url: string;
  disgust_plot_url: string;
  anger_plot_url: string;
  workShiftFlag: boolean;
  workOvertimeFlag: boolean;
  criminalOffenseFlag: boolean;
  statusDocument: string;
  statusInterview: string;
  region: string;
  city: string;
  questionAndAnswerAnalysis: QuestionAndAnswerType[];
  cvDetail: CVDetailsType;
  basicQuestionAnswer: BasicQuestionAnswerType[];
  degree: string;
  interviewerName: string;
  interviewRecordUrl: string;
  interviewScore: number;
  documentID: number;
  idCardUrl: string;
  houseRegistrationUrl: string;
  educationalQualificationUrl: string;
  cvUrl: string;
  commentApprover: string;
  f2FStatus: string;
  statusScoreCheck: string;
}

export interface CandidateHistoryType extends TimeStamps {
  candidateHistoryID: strings;
  candidateID: string;
  documentType: string;
  documentID: string;
  historyDetails: string;
}

export interface UpdateStatusInterviewPayload {
  candidateID: string;
  interviewerName: string;
  interviewScore: number;
  interviewRecordUrl: string;
  commentApprover: string | undefined;
  statusScoreCheck: string;
  // statusInterview: string
}

export interface InterviewPayloadType {
  candidateID: string;
  commentMessage: string;
  commentedByID: string | null;
}

export interface CommentByCandidateIdType {
  interviewCommentID: string;
  candidateID: string;
  candidateName: string;
  commentMessage: string;
  commentedByID: string;
  commentedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardCandidateType extends TimeStamps {
  candidateID: string;
  candidateName: string;
  uploadIntoStatus: string;
  phoneNumber: string;
  jobPosition: string;
  f2FStatus: null | string;
  recruiterStatus: string;
  uploadIntoStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentReadyType extends TimeStamps {
  candidateID: string;
  interviewID: string;
  divisionManagerID: string;
  jobPositionID: string;
  division: string;
  candidateName: string;
  approveDate: string;
  f2FStatus: null | string;
  score: null | string;
  scoreDate: string;
  backgroundCheck: boolean;
  otherDocumentUrls: DocListType[];
}

export interface DocListType extends TimeStamps {
  docID: string;
  docName: string;
  docUrl: string;
}

export interface UpdateBackgroundCheck {
  candidateID: string;
  backgroundCheck: boolean;
}
