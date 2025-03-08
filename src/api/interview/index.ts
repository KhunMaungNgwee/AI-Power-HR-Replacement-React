import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { DepartmentRequestType, JobPositionType } from "../position/types";
import {
  AddInterviewRoundPayload,
  AgeRangeType,
  EducationLevelType,
  InterviewHistoryType,
  InterviewRoundType,
  ProvinceType,
  UpdateInterviewRoundPayload,
  UpdateInterviewRoundStatusPayload,
} from "./types";

const BASE_URL = "/Interview";

export const getAllInterviewRound = {
  useQuery: (opt?: UseQueryOptions<InterviewRoundType[], Error>) =>
    useQuery({
      queryKey: ["getAllInterviewRound"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllInterviewRound`);

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

export const getAllInterviewRoundApproved = {
  useQuery: (opt?: UseQueryOptions<InterviewRoundType[], Error>) =>
    useQuery({
      queryKey: ["getAllInterviewRoundApproved"],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetAllInterviewRoundApproved`
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

export const getAllAgeRange = {
  useQuery: (
    opt?: Omit<UseQueryOptions<AgeRangeType[], Error>, "queryKey"> & {
      queryKey?: string[];
    }
  ) =>
    useQuery({
      queryKey: ["getAllAgeRange", "masterData"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllAgeRange`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60,
      ...opt,
    }),
};

export const getAllProvince = {
  useQuery: (
    opt?: Omit<UseQueryOptions<ProvinceType[], Error>, "queryKey"> & {
      queryKey?: string[];
    }
  ) =>
    useQuery({
      queryKey: ["getAllProvince", "masterData"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllProvince`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60,
      ...opt,
    }),
};

export const getAllEducationLevel = {
  useQuery: (
    opt?: Omit<UseQueryOptions<EducationLevelType[], Error>, "queryKey"> & {
      queryKey?: string[];
    }
  ) =>
    useQuery({
      queryKey: ["getAllEducationLevel", "masterData"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllEducationLevel`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60,
      ...opt,
    }),
};

export const getAllDepartmentRequest = {
  useQuery: (
    opt?: Omit<UseQueryOptions<DepartmentRequestType[], Error>, "queryKey"> & {
      queryKey?: string[];
    }
  ) =>
    useQuery({
      queryKey: ["getAllDepartmentRequest", "masterData"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllDepartmentRequest`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60,
      ...opt,
    }),
};

export const getAllJobPosition = {
  useQuery: (opt?: UseQueryOptions<JobPositionType[], Error>) =>
    useQuery({
      queryKey: ["getAllJobPosition"],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAllJobPosition`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60,
      ...opt,
    }),
};

export const getInterviewHistoryByCandidateID = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<InterviewHistoryType[], Error>
  ) =>
    useQuery({
      queryKey: ["getInterviewHistoryByCandidateID", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetInterviewHistoryByCandidateID/${candidateID}`
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

export const addInterviewRound = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, AddInterviewRoundPayload, unknown>
  ) =>
    useMutation({
      mutationKey: ["addInterviewRound"],
      mutationFn: async (payload: AddInterviewRoundPayload) => {
        const response = await axios.post(
          `${BASE_URL}/AddInterviewRound`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    }),
};
export const createOnBoardingCandidate = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, string, unknown>
  ) =>
    useMutation({
      mutationKey: ["createOnBoardingCandidate"],
      mutationFn: async (id: string) => {
        const response = await axios.post(
          `${BASE_URL}/OnboardingCandidatesByInterviewID/${id}`
        );
        const { data, status, message } = response.data;
        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }
        return data;
      },
      ...opt,
    }),
};

export const updateInterviewRound = {
  useMutation: (
    opt?: UseMutationOptions<null, Error, UpdateInterviewRoundPayload, unknown>
  ) =>
    useMutation({
      mutationKey: ["updateInterviewRound"],
      mutationFn: async (payload: UpdateInterviewRoundPayload) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateInterviewRound`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    }),
};

export const updateInterviewRoundStatus = {
  useMutation: (
    opt?: UseMutationOptions<
      null,
      Error,
      UpdateInterviewRoundStatusPayload,
      unknown
    >
  ) =>
    useMutation({
      mutationKey: ["updateInterviewRoundStatus"],
      mutationFn: async (payload: UpdateInterviewRoundStatusPayload) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateInterviewRoundStatus`,
          payload
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    }),
};
