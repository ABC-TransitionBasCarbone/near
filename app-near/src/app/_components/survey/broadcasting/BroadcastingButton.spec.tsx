import { render } from "@testing-library/react";
import BroadcastingButton from "./BroadcastingButton";
import {
  SurveyType,
  type BroadcastType,
} from "../../../../types/enums/broadcasting";

jest.mock("../../../../env", () => ({
  env: {
    NEXT_PUBLIC_TYPEFORM_SU_LINK: "https://example.com",
  },
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { firstName: "Test User" } },
    status: "authenticated",
  })),
}));

jest.mock("../../../../trpc/react", () => ({
  api: {
    surveys: {
      getOne: {
        useQuery: jest.fn().mockResolvedValue({ name: "survey_name" }),
      },
    },
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("BroadcastingButton", () => {
  const surveyType: SurveyType = SurveyType.SU;
  const broadcastType: BroadcastType = "mail_campaign";

  it("renders correctly with given props", () => {
    const { getByText } = render(
      <BroadcastingButton
        surveyType={surveyType}
        broadcastType={broadcastType}
      />,
    );

    expect(getByText("Enquête par email ou message")).toBeInTheDocument();
    expect(
      getByText(
        "Générer un lien unique à intégrer dans vos emails ou vos messages",
      ),
    ).toBeInTheDocument();
    expect(getByText("Générer un lien email")).toBeInTheDocument();
  });
});
