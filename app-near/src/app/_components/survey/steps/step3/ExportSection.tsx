import ExportButton from "~/app/_components/export/ExportButton";

const ExportSection: React.FC = () => {
  console.log("todo");
  return (
    <div className="mx-20 flex max-w-full justify-end p-4">
      <ExportButton
        label="Exporter les réponses au questionnaire des SU"
        endPoint="/api/su/export"
      />
    </div>
  );
};

export default ExportSection;
