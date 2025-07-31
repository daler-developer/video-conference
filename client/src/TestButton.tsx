import { Button } from "@mantine/core";
import { StartSessionError, useStartSession } from "@/entity";

const TestButton = () => {
  const mutations = {
    startSession: useStartSession(),
  };

  const test = async () => {
    // updateData({ limit: 23, search: "adf" }, (prev) => {
    //   return {
    //     ...prev,
    //     list: [
    //       ...prev.list,
    //       {
    //         id: counter++,
    //         name: "a1",
    //         age: 20,
    //       },
    //     ],
    //   };
    // });
    // const incomingMessage = await websocketClient.sendMessage({
    //   meta: {
    //     messageId: String(Date.now()),
    //   },
    //   type: "GET_USERS",
    //   payload: {
    //     limit: 10,
    //     search: "Hello",
    //   },
    // });
    // console.log(incomingMessage);
    // startMutation({
    //   payload: {
    //     fullName: "Saidov Daler",
    //   },
    // }).then(({ data, error }) => {
    //   if (data) {
    //     console.log(data.accessToken);
    //   }
    //   if (error) {
    //     if (error.errorIs("SECOND")) {
    //       console.log(error.details.age);
    //     }
    //   }
    // });
    try {
      const { data } = await mutations.startSession.mutate({
        payload: {
          fullName: "test",
        },
        handleError(e) {
          // if (e.errorIs("VALIDATION")) {
          //   console.log(e.details.foo);
          // }
        },
      });
    } catch (e) {
      if (e instanceof StartSessionError) {
        const startSessionError = e as InstanceType<typeof StartSessionError>;

        if (startSessionError.errorIs("VALIDATION")) {
        }
      }
    }
  };

  return (
    <Button
      type="button"
      onClick={() => {
        test();
      }}
    >
      Test
    </Button>
  );
};

export default TestButton;
