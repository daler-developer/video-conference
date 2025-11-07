import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, TextInput } from "@mantine/core";
import { Link } from "react-router";
import { buildRoutePath } from "@/pages";
import { useStartConference } from "@/entity";

interface FormValues {
  name: string;
}

const StartVideoConferencePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const mutations = {
    startConference: useStartConference(),
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutations.startConference.mutate({
      payload: {
        name: values.name,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[500px]"
      >
        <div className="self-start">
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

        <TextInput
          label="Conference name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
          disabled={mutations.startConference.isPending}
        />

        <Button
          type="submit"
          color="blue"
          loading={mutations.startConference.isPending}
        >
          Start
        </Button>
      </form>
    </div>
  );
};

export default StartVideoConferencePage;
