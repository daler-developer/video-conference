import { useParams } from "react-router";
import { Conference } from "@/modules/conference";
import { useUserJoinedConferenceSub } from "@/entity";

const ConferencePage = () => {
  const { id: conferenceId } = useParams();

  useUserJoinedConferenceSub({
    params: {
      conferenceId: conferenceId!,
    },
    onData({ data }) {
      console.log("data", data);
    },
  });

  return (
    <div>
      <Conference id={1} />
    </div>
  );
};

export default ConferencePage;
