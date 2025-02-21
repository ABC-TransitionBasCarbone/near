import axios from "axios";
import { env } from "~/env";
import { type BrevoBody } from "~/types/Brevo";

const sendEmail = async (body: BrevoBody) => {
  if (env.NODE_ENV === "production") {
    return axios.post("https://api.brevo.com/v3/smtp/email", body, {
      headers: {
        Accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });
  }

  console.log(`
Email send with command:
curl --request POST \
     --url https://api.brevo.com/v3/smtp/email \
     --header 'accept: application/json' \
     --header 'api-key: <fill-with-correct-api-key>' \
     --header 'content-type: application/json' \
     --data '${JSON.stringify(body).replace(/'/g, "&apos;")}'
    `);
  return;
};

const EmailService = { sendEmail };

export default EmailService;
