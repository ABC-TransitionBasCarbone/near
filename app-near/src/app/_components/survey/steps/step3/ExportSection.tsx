import ExportButton from "~/app/_components/export/ExportButton";
import { SurveyType } from "~/types/enums/survey";

const ExportSection: React.FC = () => {
  return (
    <div className="mx-20 flex max-w-full justify-end p-4">
      <ExportButton
        label="Exporter les réponses au questionnaire des SU"
        surveyType={SurveyType.SU}
      />
    </div>
  );
};

export default ExportSection;
