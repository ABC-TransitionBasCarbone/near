import LegalNotes from "./LegalNotes";
import PersonalData from "./PersonalData";

const LegalComponent: React.FC = async () => {
  return (
    <div className="mx-auto my-8 flex max-w-[1200px] flex-col gap-6">
      <LegalNotes />
      <PersonalData />
    </div>
  );
};

export default LegalComponent;
