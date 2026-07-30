import { render, fireEvent, waitFor } from "@testing-library/react";
import BroadcastingButton from "./BroadcastingButton";
import { BroadcastType } from "../../../../types/enums/broadcasting";
import { SurveyType } from "~/types/enums/survey";

jest.mock("../../../../env", () => ({
  env: {
    NEXT_PUBLIC_TYPEFORM_SU_LINK: "https://example.com",
  },
}));

const mutateAsyncMock = jest
  .fn()
  .mockResolvedValue("https://example.com/survey-link");

jest.mock("../../../../trpc/react", () => ({
  api: {
    surveyLinks: {
      build: {
        useMutation: jest.fn(() => ({
          mutateAsync: mutateAsyncMock,
        })),
      },
    },
  },
}));

const writeTextMock = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: writeTextMock,
  },
});

describe("BroadcastingButton", () => {
  const surveyType: SurveyType = SurveyType.SU;
  const broadcastType: BroadcastType = BroadcastType.MAIL_CAMPAIGN;

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it("builds the link via the surveyLinks.build mutation and copies it on click", async () => {
    const { getByText, findByText } = render(
      <BroadcastingButton
        surveyType={surveyType}
        broadcastType={broadcastType}
      />,
    );

    fireEvent.click(getByText("Générer un lien email"));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        broadcastType,
        surveyType,
      });
    });
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        "https://example.com/survey-link",
      );
    });
    expect(await findByText("Lien copié !")).toBeInTheDocument();
  });

  it("shows an error message when the mutation fails", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("failed"));

    const { getByText, findByText } = render(
      <BroadcastingButton
        surveyType={surveyType}
        broadcastType={broadcastType}
      />,
    );

    fireEvent.click(getByText("Générer un lien email"));

    expect(
      await findByText("Veuillez réessayer plus tard"),
    ).toBeInTheDocument();
    expect(writeTextMock).not.toHaveBeenCalled();
  });
});
