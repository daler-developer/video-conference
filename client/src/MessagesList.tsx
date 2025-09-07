import { useGetMessagesQuery } from "@/entity";
import { useForceRender } from "@/shared/hooks";
import { useEffect } from "react";
import { Button } from "@mantine/core";

const MessagesList = () => {
  const forceRender = useForceRender();

  // console.log("render");

  // useEffect(() => {
  //   setInterval(() => {
  //     forceRender();
  //   }, 2000);
  // }, []);

  const queries = {
    messages: useGetMessagesQuery({
      params: {},
    }),
  };

  // console.log(queries.messages.data);

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <Button
        type="button"
        onClick={() => {
          queries.messages.refetch();
        }}
      >
        Refetch
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

        {queries.messages.isLoading && (
          <div>
            <h1>Loading</h1>
          </div>
        )}

        {queries.messages.isError && (
          <div>
            <h1>Error</h1>
          </div>
        )}

        {queries.messages.data && (
          <div>
            <ul>
              {queries.messages.data.list.map((message) => (
                <li key={message.id}>
                  <div>
                    <div>Id: {message.id}</div>
                    <div>Text: {message.text}</div>
                    <div>Likes count: {message.likesCount}</div>
                  </div>
                  <div style={{ paddingLeft: "30px" }}>
                    <div>Sender id: {message.sender.id}</div>
                    <div>Sender name: {message.sender.name}</div>
                    <div>Sender age: {message.sender.age}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {queries.messages.isError && (
          <div>
            <h1>Error</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
