import {
  AirTravelFrequency,
  DigitalIntensity,
  HeatSource,
  MeatFrequency,
  PurchasingStrategy,
  SurveyPhase,
  TransportationMode,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type SuComputationData } from "~/types/SuDetection";
import { db } from "../db";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { computeSu } from "./computeSu";
import apiSuService from "../external-api/api-su";
import { ErrorCode } from "~/types/enums/error";
import { clearAllSurveys } from "../test-utils/clear/survey";

describe("computeSu", () => {
  const surveyId = 765;
  let apiSuSpy: jest.SpyInstance;

  beforeEach(async () => {
    await clearAllSurveys();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    apiSuSpy = jest.spyOn(apiSuService, "computeSus");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(
    Object.values(SurveyPhase).filter(
      (phase) => phase !== SurveyPhase.STEP_3_SU_EXPLORATION,
    ),
  )(`should not compute su when phase is %s`, async (phase) => {
    expect.assertions(1);
    await db.survey.create({
      data: {
        id: surveyId,
        name: "test-compute-su",
        phase,
        computedSu: false,
      },
    });

    try {
      await computeSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("FORBIDDEN");
      }
    }
  });

  it("should throw error if api call failed", async () => {
    await createSurvey(surveyId);
    await createSuAnswers(surveyId);

    apiSuSpy.mockReturnValue(new Error("Mocked Error"));

    expect.assertions(1);
    try {
      await computeSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.message).toBe(ErrorCode.UNEXPECTED_COMPUTE_SU_ERROR);
      }
    }
  });

  it("should return empty array if no su answer", async () => {
    await createSurvey(surveyId);

    const result = await computeSu(surveyId);
    expect(result).toStrictEqual([]);
    expect(apiSuSpy).not.toHaveBeenCalled();
  });

  it("should compute su", async () => {
    await createSurvey(surveyId);
    await createSuAnswers(surveyId);

    apiSuSpy.mockReturnValue(Promise.resolve(buildApiSuResponse()));

    const result = await computeSu(surveyId);
    expect(result).toStrictEqual([1, 2, 3]);

    await expectSuDataCreated(surveyId);
    await expectSuAnswerUpdated(surveyId);
    await expectSurveyUpdated(surveyId);
  });

  it("should erase data su before recomputing", async () => {
    await createSurvey(surveyId);
    await createSuAnswers(surveyId);

    const response = buildApiSuResponse();
    response.computedSus.push({
      su: 4,
      barycenter: [800, 400, 280, 600, 500, 1200],
      popPercentage: 20.0,
    });

    apiSuSpy.mockReturnValue(Promise.resolve(response));
    await computeSu(surveyId);

    const suDatas = await db.suData.findMany({
      where: { surveyId },
    });
    expect(suDatas).toHaveLength(4);

    apiSuSpy.mockReturnValue(Promise.resolve(buildApiSuResponse()));
    await computeSu(surveyId);

    const answer = await db.suAnswer.findMany({ where: { surveyId } });
    expect(answer.length).toBe(3);

    await expectSuDataCreated(surveyId);
    await expectSuAnswerUpdated(surveyId);
    await expectSurveyUpdated(surveyId);
  });
});

const createSurvey = (surveyId: number) =>
  db.survey.create({
    data: {
      id: surveyId,
      name: "test-compute-su",
      phase: SurveyPhase.STEP_3_SU_EXPLORATION,
      computedSu: false,
    },
  });

const createSuAnswers = (surveyId: number) =>
  db.suAnswer.createMany({
    data: [
      buildSuAnswer(surveyId, {
        id: 1,
        airTravelFrequency: AirTravelFrequency.ZERO,
        digitalIntensity: DigitalIntensity.LIGHT,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MINOR,
        purchasingStrategy: PurchasingStrategy.SECOND_HAND,
        transportationMode: TransportationMode.LIGHT,
      }),
      buildSuAnswer(surveyId, {
        id: 2,
        airTravelFrequency: AirTravelFrequency.FROM_1_TO_3,
        digitalIntensity: DigitalIntensity.REGULAR,
        heatSource: HeatSource.GAZ,
        meatFrequency: MeatFrequency.REGULAR,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.PUBLIC,
      }),
      buildSuAnswer(surveyId, {
        id: 3,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        heatSource: HeatSource.OIL,
        meatFrequency: MeatFrequency.MAJOR,
        purchasingStrategy: PurchasingStrategy.NEW,
        transportationMode: TransportationMode.CAR,
      }),
    ],
  });

const buildApiSuResponse = (): SuComputationData => {
  return {
    computedSus: [
      {
        su: 1,
        barycenter: [2000, 2300, 360, 1600, 2000, 1600],
        popPercentage: 33.33,
      },
      {
        su: 2,
        barycenter: [200, 0, 90, 400, 0, 200],
        popPercentage: 33.33,
      },
      {
        su: 3,
        barycenter: [1000, 300, 180, 800, 800, 1100],
        popPercentage: 33.33,
      },
    ],
    answerAttributedSu: [
      {
        id: 1,
        su: 2,
        distanceToBarycenter: 120,
      },
      {
        id: 2,
        su: 3,
        distanceToBarycenter: 230,
      },
      {
        id: 3,
        su: 1,
        distanceToBarycenter: 310,
      },
    ],
  };
};

const expectSuDataCreated = async (surveyId: number) => {
  const suDatas = await db.suData.findMany({
    where: { surveyId },
  });
  expect(suDatas).toHaveLength(3);

  const suData1 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 1 } },
  });
  expect(suData1?.popPercentage).toStrictEqual(33.33);
  expect(suData1?.barycenter).toStrictEqual([
    2000, 2300, 360, 1600, 2000, 1600,
  ]);

  const suData2 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 2 } },
  });
  expect(suData2?.popPercentage).toStrictEqual(33.33);
  expect(suData2?.barycenter).toStrictEqual([200, 0, 90, 400, 0, 200]);

  const suData3 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 3 } },
  });
  expect(suData3?.popPercentage).toStrictEqual(33.33);
  expect(suData3?.barycenter).toStrictEqual([1000, 300, 180, 800, 800, 1100]);
};

const expectSuAnswerUpdated = async (surveyId: number) => {
  const suAnswer1 = await db.suAnswer.findUnique({
    where: { id: 1 },
  });
  const suData2 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 2 } },
  });
  expect(suAnswer1?.suId).toStrictEqual(suData2?.id);
  expect(suAnswer1?.distanceToBarycenter).toStrictEqual(120);

  const suAnswer2 = await db.suAnswer.findUnique({
    where: { id: 2 },
  });
  const suData3 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 3 } },
  });
  expect(suAnswer2?.suId).toStrictEqual(suData3?.id);
  expect(suAnswer2?.distanceToBarycenter).toStrictEqual(230);

  const suAnswer3 = await db.suAnswer.findUnique({
    where: { id: 3 },
  });
  const suData1 = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su: 1 } },
  });
  expect(suAnswer3?.suId).toStrictEqual(suData1?.id);
  expect(suAnswer3?.distanceToBarycenter).toStrictEqual(310);
};

const expectSurveyUpdated = async (surveyId: number) => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });
  expect(survey?.computedSu).toBe(true);
};
