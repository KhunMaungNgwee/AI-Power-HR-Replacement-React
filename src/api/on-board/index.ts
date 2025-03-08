import axios from "axios";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { InterviewSummeryType } from "./types";
const BASE_URL = "/Interview";
export const getInterviewSummeryByID = {
    useQuery: (
      id: string,
      opt?: Omit<UseQueryOptions<InterviewSummeryType | null | undefined, Error>, "queryKey" | "queryFn">
    ) =>
      useQuery({
        queryKey: ["getInterviewSummeryByID", id],
        queryFn: async () => {
          const response = await axios.get(`${BASE_URL}/GetInterviewSummary/${id}`);
  
          const { data, status, message } = response.data;   
  
          if (status !== 0) {
            throw new Error(message);
          }
  
          return data;
        },
        enabled: !!id, 
        throwOnError: true,
        ...opt,
      }),
  };