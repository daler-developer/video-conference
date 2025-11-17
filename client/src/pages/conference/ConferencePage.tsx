import { useParams } from "react-router";
import { Conference } from "@/modules/conference";
import { useUserJoinedConferenceSub } from "@/entity";

const ConferencePage = () => {
  const { id: conferenceId } = useParams();

  useUserJoinedConferenceSub({
    params: {
      conferenceId: conferenceId!,
    },
    onData({ data }) {},
  });

  return (
    <div>
      <Conference conferenceId={conferenceId!} />
    </div>
  );
};

export default ConferencePage;
