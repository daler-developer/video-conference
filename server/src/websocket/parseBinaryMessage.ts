const parseBinaryMessage = ({
  data,
  isBinary,
}: {
  data: any;
  isBinary: boolean;
}) => {
  if (isBinary) {
    const view = new DataView(data.buffer);
    const metaLength = view.getUint32(0);

    const jsonBuffer = Buffer.from(data.buffer.slice(4, 4 + metaLength));
    const parsedMessage = JSON.parse(jsonBuffer.toString());
    const parsedBinary = Buffer.from(data.buffer.slice(4 + metaLength));

    return {
      message: parsedMessage,
      binary: parsedBinary,
    };
  } else {
    return {
      message: JSON.parse(data),
      binary: null,
    };
  }
};

export default parseBinaryMessage;
