import { env } from "~/env";
import { type BrevoBody } from "~/types/Brevo";

const sendEmail = async (body: BrevoBody) => {
  if (env.EMAIL_SERVICE === "brevo") {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (brevoResponse) => {
        console.log(
          "Email response",
          brevoResponse.status,
          await brevoResponse.json(),
        );
      })
      .catch((brevoError) => {
        console.error("Email error", brevoError);
      });
  } else {
    console.log(`
  Email send with command:
  curl --request POST \
       --url https://api.brevo.com/v3/smtp/email \
       --header 'accept: application/json' \
       --header 'api-key: <fill-with-correct-api-key>' \
       --header 'content-type: application/json' \
       --data '${JSON.stringify(body).replace(/'/g, "&apos;")}'
      `);
  }

  return `Email template ${body.templateId} send`;
};

const EmailService = { sendEmail };

export default EmailService;
