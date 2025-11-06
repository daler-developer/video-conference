import { createBrowserRouter } from "react-router";
import { HomePage, StartVideoConferencePage, ROUTE_PATH } from "@/pages";

export const router = createBrowserRouter([
  {
    path: ROUTE_PATH.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTE_PATH.START_VIDEO_CONFERENCE,
    element: <StartVideoConferencePage />,
  },
]);
