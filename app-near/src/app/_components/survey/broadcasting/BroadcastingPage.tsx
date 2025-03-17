import { type SurveyType } from "~/types/enums/survey";
import BroadcastingButton from "./BroadcastingButton";

interface BroadcastingPageProps {
  surveyType: SurveyType;
}

const BroadcastingPage: React.FC<BroadcastingPageProps> = ({ surveyType }) => {
  return (
    <>
      <div className="m-auto my-16 max-w-5xl space-y-10 px-8">
        <BroadcastingButton
          broadcastType={"street_survey"}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={"mail_campaign"}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={"social_network"}
          surveyType={surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton broadcastType={"qr_code"} surveyType={surveyType} />
      </div>
    </>
  );
};

export default BroadcastingPage;
