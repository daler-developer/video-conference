import { useGetUsersQuery, useNewMediaFrameSub } from "@/entity";
import { useForceRender } from "@/shared/hooks";
import { useEffect } from "react";
import { Button } from "@mantine/core";

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

  // useNewMediaFrameSub({
  //   params: {
  //     conferenceId: "hello_world",
  //   },
  //   onData({ data }) {
  //     console.log("data", data);
  //   },
  // });

  return (
    <div>
      <Button
        type="button"
        onClick={() => {
          queries.getUsers.fetchMore();
        }}
      >
        Fetch More
      </Button>

      <div>
        {queries.getUsers.status === "fetching" && (
          <div>
            <h1>Loading</h1>
          </div>
        )}

        {queries.getUsers.status === "fetching-more" && (
          <div>
            <h1>Fetching more</h1>
          </div>
        )}

        {queries.getUsers.status === "error" && (
          <div>
            <h1>Error</h1>
          </div>
        )}

        {queries.getUsers.data && (
          <div>
            <ul>
              {queries.getUsers.data!.list.map((user) => (
                <li key={user.id}>
                  Name {user.name}; Age: {user.age}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
