import { Button } from "@mantine/core";
import { useRef, useState } from "react";
import { useSendMediaFrame } from "@/entity";
import { sendMediaFrameMessage } from "./websocket/sendMessage/sendMessageFrameMessage.ts";

const RecordVideo = () => {
  const [recording, setRecording] = useState(false);
  const video = useRef<HTMLVideoElement>(null!);
  const mediaRecorder = useRef<MediaRecorder>(null);

  const mutations = {
    sendMediaFrame: useSendMediaFrame(),
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.current = recorder;

    let chunks: any[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });

      const { data } = await mutations.sendMediaFrame.mutate({
        payload: {
          data: await videoBlob.arrayBuffer(),
        },
      });

      console.log(data);
    };

    recorder.start(1000);
    video.current.srcObject = stream;
    video.current.autoplay = true;
  };

  const handleStop = () => {
    mediaRecorder.current!.stop();
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Button type="button" onClick={start}>
        Start
      </Button>
      <Button type="button" onClick={handleStop}>
        Stop
      </Button>
      {<video ref={video}></video>}
    </div>
  );
};

export default RecordVideo;
