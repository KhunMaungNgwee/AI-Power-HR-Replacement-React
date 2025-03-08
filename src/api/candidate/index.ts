import { CandidateDetailsType, CandidateType } from "@/shared/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  CandidateData,
  CandidateHistoryType,
  CommentByCandidateIdType,
  DocumentReadyType,
  InterviewPayloadType,
  OnboardCandidateType,
  UpdateBackgroundCheck,
  UpdateCandidateDocumentPayload,
  UpdateStatusInterviewPayload,
  VideoType,
} from "./types";
import { CandidateByInterviewId } from "../interview/types";

const BASE_URL = "/Candidate";

export const getCandidates = {
  useQuery: (opt?: UseQueryOptions<CandidateType[], Error>) =>
    useQuery<CandidateType[], Error>({
      queryKey: ["getCandidates"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetCandidateFromAdmin`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getCandidateByCandidateID = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<CandidateDetailsType, Error>
  ) =>
    useQuery({
      queryKey: ["getCandidateByCandidateID", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetCandidateByIDFromAdmin/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getVideosByCandidateId = {
  useQuery: (candidateID: string, opt?: UseQueryOptions<VideoType[], Error>) =>
    useQuery<VideoType[], Error>({
      queryKey: ["getCandidateVideos", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetInterviewVideoByCandidateID/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getCandidateHistory = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<CandidateHistoryType[], Error>
  ) =>
    useQuery({
      queryKey: ["getCandidateHistory", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetCandidateHistory/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const updateCandidateDocument = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, UpdateCandidateDocumentPayload, void>
  ) =>
    useMutation({
      mutationKey: ["updateCandidateDocument"],
      mutationFn: async (payload: UpdateCandidateDocumentPayload) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateCandidateDocument`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const updateStatusDocument = {
  useMutation: (opt?: UseMutationOptions<null, Error, string, unknown>) =>
    useMutation({
      mutationKey: ["updateStatusDocument"],
      mutationFn: async (candidateId: string) => {
        const response = await axios.put(
          `${BASE_URL}/UpdateStatusDocument/${candidateId}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};

export const getInterviewDetails = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<CandidateData, Error>
  ) =>
    useQuery({
      queryKey: ["getInterviewDetails", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetInterviewDetails/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const updateStatusInterview = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, UpdateStatusInterviewPayload, unknown>
  ) =>
    useMutation({
      mutationKey: ["updateStatusInterview"],
      mutationFn: async (payload: UpdateStatusInterviewPayload) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateStatusInterview`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};

export const getCandidateByInterviewID = {
  useQuery: (
    interviewID: string,
    opt?: UseQueryOptions<CandidateByInterviewId[], Error>
  ) =>
    useQuery({
      queryKey: ["getCandidateByInterviewID", interviewID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetCandidateByInterviewID/${interviewID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const addInterviewComment = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, InterviewPayloadType, unknown>
  ) =>
    useMutation({
      mutationKey: ["addInterviewComment"],
      mutationFn: async (payload: InterviewPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/AddInterviewComment`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};

export const getCommentByCandidate = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<CommentByCandidateIdType[], Error>
  ) =>
    useQuery({
      queryKey: ["getCommentByCandidate", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetInterviewCommentByCandidateID/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getAllOnboardCandidates = {
  useQuery: (opt?: UseQueryOptions<OnboardCandidateType[], Error>) =>
    useQuery<OnboardCandidateType[], Error>({
      queryKey: ["getAllOnboardCandidates"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllOnboardCandidates`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const deleteCandidateByID = {
  useMutation: (
    candidateID: string,
    opt?: UseMutationOptions<null, Error, unknown>
  ) =>
    useMutation({
      mutationKey: ["deleteCandidateByID", candidateID],
      mutationFn: async (candidateID: string) => {
        const response = await axios.delete(
          `${BASE_URL}/DeleteCandidateByID/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};

export const getDocumentReadyByCandidateID = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<DocumentReadyType, Error>
  ) =>
    useQuery({
      queryKey: ["getDocumentReadyByCandidateID", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetDocumentReadyByCandidateIDV2/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const updateCandidateBackgroundCheck = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, UpdateBackgroundCheck, unknown>
  ) =>
    useMutation({
      mutationKey: ["updateCandidateBackgroundCheck"],
      mutationFn: async (payload: UpdateBackgroundCheck) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateCandidateBackgroundCheck`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};

export const updateRecruiterStatusByCandidateID = {
  useMutation: (opt?: UseMutationOptions<null, Error, string, unknown>) =>
    useMutation({
      mutationKey: ["updateRecruiterStatusByCandidateID"],
      mutationFn: async (candidateId: string) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateRecruiterStatusByCandidateID/${candidateId}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      ...opt,
    }),
};
