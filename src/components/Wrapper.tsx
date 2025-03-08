import CandidateInformationView from "./../modules/candidate/information/CandidateInformationView";
import ReviewView from "@/modules/candidate/review/ReviewView";
import InterviewAnalysisView from "@/modules/interview-analysis/InterviewAnalysisView";
import CheckDocumentsView from "@/modules/pool/check-documents/CheckDocumentsView";
import SearchForCandidateView from "@/modules/pool/search-for-candidate/SearchForCandidateView";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "./ui/toaster";

import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";

import Loader from "@/components/Loader.tsx";
import LoginView from "@/modules/auth/login/LoginView";
import DepartmentRequestView from "@/modules/department-request/DepartmentRequestView";
import DivisionManagerView from "@/modules/division-manager/DivisionManagerView";
import CreateInterviewRoundView from "@/modules/interview-rounds/create-interview-rounds/CreateInterviewRoundView";
import InterviewRoundsView from "@/modules/interview-rounds/interview-rounds/InterviewRoundsView";
import InterviewRoundsResultsView from "@/modules/interview-rounds/results/InterviewRoundsResultsView";
import InterviewRoundsViewDetailsView from "@/modules/interview-rounds/view-details/InterviewRoundsViewDetailsView";

import NotFoundView from "@/modules/not-found/NotFoundView";
import OnboardView from "@/modules/on-board/OnboardView";
import PoolView from "@/modules/pool/PoolView";
import UploadInto from "@/modules/on-board/UploadInto/UploadInto";
import CreateInterviewRoundDetailsView from "@/modules/interview-rounds/create-interview-round-details/CreateInterviewRoundDetailsView";

import JRView from "@/modules/jr/JRView";
import JobRequisitionView from "@/modules/jr/job-requisition/JobRequisitionView";
import JobPositionView from "@/modules/jr/job-position/JobPositionView";
import ErrorView from "@/modules/error/ErrorView";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="/pool" replace />,
      },
      {
        path: "pool",
        element: <PoolView />,
        children: [
          {
            index: true,
            element: <Navigate to="check-documents" replace />,
          },
          {
            path: "check-documents",
            element: <CheckDocumentsView />,
          },
          {
            path: "search-for-candidate",
            element: <SearchForCandidateView />,
          },
          {
            path: "create-interview-round",
            element: <CreateInterviewRoundView />,
          },
        ],
      },
      {
        path: "pool/create-interview-round/view-details/:id",
        element: <CreateInterviewRoundDetailsView />,
      },
      {
        path: "interview-rounds",
        element: <InterviewRoundsView />,
      },
      {
        path: "interview-rounds/results/:id",
        element: <InterviewRoundsResultsView />,
      },
      {
        path: "interview-rounds/view-details/:id",
        element: <InterviewRoundsViewDetailsView />,
      },
      {
        path: "on-board",
        element: <OnboardView />,
      },
      {
        path: "candidate-information/:id",
        element: <CandidateInformationView />,
      },
      {
        path: "review/:id",
        element: <ReviewView />,
      },
      {
        path: "upload-into/:id",
        element: <UploadInto />,
      },
      {
        id: "department-request",
        path: "department-request",
        element: <DepartmentRequestView />,
      },
      {
        id: "division-manager",
        path: "division-manager",
        element: <DivisionManagerView />,
      },
      {
        id: "job-position",
        path: "job-position",
        element: <JobPositionView />,
      },
      {
        path: "jr",
        element: <JRView />,
        children: [
          {
            index: true,
            element: <Navigate to="" replace />,
          },
          {
            path: "job-requisition",
            element: <JobRequisitionView />,
          },
          {
            path: "job-position",
            element: <JobPositionView />,
          },
        ],
      },
    ],
  },
  {
    path: "interview-analysis/:id",
    errorElement: <ErrorView />,
    element: <InterviewAnalysisView />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
]);

const Wrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.DEV ? false : "always", // close refetch on window focus in development
      },
    },
  });

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Loader />
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default Wrapper;
