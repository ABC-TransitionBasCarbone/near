import BroadcastingButton from "./BroadcastingButton";

interface BroadcastingPageProps {
  surveyType: SurveyType;
}

export type SurveyType = "su" | "ngc" | "mdv" | "mdd";

export type BroadcastType =
  | "mail_campaign"
  | "social_network"
  | "street_survey"
  | "qr_code";

const BroadcastingPage: React.FC<BroadcastingPageProps> = (
  props: BroadcastingPageProps,
) => {
  return (
    <>
      <div className="m-auto max-w-5xl space-y-10">
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
