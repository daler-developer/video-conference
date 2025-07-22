// import _ from "lodash";
// import {
//   type BaseEventSubDataIncomingMessage,
//   onEventSubDataMessage,
// } from "./listenMessage/onEventSubDataMessage.ts";
// import {
//   type BaseEventSubOutgoingMessage,
//   sendEventSubMessage,
// } from "./sendMessage/sendEventSubMessage.ts";
// import useLatest from "../../shared/hooks/useLatest.ts";
// import { useEffect } from "react";
// import { sendEventUnsubMessage } from "./sendMessage/sendEventUnsubMessage.ts";
//
// type HookOptions<
//   TOutgoingMessage extends BaseEventSubOutgoingMessage,
//   TEventSubDataIncomingMessage extends BaseEventSubDataIncomingMessage,
// > = {
//   eventParams: TOutgoingMessage["payload"]["eventParams"];
//   onData: (onDataOptions: { message: TEventSubDataIncomingMessage }) => void;
// };
//
// export const createEventSub = <
//   TOutgoingMessage extends BaseEventSubOutgoingMessage,
//   TEventSubDataIncomingMessage extends BaseEventSubDataIncomingMessage,
// >({
//   eventName,
// }: {
//   eventName: TOutgoingMessage["payload"]["eventName"];
// }) => {
//   const eventSub = async ({
//     eventParams,
//     callback,
//   }: {
//     eventParams: TOutgoingMessage["payload"]["eventParams"];
//     callback: (callbackArg: { message: TEventSubDataIncomingMessage }) => void;
//   }) => {
//     try {
//       const { response } = await sendEventSubMessage({
//         payload: {
//           eventName,
//           eventParams,
//         },
//       });
//     } catch (e) {
//       console.dir(e.incomingMessage);
//     }
//
//     const unsubscribe = onEventSubDataMessage((message) => {
//       if (
//         message.payload.eventName === eventName &&
//         _.isEqual(eventParams, message.payload.eventParams)
//       ) {
//         callback({ message: message as TEventSubDataIncomingMessage });
//       }
//     });
//
//     return {
//       stopEventSub() {
//         sendEventUnsubMessage({
//           payload: {
//             eventName,
//             eventParams,
//           },
//         });
//         unsubscribe();
//       },
//     };
//   };
//
//   const useHook = ({
//     eventParams,
//     onData,
//   }: HookOptions<TOutgoingMessage, TEventSubDataIncomingMessage>) => {
//     const latestOnData = useLatest(onData);
//     const latestEventParams = useLatest(eventParams);
//
//     useEffect(() => {
//       const { stopEventSub } = eventSub({
//         eventParams: latestEventParams.current,
//         callback: latestOnData.current,
//       });
//
//       return () => {
//         stopEventSub();
//       };
//     }, []);
//   };
//
//   return {
//     hook: useHook,
//   };
// };
