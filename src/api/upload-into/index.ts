import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddContractOfEmploymentType,
  AddHealthCheckupPayloadType,
  CandidateID,
  ContractOfEmploymentResponseType,
  DocumentUploadPayloadType,
  DocumentUploadType,
  HealthCheckupType,
  MasterDocumentType,
  UpdateContractOfEmploymentType,
  UpdateDocumentUploadPayloadType,
  UpdateHealthCheckupPayloadType,
  UploadIntoType,
} from "./types";
import { PostResponse } from "../position/types";

const BASE_URL = "/UploadInto";

export const getUploadIntoById = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<UploadIntoType, Error>
  ) =>
    useQuery({
      queryKey: ["getUploadIntoById", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/getUploadIntoById/${candidateID}`
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

export const getContractOfEmploymentByCandidateId = {
  useQuery: (
    candidateID: CandidateID,
    opt?: UseQueryOptions<ContractOfEmploymentResponseType, Error>
  ) =>
    useQuery<ContractOfEmploymentResponseType, Error>({
      queryKey: ["getContractOfEmploymentByCandidateId", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetContractEmploymentByID/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      ...opt,
    }),
};

export const addContractOfEmploymentById = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddContractOfEmploymentType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addContractOfEmploymentById"],
      mutationFn: async (payload: AddContractOfEmploymentType) => {
        const response = await axios.post(
          `${BASE_URL}/AddContractEmployment`,
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

export const editContractOfEmploymentById = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateContractOfEmploymentType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["editContractOfEmploymentById"],
      mutationFn: async (payload: UpdateContractOfEmploymentType) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateContractEmployment`,
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

export const getHealthCheckupByCandidateId = {
  useQuery: (
    candidateID: CandidateID,
    opt?: UseQueryOptions<HealthCheckupType, Error>
  ) =>
    useQuery<HealthCheckupType, Error>({
      queryKey: ["getHealthCheckupByCandidateId", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetHealthCheckupByID/${candidateID}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      placeholderData: keepPreviousData,
      ...opt,
    }),
};

export const addHealthCheckup = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddHealthCheckupPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addHealthCheckup"],
      mutationFn: async (payload: AddHealthCheckupPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/AddHealthCheckup`,
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

export const editHealthCheckup = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateHealthCheckupPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["editHealthCheckup"],
      mutationFn: async (payload: UpdateHealthCheckupPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/UpdateHealthCheckup`,
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

export const getAllMasterDocumentList = {
  useQuery: (opt?: UseQueryOptions<MasterDocumentType[], Error>) =>
    useQuery({
      queryKey: ["getAllMasterDocumentList"],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetAllMasterDocumentList`
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

export const getDocumentUploadByID = {
  useQuery: (
    candidateID: string,
    opt?: UseQueryOptions<DocumentUploadType, Error>
  ) =>
    useQuery({
      queryKey: ["getDocumentUploadByID", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetDocumentUploadByID/${candidateID}`
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

export const addDocumentUpload = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      DocumentUploadPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addDocumentUpload"],
      mutationFn: async (payload: DocumentUploadPayloadType) => {
        const response = await axios.post(
          `${BASE_URL}/AddDocumentUpload`,
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

export const updateDocumentUpload = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateDocumentUploadPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateDocumentUpload"],
      mutationFn: async (payload: UpdateDocumentUploadPayloadType) => {
        const response = await axios.put(
          `${BASE_URL}/UpdateDocumentUpload`,
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

export const updateStatusForDocumentUploadByID = {
  useMutation: (
    opt?: UseMutationOptions<PostResponse, Error, string, unknown>
  ) => {
    return useMutation({
      mutationKey: ["updateStatusForDocumentUploadByID"],
      mutationFn: async (documentUploadID: string) => {
        const response = await axios.put(
          `${BASE_URL}/UpdateStatusForDocumentUploadByID/${documentUploadID}`
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

export const updateStatusforContractOfEmpByID = {
  useMutation: (
    opt?: UseMutationOptions<PostResponse, Error, string, unknown>
  ) => {
    return useMutation({
      mutationKey: ["updateStatusforContractOfEmpByID"],
      mutationFn: async (contractEmploymentID: string) => {
        const response = await axios.put(
          `${BASE_URL}/UpdateStatusForContractofEmpByID/${contractEmploymentID}`
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
export const approvedHealthCheckUp = {
  useMutation: (
    opt?: UseMutationOptions<PostResponse, Error, string, unknown>
  ) => {
    return useMutation({
      mutationKey: ["approvedHealthCheckUp"],
      mutationFn: async (healthCheckupID: string) => {
        const response = await axios.put(
          `${BASE_URL}/ApprovedHealthCheckUp/${healthCheckupID}`
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
