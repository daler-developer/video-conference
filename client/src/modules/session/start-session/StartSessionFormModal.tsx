import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal, Button, TextInput, Avatar, Text } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStartSession } from "@/entity";
import {
  type Session,
  sessionManager,
} from "@/modules/session/SessionManager.ts";
import { websocketClient } from "@/modules/websocket";

const schema = yup
  .object({
    fullName: yup.string().required("Full name is required"),
  })
  .required();

type FormValues = {
  fullName: string;
};

export type StartSessionFormModalHandle = {
  open: () => Promise<void>;
};

const StartSessionFormModal = forwardRef<StartSessionFormModalHandle>(
  (_, ref) => {
    const [opened, setOpened] = useState(false);

    const isSavedSessionSelected = useRef(false);

    const mutations = {
      startSession: useStartSession(),
    };

    const form = useForm<FormValues>({
      resolver: yupResolver(schema),
    });

    const promiseResolveFunc = useRef<any>(null!);

    const mutate = async ({ fullName }: { fullName: string }) => {
      return await mutations.startSession.mutate({
        payload: {
          fullName,
        },
      });
    };

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
      const { accessToken } = await mutate({ fullName: values.fullName });

      websocketClient.disconnect();
      await websocketClient.connect(accessToken);

      sessionManager.startSession(accessToken);

      // if (isSavedSessionSelected.current) {
      //   sessionManager.moveSavedSessionToTop();
      // }

      if (!isSavedSessionSelected.current) {
        sessionManager.saveSession({
          fullName: values.fullName,
        });
      }

      setOpened(false);
      form.reset();
      isSavedSessionSelected.current = false;
      promiseResolveFunc.current();
    };

    useImperativeHandle(ref, () => ({
      async open() {
        setOpened(true);

        return new Promise((res) => {
          promiseResolveFunc.current = res;
        });
      },
    }));

    const triggerSubmit = form.handleSubmit(onSubmit);

    const handleStartSavedSession = async (session: Session, index: number) => {
      form.setValue("fullName", session.fullName);

      isSavedSessionSelected.current = true;

      await triggerSubmit();

      sessionManager.moveSavedSessionToTop(index);
    };

    const sessions = sessionManager.getSavedSessions();

    return (
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Start Session"
        yOffset={50}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-2"
        >
          <TextInput
            label="Full name"
            placeholder="Enter your full name"
            disabled={mutations.startSession.isPending}
            {...form.register("fullName")}
          />

          <Button loading={form.formState.isLoading} type="submit" color="blue">
            Start
          </Button>
        </form>

        {sessions.length > 0 && (
          <div className="w-full max-w-sm mx-auto mt-6">
            <Text size="lg" fw={600} className="mb-4 text-gray-800 text-left">
              Recent Sessions
            </Text>

            <div className="divide-y divide-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
              {sessions.map((session, i) => (
                <button
                  key={i}
                  onClick={() => handleStartSavedSession(session, i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Avatar
                    src="https://i.pravatar.cc/150?img=1"
                    alt={session.fullName}
                    radius="xl"
                    size="md"
                  />
                  <span className="text-gray-800 font-medium">
                    {session.fullName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    );
  },
);

export default StartSessionFormModal;
