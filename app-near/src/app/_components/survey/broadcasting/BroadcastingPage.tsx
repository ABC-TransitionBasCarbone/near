import { type SurveyType } from "~/types/enums/survey";
import BroadcastingButton from "./BroadcastingButton";
import { BroadcastType } from "~/types/enums/broadcasting";

interface BroadcastingPageProps {
  surveyType: SurveyType;
}

const BroadcastingPage: React.FC<BroadcastingPageProps> = ({ surveyType }) => {
  return (
    <>
      <div className="m-auto my-16 max-w-5xl space-y-10 px-8">
        <BroadcastingButton
          broadcastType={BroadcastType.STREET_SURVEY}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={BroadcastType.MAIL_CAMPAIGN}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={BroadcastType.SOCIAL_NETWORK}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={BroadcastType.QR_CODE}
          surveyType={surveyType}
        />
      </div>
    </>
  );
};

export default BroadcastingPage;
