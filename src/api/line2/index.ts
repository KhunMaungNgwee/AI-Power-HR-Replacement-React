import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { F2FSlotType } from "./types";

const BASE_URL = "/Line2";

export const getF2FSlotByCandidateID = {
  useQuery: (candidateID: string, opt?: UseQueryOptions<F2FSlotType, Error>) =>
    useQuery({
      queryKey: ["getF2FSlotByCandidateID", candidateID],
      queryFn: async () => {
        const response = await axios.get(
          `${BASE_URL}/GetLineInterviewSlotByUserId?CandidateID=${candidateID}`
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
