import { ListBulletIcon } from "@radix-ui/react-icons";
import {
  BoxIcon,
  MessageCircleQuestion,
  SquareUserRound,
  User,
} from "lucide-react";

export const sidebarData = [
  {
    routeNames: [
      "/pool/check-documents",
      "/pool/search-for-candidate",
      "/pool/create-interview-round",
    ],
    name: "title.pool",
    icon: BoxIcon,
    subMenu: [],
  },
  {
    routeNames: [
      "/interview-rounds",
      "/interview-rounds/results/:id",
      "/interview-rounds/view-details/:id",
    ],
    name: "title.interview",
    icon: SquareUserRound,
    subMenu: [],
  },
  {
    routeNames: ["/on-board"],
    name: "title.on-board",
    icon: MessageCircleQuestion,
    subMenu: [],
  },
  {
    routeNames: ["/department-request"],
    name: "title.department-request",
    icon: ListBulletIcon,
    subMenu: null,
  },
  {
    routeNames: ["/division-manager"],
    name: "title.division-manager",
    icon: ListBulletIcon,
    subMenu: null,
  },
  {
    routeNames: ["/jr/job-requisition", "/jr/job-position"],
    name: "title.jr",
    icon: User,
    subMenu: [],
  },
];
