import { env } from "~/env";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { type SuComputationData, type SuAnswerData } from "~/types/SuDetection";

export const computeSus = async (
  payload: SuAnswerData[],
): Promise<SuComputationData> => {
  try {
    const snakecasePayload = payload.map((suAnswerData: SuAnswerData) =>
      snakecaseKeys(suAnswerData as unknown as Record<string, unknown>),
    );

    const response = await fetch(`${env.API_SU_URL}/api-su/compute`, {
      method: "POST",
      headers: {
        "X-API-KEY": `${env.API_SU_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snakecasePayload),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const snakecaseData = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: SuComputationData = camelcaseKeys(snakecaseData, {
      deep: true,
    });

    return data;
  } catch (error) {
    console.error("Error calling API SU compute:", error);
    throw error;
  }
};
