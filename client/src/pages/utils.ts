export const ROUTE_NAME = {
  HOME: "HOME",
  START_VIDEO_CONFERENCE: "START_VIDEO_CONFERENCE",
  CONFERENCE: "CONFERENCE",
  CONFERENCE_PREVIEW: "CONFERENCE_PREVIEW",
} as const;

export const ROUTE_PATH = {
  [ROUTE_NAME.HOME]: "/home",
  [ROUTE_NAME.START_VIDEO_CONFERENCE]: "/conference/start",
  [ROUTE_NAME.CONFERENCE]: "/conference/:id",
  [ROUTE_NAME.CONFERENCE_PREVIEW]: "/conference/:id/preview",
};

export const buildRoutePath = {
  [ROUTE_NAME.HOME]({ roomId }: { roomId?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (roomId) {
      searchParams.set("roomId", String(roomId));
    }
    return ROUTE_PATH.HOME + "?" + searchParams.toString();
  },
  [ROUTE_NAME.START_VIDEO_CONFERENCE]() {
    return ROUTE_PATH[ROUTE_NAME.START_VIDEO_CONFERENCE];
  },
  [ROUTE_NAME.CONFERENCE](id: number) {
    return ROUTE_PATH[ROUTE_NAME.CONFERENCE].replace(":id", String(id));
  },
  [ROUTE_NAME.CONFERENCE_PREVIEW](id: number) {
    return ROUTE_PATH[ROUTE_NAME.CONFERENCE_PREVIEW].replace(":id", String(id));
  },
};
