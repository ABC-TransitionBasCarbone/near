import { env } from "~/env";

// If you need to update use data generated by typeform test hook
// TODO NEAR-45: update when form finalized
export const valideWayOfLifeSurveyPayload = {
  event_id: "01JKAV3QZY91SNR0X3A7MNE77D",
  event_type: "form_response",
  form_response: {
    form_id: env.WAY_OF_LIFE_FORM_ID,
    token: "01JKAV3QZY91SNR0X3A7MNE77D",
    landed_at: "2025-02-05T10:39:52Z",
    submitted_at: "2025-02-05T10:39:52Z",
    definition: {
      id: env.WAY_OF_LIFE_FORM_ID,
      title: "Sphères d'Usages V1.92 (copie test)",
      fields: [
        {
          id: "wldBg2PVYBgI",
          ref: "email",
          type: "email",
          title:
            "📧🤚 *Souhaitez-vous nous transmettre votre mail pour être tenu au courant des résultats ?*",
          properties: {},
        },
      ],
      endings: [
        {
          id: "OEYROGkSgGg3",
          ref: "9acf61d6-becd-4a62-bea3-4353c07d5769",
          title: "Vous ne faites pas partie du public de cette enquête. ",
          type: "thankyou_screen",
          properties: {
            description:
              "Vous pouvez cependant nous aider à la diffuser aux personnes de plus de 15 ans, habitants ou visiteurs réguliers du quartier.",
            button_text: "Create a typeform",
            show_button: true,
            share_icons: true,
            button_mode: "default_redirect",
          },
        },
      ],
    },
    answers: [
      {
        type: "email",
        email: "an_account@example.com",
        field: {
          id: "wldBg2PVYBgI",
          type: "email",
          ref: "email",
        },
      },
    ],
    ending: {
      id: "OEYROGkSgGg3",
      ref: "9acf61d6-becd-4a62-bea3-4353c07d5769",
    },
  },
};
