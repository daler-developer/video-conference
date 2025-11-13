import { Button } from "@mantine/core";
import { useJoinConferenceMutation } from "@/entity";
import { useParams } from "react-router";

const ConferencePreviewPage = () => {
  const { id: conferenceId } = useParams();

  const mutations = {
    sendMediaFrame: useJoinConferenceMutation(),
  };

  const handleJoin = async () => {
    const data = await mutations.sendMediaFrame.mutate({
      payload: {
        conferenceId,
      },
      handleError(e) {
        console.log(e);
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Button size="lg" color="blue" radius="md" onClick={handleJoin}>
        Join
      </Button>
    </div>
  );
};

export default ConferencePreviewPage;
