import {
  useGetUsersQuery,
  useGetUsersLazyQuery,
  useNewMediaFrameSub,
} from "@/entity";
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

  // console.log(queries.getUsers.data?.list[0].name);
  // console.log(queries.getUsers.data?.list[0].age);

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
          // queries.getUsers.fetch();
        }}
      >
        Fetch
      </Button>

      <Button
        type="button"
        onClick={() => {
          queries.getUsers.refetch();
        }}
      >
        Refetch
      </Button>

      <Button
        type="button"
        onClick={() => {
          queries.getUsers.fetchMore();
        }}
      >
        Fetch More
      </Button>

      <div>
        {queries.getUsers.isIdle && (
          <div>
            <h1>Idle</h1>
          </div>
        )}

        {queries.getUsers.isRefetching && (
          <div>
            <h1>Refetching</h1>
          </div>
        )}

        {queries.getUsers.isLoading && (
          <div>
            <h1>Loading</h1>
          </div>
        )}

        {queries.getUsers.isFetchingMore && (
          <div>
            <h1>Fetching more</h1>
          </div>
        )}

        {queries.getUsers.isError && (
          <div>
            <h1>Error</h1>
          </div>
        )}

        {queries.getUsers.isSuccess && (
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
