import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import axios from "axios";

import type {
  BasicQuestionType,
  MasterQuestionType,
  UpdateBasicQuestionPayloadType,
  UpdateMasterQuestionPayloadType,
  PostResponse,
} from "./types";

const BASE_URL = "/Position";

export const getBasicQuestionsByID = {
  useQuery: (
    id: string,
    opt?: Omit<
      UseQueryOptions<BasicQuestionType[], Error>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["getBasicQuestionsByID", id],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetBasicQuestionByID/${id}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      enabled: !!id,
      throwOnError: true,
      placeholderData: keepPreviousData,
      ...opt,
    }),
};

export const getMasterQuestionsByID = {
  useQuery: (
    id: string,
    opt?: Omit<
      UseQueryOptions<MasterQuestionType[], Error>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["getMasterQuestionsByID", id],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetMasterQuestionByID/${id}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      enabled: !!id,
      throwOnError: true,
      placeholderData: keepPreviousData,
      ...opt,
    }),
};

export const updateMasterQuestion = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateMasterQuestionPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateMasterQuestion"],
      mutationFn: async (payload: UpdateMasterQuestionPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateMasterQuestion`,
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
    });
  },
};

export const updateBasicQuestion = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateBasicQuestionPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateBasicQuestion"],
      mutationFn: async (payload: UpdateBasicQuestionPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateBasicQuestion`,
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
    });
  },
};
