import { Button } from "@mantine/core";
import { Link } from "react-router";
import { buildRoutePath } from "@/pages";

const StartVideoConferencePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Button
        component={Link}
        variant="outline"
        color="blue"
        className="px-6"
        to={buildRoutePath.HOME()}
      >
        ← Back
      </Button>
    </div>
  );
};

export default StartVideoConferencePage;
