/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const roundNumbers = (obj: unknown): any => {
  if (!obj || typeof obj !== "object") return obj;

  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "number") {
      result[key] = Number(value.toFixed(10));
    } else if (typeof value === "object" && value !== null) {
      result[key] = roundNumbers(value);
    } else {
      result[key] = value;
    }
  });

  return result;
};

export const expectFailedPayloadIsSaved = async (payload: unknown) => {
  const data = await db.rawAnswerError.findMany();
  expect(data.length).toBe(1);
  expect(roundNumbers(data[0]!.rawPayload)).toMatchObject(
    roundNumbers(payload),
  );
};

export const expectFailedPayloadIsNotSaved = async () => {
  const data = await db.rawAnswerError.findMany();
  expect(data.length).toBe(0);
};
