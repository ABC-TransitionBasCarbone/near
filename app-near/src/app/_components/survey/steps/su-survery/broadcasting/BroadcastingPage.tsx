import { type SurveyType } from "../../../../../../types/enums/broadcasting";
import BroadcastingButton from "./BroadcastingButton";

interface BroadcastingPageProps {
  surveyType: SurveyType;
}

const BroadcastingPage: React.FC<BroadcastingPageProps> = (
  props: BroadcastingPageProps,
) => {
  return (
    <>
      <div className="m-auto mt-16 max-w-5xl space-y-10 px-8">
        <BroadcastingButton
          broadcastType={"street_survey"}
          surveyType={props.surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={"mail_campaign"}
          surveyType={props.surveyType}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={"social_network"}
          surveyType={"su"}
        />

        <hr className="max-w-sm text-grayLight" />

        <BroadcastingButton
          broadcastType={"qr_code"}
          surveyType={props.surveyType}
        />
      </div>
    </>
  );
};

export default BroadcastingPage;
