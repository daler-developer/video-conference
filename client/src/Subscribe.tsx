import { useGetUsersQuery, useNewMediaFrameSub } from "@/entity";
import { useForceRender } from "@/shared/hooks";
import { useEffect } from "react";

const Subscribe = () => {
  const forceRender = useForceRender();

  // useEffect(() => {
  //   setInterval(() => {
  //     forceRender();
  //   }, 2000);
  // }, []);

  const queries = {
    getUsers: useGetUsersQuery({
      params: {
        limit: 23,
        search: "adf",
      },
    }),
  };

  useNewMediaFrameSub({
    params: {
      conferenceId: "hello_world",
    },
    onData({ data }) {
      // console.log("data", data);
    },
  });

  if (queries.getUsers.status === "fetching") {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  if (queries.getUsers.status === "error") {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  if (queries.getUsers.status === "success") {
    return (
      <div>
        <ul>
          {queries.getUsers.data!.list.map((user) => (
            <li key={user.id}>
              Name {user.name}; Age: {user.age}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default Subscribe;
