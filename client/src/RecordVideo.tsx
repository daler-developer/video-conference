import { Button } from "@mantine/core";
import { useRef, useState } from "react";
import ws from "./ws.ts";

const RecordVideo = () => {
  const [recording, setRecording] = useState(false);
  const video = useRef<HTMLVideoElement>(null!);
  const mediaRecorder = useRef<MediaRecorder>(null);

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

      const msg = {
        type: "SEND_MEDIA_FRAME",
        payload: {
          foo: "bar",
        },
      };

      const json = JSON.stringify(msg);
      const jsonBytes = new TextEncoder().encode(json);

      const blobBuffer = new Uint8Array(await videoBlob.arrayBuffer());

      const metaLen = new Uint8Array(4);
      new DataView(metaLen.buffer).setUint32(0, jsonBytes.length);

      const full = new Uint8Array(4 + jsonBytes.length + blobBuffer.length);

      full.set(metaLen, 0);
      full.set(jsonBytes, 4);
      full.set(blobBuffer, 4 + jsonBytes.length);

      ws.send(full);
    };

    recorder.start(1000);
    video.current.srcObject = stream;
    video.current.autoplay = true;
  };

  const handleStop = () => {
    mediaRecorder.current!.stop();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
