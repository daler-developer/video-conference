import { useGetUsersQuery, useNewMediaFrameSub } from "@/entity";

const Subscribe = () => {
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
  //     console.log("event", data.data);
  //   },
  // });

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
