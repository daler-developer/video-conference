import {
  useGetUsersQuery,
  useGetUsersLazyQuery,
  useNewMediaFrameSub,
  GetUsersQueryError,
  useGetUsersInfiniteQuery,
  useGetUsersInfiniteLazyQuery,
} from "@/entity";
import { useForceRender } from "@/shared/hooks";
import { useEffect } from "react";
import { Button } from "@mantine/core";

const UsersList = () => {
  const forceRender = useForceRender();

  // useEffect(() => {
  //   setInterval(() => {
  //     forceRender();
  //   }, 2000);
  // }, []);

  const queries = {
    getUsers: useGetUsersInfiniteQuery({
      params: {
        limit: 23,
        search: "adf",
      },
    }),
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <Button
        type="button"
        onClick={async () => {
          try {
            await queries.getUsers.fetch();
          } catch (e) {
            console.dir(e);
          }
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
        {/*{queries.getUsers.isIdle && (*/}
        {/*  <div>*/}
        {/*    <h1>Idle</h1>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*{queries.getUsers.isRefetching && (*/}
        {/*  <div>*/}
        {/*    <h1>Refetching</h1>*/}
        {/*  </div>*/}
        {/*)}*/}

        {queries.getUsers.isLoading && (
          <div>
            <h1>Loading</h1>
          </div>
        )}

        {queries.getUsers.isError && (
          <div>
            <h1>Error</h1>
          </div>
        )}

        {queries.getUsers.data && (
          <div>
            <ul>
              {queries.getUsers.data.list.map((user) => (
                <li key={user.id}>
                  Name {user.name}; Age: {user.age}
                </li>
              ))}
            </ul>
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

        {queries.getUsers.error && queries.getUsers.error.is("VALIDATION") && (
          <div>{JSON.stringify(queries.getUsers.error.details)}</div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
