import {
  type ConvertedAnswer,
  type Answer,
  type TypeformWebhookPayload,
} from "~/types/Typeform";

export const convertFormToAnswer = (
  parsedBody: TypeformWebhookPayload,
  referencesMapping: Record<string, string | boolean>,
): ConvertedAnswer => {
  const getResponse = (answer: Answer) => {
    switch (answer.type) {
      case "choice":
        if (answer.choice.other) {
          return answer.choice.other;
        }
        if (answer.choice.ref) {
          return referencesMapping[answer.choice.ref];
        }
        return "";
      case "choices":
        const choices =
          answer.choices.refs?.map((ref) => referencesMapping[ref]) ?? [];
        if (answer.choices.other) {
          choices.push(answer.choices.other);
        }
        return choices;
      case "text":
        return answer.text;
      case "email":
        return answer.email;
      case "boolean":
        return answer.boolean.toString();
      case "number":
        return answer.number.toString();
      default:
        return "No response";
    }
  };

  return parsedBody.form_response.answers.reduce<ConvertedAnswer>(
    (acc, answer) => {
      const question = answer.field.ref;
      const response = getResponse(answer);
      if (!question) {
        console.info(`${answer.field.id} no question found`);
        return acc;
      }
      if (response === undefined) {
        console.info(`${answer.field.id} not answer found`);
        return acc;
      }
      acc[question] = response;
      return acc;
    },
    {},
  );
};
