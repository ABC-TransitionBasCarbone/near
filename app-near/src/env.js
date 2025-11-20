import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    METABASE_SECRET_KEY: z.string(),
    METABASE_SITE_URL: z.string().url(),
    TYPEFORM_SECRET: z.string(),
    NGC_SECRET: z.string(),
    SU_FORM_ID: z.string(),
    WAY_OF_LIFE_FORM_ID: z.string(),
    EMAIL_SERVICE: z.enum(["local", "brevo"]).default("local"),
    BREVO_API_KEY: z.string(),
    API_SU_URL: z.string().url(),
    API_SU_KEY: z.string(),
    SEEDS_ENABLED: z.boolean().default(false),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_TYPEFORM_SU_LINK: z.string().url(),
    NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK: z.string().url(),
    NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_STAT: z.string().url(),
    NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK: z.string().url(),
    NEXT_PUBLIC_TARGET_PERCENTAGE_WARNING: z.string(),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email(),
    NEXT_PUBLIC_METABASE_POPULATION_STATISTICS: z.number(),
    NEXT_PUBLIC_METABASE_JAUGE_ERROR_MARGIN: z.number(),
    NEXT_PUBLIC_METABASE_PANEL_REPRESENTATIVNESS: z.number(),
    NEXT_PUBLIC_METABASE_SU: z.number(),
    NEXT_PUBLIC_METABASE_POPULATION_PERCENTAGE: z.number(),
    NEXT_PUBLIC_METABASE_WAY_OF_LIFE: z.number(),
    NEXT_PUBLIC_METABASE_CARBON_FOOTPRINT: z.number(),
    NEXT_PUBLIC_METABASE_RESULT_AGE: z.number(),
    NEXT_PUBLIC_METABASE_RESULT_GENDER: z.number(),
    NEXT_PUBLIC_METABASE_RESULT_CS: z.number(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_TYPEFORM_SU_LINK: process.env.NEXT_PUBLIC_TYPEFORM_SU_LINK,
    NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK:
      process.env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK,
    NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_STAT:
      process.env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_STAT,
    NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK:
      process.env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK,
    METABASE_SECRET_KEY: process.env.METABASE_SECRET_KEY,
    METABASE_SITE_URL: process.env.METABASE_SITE_URL,
    TYPEFORM_SECRET: process.env.TYPEFORM_SECRET,
    NGC_SECRET: process.env.NGC_SECRET,
    SU_FORM_ID: process.env.SU_FORM_ID,
    WAY_OF_LIFE_FORM_ID: process.env.WAY_OF_LIFE_FORM_ID,
    API_SU_URL: process.env.API_SU_URL,
    API_SU_KEY: process.env.API_SU_KEY,
    NEXT_PUBLIC_TARGET_PERCENTAGE_WARNING:
      process.env.NEXT_PUBLIC_TARGET_PERCENTAGE_WARNING,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_METABASE_POPULATION_STATISTICS: Number(
      process.env.NEXT_PUBLIC_METABASE_POPULATION_STATISTICS,
    ),
    NEXT_PUBLIC_METABASE_JAUGE_ERROR_MARGIN: Number(
      process.env.NEXT_PUBLIC_METABASE_JAUGE_ERROR_MARGIN,
    ),
    NEXT_PUBLIC_METABASE_PANEL_REPRESENTATIVNESS: Number(
      process.env.NEXT_PUBLIC_METABASE_PANEL_REPRESENTATIVNESS,
    ),
    NEXT_PUBLIC_METABASE_SU: Number(process.env.NEXT_PUBLIC_METABASE_SU),
    NEXT_PUBLIC_METABASE_POPULATION_PERCENTAGE: Number(
      process.env.NEXT_PUBLIC_METABASE_POPULATION_PERCENTAGE,
    ),
    NEXT_PUBLIC_METABASE_WAY_OF_LIFE: Number(
      process.env.NEXT_PUBLIC_METABASE_WAY_OF_LIFE,
    ),
    NEXT_PUBLIC_METABASE_CARBON_FOOTPRINT: Number(
      process.env.NEXT_PUBLIC_METABASE_CARBON_FOOTPRINT,
    ),
    NEXT_PUBLIC_METABASE_RESULT_AGE: Number(
      process.env.NEXT_PUBLIC_METABASE_RESULT_AGE,
    ),
    NEXT_PUBLIC_METABASE_RESULT_GENDER: Number(
      process.env.NEXT_PUBLIC_METABASE_RESULT_GENDER,
    ),
    NEXT_PUBLIC_METABASE_RESULT_CS: Number(
      process.env.NEXT_PUBLIC_METABASE_RESULT_CS,
    ),
    SEEDS_ENABLED: Boolean(process.env.SEEDS_ENABLED),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
