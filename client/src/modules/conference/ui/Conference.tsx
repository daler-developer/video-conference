import ConferenceMainPanel from "../main-panel/ui/ConferenceMainPanel";

type Props = {
  id: number;
};

const Conference = ({ id }: Props) => {
  return (
    <div className="p-[20px]">
      <ConferenceMainPanel />
    </div>
  );
};

export default Conference;
