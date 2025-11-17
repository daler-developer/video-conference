import { Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import {
  useNewMediaFrameSub,
  useSendMediaFrameMutation,
  useGetConferenceParticipantsQuery,
} from "@/entity";

type Props = {
  conferenceId: string;
};

const ConferenceMainPanel = ({ conferenceId }: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const video = useRef<HTMLVideoElement>(null!);
  const remoteVideo = useRef<HTMLVideoElement>(null!);
  const mediaRecorder = useRef<MediaRecorder>(null!);
  const queue = useRef<any[]>([]);
  const sourceBuffer = useRef<SourceBuffer>(null);
  const isAppending = useRef<boolean>(false);
  const mediaStream = useRef<MediaStream>(null);

  const queries = {
    conferenceParticipants: useGetConferenceParticipantsQuery({
      params: { conferenceId },
    }),
  };

  const mutations = {
    sendMediaFrame: useSendMediaFrameMutation(),
  };

  // console.log(queries.conferenceParticipants.data);

  useEffect(() => {
    const mediaSource = new MediaSource();

    remoteVideo.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      sourceBuffer.current = mediaSource.addSourceBuffer(
        "video/webm;codecs=vp8,opus",
      );

      sourceBuffer.current.addEventListener("updateend", () => {
        isAppending.current = false;

        if (queue.current.length > 0) {
          appendNextChunk();
        }
      });

      // recorder.start(3000);
      // video.current.srcObject = stream;
      // video.current.autoplay = true;
    });
  }, []);

  useNewMediaFrameSub({
    params: {
      conferenceId: "hello_world",
    },
    onData({ data }) {
      // const blob = new Blob([data.data], {
      //   type: "video/webm",
      // });
      // const videoUrl = URL.createObjectURL(blob);

      // console.log(videoUrl);
      // setVideoUrl(videoUrl);

      // const blob = new Blob([data.data], {
      //   type: "video/webm",
      // });
      //
      // console.log(URL.createObjectURL(blob));

      queue.current.push(data.data);

      appendNextChunk();
    },
  });

  function appendNextChunk() {
    if (!sourceBuffer || isAppending.current || queue.current.length === 0)
      return;

    isAppending.current = true;
    const chunk = queue.current.shift();
    sourceBuffer.current.appendBuffer(chunk);
  }

  const start = async () => {
    mediaStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const recorder = new MediaRecorder(mediaStream.current, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    mediaRecorder.current = recorder;

    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        // const arrayBuffer = await event.data.arrayBuffer();

        const data = await mutations.sendMediaFrame.mutate({
          payload: {
            data: await event.data.arrayBuffer(),
          },
        });
        // queue.current.push(arrayBuffer);
        //
        // appendNextChunk();
      }
    };

    mediaRecorder.current.start(2000);
    video.current.srcObject = mediaStream.current;
    video.current.autoplay = true;

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

  const handleViewParticipants = () => {
    console.log(queries.conferenceParticipants.data);
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
        <Button type="button" onClick={handleViewParticipants}>
          See participants
        </Button>
      </div>
      <video ref={video}></video>
      <div>Video</div>
      <video ref={remoteVideo} autoPlay />
    </div>
  );
};

export default ConferenceMainPanel;
