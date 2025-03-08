import { TimeStamps } from "@/shared/types";

export interface InterviewSummeryType extends TimeStamps {
  candidateID: string;
  interviewID: string | null;
  divisionManagerID: string | null;
  jobPositionID: string | null;
  division: string;
  candidateName: string;
  approveDate: string | null;
  f2FStatus: string | null;
  score: number | null;
  scoreDate: string | null;
  jobPosition: string | number | readonly string[] | undefined;
  age: string | number | readonly string[] | undefined;
  salary: string | number | readonly string[] | undefined;
  employmentDate: string | number | readonly string[] | undefined;
  otherDetails: string | number | readonly string[] | undefined;
  statusDocument: boolean | null;
}
