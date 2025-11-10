import { Button } from "@mantine/core";
import { useRef, useState } from "react";
import { useNewMediaFrameSub, useSendMediaFrameMutation } from "@/entity";

const ConferenceMainPanel = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const video = useRef<HTMLVideoElement>(null!);
  const remoteVideo = useRef<HTMLVideoElement>(null!);
  const mediaRecorder = useRef<MediaRecorder>(null);

  const mutations = {
    sendMediaFrame: useSendMediaFrameMutation(),
  };

  useNewMediaFrameSub({
    params: {
      conferenceId: "hello_world",
    },
    onData({ data }) {
      const blob = new Blob([data.data], {
        type: "video/webm",
      });
      const videoUrl = URL.createObjectURL(blob);

      // console.log(videoUrl);
      setVideoUrl(videoUrl);
    },
  });

  const start = async () => {
    const queue: any[] = [];
    let isAppending = false;
    const mediaSource = new MediaSource();

    remoteVideo.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      const sourceBuffer = mediaSource.addSourceBuffer(
        "video/webm;codecs=vp8,opus",
      );

      sourceBuffer.addEventListener("updateend", () => {
        isAppending = false;

        if (queue.length > 0) {
          appendNextChunk();
        }
      });

      function appendNextChunk() {
        if (!sourceBuffer || isAppending || queue.length === 0) return;
        isAppending = true;
        const chunk = queue.shift();
        sourceBuffer.appendBuffer(chunk);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      mediaRecorder.current = recorder;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          queue.push(arrayBuffer);

          appendNextChunk();
        }
      };

      recorder.start(3000);
      video.current.srcObject = stream;
      video.current.autoplay = true;
    });

    // -------

    // const data = await mutations.sendMediaFrame.mutate({
    //   payload: {
    //     data: new ArrayBuffer(2),
    //   },
    // });
    //
    // return;
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
    //
    // const recorder = new MediaRecorder(stream, {
    //   mimeType: "video/webm;codecs=vp9,opus",
    // });
    //
    // mediaRecorder.current = recorder;
    //
    // let chunks: any[] = [];
    //
    // recorder.ondataavailable = async (event) => {
    //   if (event.data.size > 0) {
    //     const url = URL.createObjectURL(event.data);
    //
    //     console.log(url);
    //     setVideoUrl(url);
    //   }
    // };

    // chunks.push(event.data);

    // const data = await mutations.sendMediaFrame.mutate({
    //   payload: {
    //     data: await videoBlob.arrayBuffer(),
    //   },
    // });

    // recorder.onstop = async () => {
    // const videoBlob = new Blob(chunks, { type: "video/webm" });
    // const videoUrl = URL.createObjectURL(videoBlob);
    // await mutations.sendMediaFrame.mutate({
    //   payload: {
    //     data: await videoBlob.arrayBuffer(),
    //   },
    // });
    // };

    // recorder.start(2000);
    // video.current.srcObject = stream;
    // video.current.autoplay = true;
  };

  const handleStop = () => {
    mediaRecorder.current!.stop();
  };

  return (
    <div>
      <div className="flex gap-2">
        <Button type="button" onClick={start}>
          Start
        </Button>
        <Button type="button" onClick={handleStop}>
          Stop
        </Button>
      </div>
      <video ref={video}></video>
      <div>Video</div>
      {String(videoUrl)}
      <video ref={remoteVideo} autoPlay controls />
    </div>
  );
};

export default ConferenceMainPanel;
