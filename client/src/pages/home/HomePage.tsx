import { Button, Group } from "@mantine/core";
import { useNavigate } from "react-router";
import { buildRoutePath } from "@/pages";
import {
  StartSessionFormModal,
  type StartSessionFormModalHandle,
  getIsAuthenticated,
} from "@/modules/session";
import { useRef } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  const startSessionFormModal = useRef<StartSessionFormModalHandle>(null!);

  const handleStartVideoConference = async () => {
    if (!getIsAuthenticated()) {
      await startSessionFormModal.current.open();
    }

    navigate(buildRoutePath.START_VIDEO_CONFERENCE());
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Group className="flex flex-col gap-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleStartVideoConference}
          >
            Start Conference
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Join Conference
          </Button>
        </Group>
      </div>

      <StartSessionFormModal ref={startSessionFormModal} />
    </>
  );
};

export default HomePage;
