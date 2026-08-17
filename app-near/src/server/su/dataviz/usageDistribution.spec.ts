import { TransportationMode, type Survey } from "@prisma/client";
import { db } from "~/server/db";
import { getUsageDistribution } from "./usageDistribution";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { clearAlldata } from "~/server/test-utils/clear";

describe("getUsageDistribution", () => {
  let survey: Survey;

  beforeEach(async () => {
    await clearAlldata();
    survey = await createNeighborhood("survey-test-usage-distribution");
  });

  it("returns every enum choice even when some were never picked, instead of omitting them", async () => {
    const su = await db.suData.create({
      data: { surveyId: survey.id, su: 1, popPercentage: 100, barycenter: {} },
    });

    // Every response picks CAR: groupBy alone would return a single row, not three.
    await db.suAnswer.createMany({
      data: [
        buildSuAnswer(survey.id, {
          suId: su.id,
          transportationMode: TransportationMode.CAR,
        }),
        buildSuAnswer(survey.id, {
          suId: su.id,
          transportationMode: TransportationMode.CAR,
        }),
      ],
    });

    const result = await getUsageDistribution(
      survey.id,
      "transportationMode",
      [1],
    );

    expect(result.data).toHaveLength(3);
    const car = result.data.find((d) => d.value === TransportationMode.CAR);
    const publicTransport = result.data.find(
      (d) => d.value === TransportationMode.PUBLIC,
    );
    const light = result.data.find((d) => d.value === TransportationMode.LIGHT);

    expect(car?.count).toBe(2);
    expect(car?.percentage).toBe(100);
    expect(publicTransport).toMatchObject({ count: 0, percentage: 0 });
    expect(light).toMatchObject({ count: 0, percentage: 0 });
  });
});
