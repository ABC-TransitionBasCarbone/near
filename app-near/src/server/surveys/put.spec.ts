import { SurveyPhase } from "@prisma/client";
import { db } from "../db";
import { surveyAllowedIncomingSteps, updateSurvey } from "./put";
import { TRPCError } from "@trpc/server";
import representativenessService from "../su/answers/representativeness";
import { CategoryStat } from "~/types/SuAnswer";

describe("surveys put", () => {
  const surveyName = "test-update-survey";
  const allSurveyPhases = Object.values(SurveyPhase);

  beforeEach(async () => {
    // do not throw error when survey is not found
    await db.survey.delete({ where: { name: surveyName } }).catch(() => null);
    jest
      .spyOn(representativenessService, "representativeness")
      .mockReturnValue(Promise.resolve(null));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(`When ${SurveyPhase.STEP_3_SU_EXPLORATION}`, () => {
    const thresholdTests = [
      {
        label:
          "should update thresholdReached field to true with negative diff",
        diff: -1.2,
        expected: true,
      },
      {
        label:
          "should update thresholdReached field to true with positive diff",
        diff: 1.2,
        expected: true,
      },
      {
        label:
          "should update thresholdReached field to false with negative diff",
        diff: -4.2,
        expected: false,
      },
      {
        label:
          "should update thresholdReached field to false with positive diff",
        diff: 4.2,
        expected: false,
      },
    ];

    it.each(thresholdTests)("$label", async ({ diff, expected }) => {
      jest
        .spyOn(representativenessService, "representativeness")
        .mockReturnValue(
          Promise.resolve({
            [CategoryStat.above_75]: diff,
            [CategoryStat.cs1]: diff,
            [CategoryStat.cs2]: diff,
            [CategoryStat.cs3]: diff,
            [CategoryStat.cs4]: diff,
            [CategoryStat.cs5]: diff,
            [CategoryStat.cs6]: diff,
            [CategoryStat.cs7]: diff,
            [CategoryStat.cs8]: diff,
            [CategoryStat.from_15_to_29]: diff,
            [CategoryStat.from_30_to_44]: diff,
            [CategoryStat.from_45_to_59]: diff,
            [CategoryStat.from_60_to_74]: diff,
            [CategoryStat.man]: diff,
            [CategoryStat.woman]: diff,
          }),
        );

      const testSurvey = await db.survey.create({
        data: {
          name: surveyName,
          id: 300,
          phase: SurveyPhase.STEP_2_SU_SURVERY,
        },
      });

      const result = await updateSurvey(testSurvey.id, {
        phase: SurveyPhase.STEP_3_SU_EXPLORATION,
      });

      expect(result.thresholdReached).toBe(expected);
    });
  });

  describe.each(allSurveyPhases)("When %s", (step) => {
    const shouldPassSteps = surveyAllowedIncomingSteps[step];
    const shouldNotPass = allSurveyPhases.filter(
      (item) => !shouldPassSteps.includes(item),
    );

    if (shouldPassSteps.length) {
      it.each(shouldPassSteps)(
        `should pass from step %s to step ${step}`,
        async (shouldPassStep) => {
          const testSurvey = await db.survey.create({
            data: {
              name: surveyName,
              id: 300,
              phase: shouldPassStep,
            },
          });
          const result = await updateSurvey(testSurvey.id, { phase: step });

          expect(result.phase).toEqual(step);
          expect(result.thresholdReached).toBe(false);
        },
      );
    }

    if (shouldNotPass.length) {
      it.each(shouldNotPass)(
        `should not pass from step %s to step ${step}`,
        async (shouldNotPassStep) => {
          expect.assertions(1);
          try {
            const testSurvey = await db.survey.create({
              data: {
                name: surveyName,
                id: 300,
                phase: shouldNotPassStep,
              },
            });
            await updateSurvey(testSurvey.id, { phase: step });
          } catch (error) {
            if (error instanceof TRPCError) {
              expect(error.code).toBe("FORBIDDEN");
            }
          }
        },
      );
    }
  });
});
