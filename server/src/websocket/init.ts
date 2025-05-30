import WebSocket from 'ws';
import { Server } from 'http';

enum MESSAGE_TYPE {
  EVENT_SUB = 'EVENT_SUB',
}

enum EVENT_NAME {
  NEW_AUDIO_CHUNK = 'NEW_AUDIO_CHUNK',
  CONFERENCE_NEW_PARTICIPANT_JOINED = 'CONFIG_NEW_PARTICIPANT_JOINED',
}

type ConferenceNewParticipantJoinedMessage = {
  type: MESSAGE_TYPE.EVENT_SUB;
  eventName: EVENT_NAME.CONFERENCE_NEW_PARTICIPANT_JOINED;
  params: {
    conferenceId: string;
  };
};

const initEventHandlers = () => {};

const init = (server: Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      // if (data.eventName)
    });

    ws.on('close', () => {});
  });
};

export default init;
