import { handleCarbonFootprintEmail } from "./handleCarbonFootprintEmail";
import { buildRequest } from "../test-utils/request/buildRequest";
import { signPayload } from "../typeform/signature";
import { SignatureType } from "../typeform/signature";
import { db } from "../db";
import EmailService from "../email";
import { clearAllSurveys } from "../test-utils/clear/survey";

describe.only("handleCarbonFootprintEmail", () => {
  const email = "email@mail.com";

  let sendEmailMock: jest.SpyInstance;

  beforeEach(async () => {
    await clearAllSurveys();
    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 when wrong body", async () => {
    const payload = { email: "wrong-email" };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid request body");
  });

  it("should return 401 when signature is invalid", async () => {
    const payload = { email };

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, "wrong-signature"),
    );

    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Not authorized");
  });

  it("should create email and return 201 when email is new", async () => {
    const payload = { email };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toContain("Email processed");

    const contact = await db.ngcContact.findUnique({ where: { email } });
    expect(contact).toBeTruthy();
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [expect.objectContaining({ email })],
      }),
    );
  });

  it("should return 200 if email already exists and not create a duplicate", async () => {
    await db.ngcContact.create({
      data: {
        email,
        createdAt: new Date("2025-05-01T00:00:00Z"),
      },
    });

    const payload = { email };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Email processed");

    const contacts = await db.ngcContact.findMany({ where: { email } });
    expect(contacts.length).toBe(1);

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [expect.objectContaining({ email })],
      }),
    );
  });
});
