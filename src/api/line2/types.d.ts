import { TimeStamps } from "@/shared/types";

export interface F2FSlotType extends TimeStamps {
  lineInterviewSlotID: string;
  lineUserID: null | string;
  divisionManagerID: string;
  candidateID: string;
  divisionManager: string;
  jobPosition: string;
  slotDate1: string;
  slotTime1: string;
  slotDate2: string;
  slotTime2: string;
  slotDate3: string;
  slotTime3: string;
  selectSlot1Flag: boolean;
  selectSlot2Flag: boolean;
  selectSlot3Flag: boolean;
}
