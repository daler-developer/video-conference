import { createMessageSender } from "../utils.ts";

type Payload = {
  data: ArrayBuffer;
};

export const sendMediaFrameMessage = createMessageSender<Payload>({
  type: "NEW_MEDIA_FRAME",
});
