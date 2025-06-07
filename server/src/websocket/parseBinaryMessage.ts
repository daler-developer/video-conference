const parseBinaryMessage = (message: any) => {
  if (Buffer.isBuffer(message)) {
    const view = new DataView(message.buffer);
    const metaLength = view.getUint32(0);

    const jsonBuffer = Buffer.from(message.buffer.slice(4, 4 + metaLength));
    const parsedMessage = JSON.parse(jsonBuffer.toString());
    const parsedBinary = Buffer.from(message.buffer.slice(4 + metaLength));

    return {
      message: parsedMessage,
      binary: parsedBinary,
    };
  } else {
    return {
      message: JSON.parse(message),
      binary: null,
    };
  }
};

export default parseBinaryMessage;
