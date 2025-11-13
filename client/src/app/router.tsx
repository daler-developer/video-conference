import { createBrowserRouter } from "react-router";
import {
  HomePage,
  StartVideoConferencePage,
  ROUTE_PATH,
  ConferencePage,
  ConferencePreviewPage,
} from "@/pages";

export const router = createBrowserRouter([
  {
    path: ROUTE_PATH.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTE_PATH.START_VIDEO_CONFERENCE,
    element: <StartVideoConferencePage />,
  },
  {
    path: ROUTE_PATH.START_VIDEO_CONFERENCE,
    element: <StartVideoConferencePage />,
  },
  {
    path: ROUTE_PATH.CONFERENCE,
    element: <ConferencePage />,
  },
  {
    path: ROUTE_PATH.CONFERENCE_PREVIEW,
    element: <ConferencePreviewPage />,
  },
]);
