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

      console.log(videoUrl);
      // setVideoUrl(videoUrl);
    },
  });

  const start = async () => {
    // const data = await mutations.sendMediaFrame.mutate({
    //   payload: {
    //     data: new ArrayBuffer(2),
    //   },
    // });
    //
    // return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.current = recorder;

    let chunks: any[] = [];

    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        // chunks.push(event.data);

        const videoBlob = new Blob([event.data], { type: "video/webm" });

        const data = await mutations.sendMediaFrame.mutate({
          payload: {
            data: await videoBlob.arrayBuffer(),
          },
        });
      }
    };

    recorder.onstop = async () => {
      // const videoBlob = new Blob(chunks, { type: "video/webm" });
      // const videoUrl = URL.createObjectURL(videoBlob);
      // await mutations.sendMediaFrame.mutate({
      //   payload: {
      //     data: await videoBlob.arrayBuffer(),
      //   },
      // });
    };

    recorder.start(2000);
    video.current.srcObject = stream;
    video.current.autoplay = true;
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
      {videoUrl && <video ref={remoteVideo} autoPlay controls src={videoUrl} />}
    </div>
  );
};

export default ConferenceMainPanel;
