import { useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { useStartSession } from "@/entity";

const StartSession = () => {
  const [value, setValue] = useState("");

  const mutations = {
    startSession: useStartSession(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValue("");

    const data = await mutations.startSession.mutate({
      payload: {
        fullName: value,
      },
      handleError(e) {
        alert("error");
        // console.log("error");
        // console.log(e);
        // if (e.is("SECOND")) {
        //   console.log(e.details);
        // }
        // if (e.is("VALIDATION")) {
        //   console.log(e.details.foo);
        // }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "100px" }}>
      <TextInput
        placeholder="Type something..."
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        mb="sm"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default StartSession;
