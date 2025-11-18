import { Loader } from "@mantine/core";

const FullscreenLoading = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Loader color="gray" size="xl" variant="oval" />
    </div>
  );
};

export default FullscreenLoading;
