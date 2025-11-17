import ConferenceMainPanel from "../main-panel/ui/ConferenceMainPanel";

type Props = {
  conferenceId: string;
};

const Conference = ({ conferenceId }: Props) => {
  return (
    <div className="p-[20px]">
      <ConferenceMainPanel conferenceId={conferenceId} />
    </div>
  );
};

export default Conference;
