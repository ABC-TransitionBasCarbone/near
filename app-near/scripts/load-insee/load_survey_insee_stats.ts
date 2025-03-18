/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient, type Survey } from "@prisma/client";

const prisma = new PrismaClient();

const createQuartiersView = async (survey_id: number) => {
  const createQuartiersView = `
      CREATE OR REPLACE VIEW quartiers AS
       WITH iris_14_arr AS (
         SELECT insee_iris_2021.iris,
            insee_iris_2021.com,
            insee_iris_2021.typ_iris,
            insee_iris_2021.lab_iris,
            insee_iris_2021.p21_pop,
            insee_iris_2021.p21_pop0002,
            insee_iris_2021.p21_pop0305,
            insee_iris_2021.p21_pop0610,
            insee_iris_2021.p21_pop1117,
            insee_iris_2021.p21_pop1824,
            insee_iris_2021.p21_pop2539,
            insee_iris_2021.p21_pop4054,
            insee_iris_2021.p21_pop5564,
            insee_iris_2021.p21_pop6579,
            insee_iris_2021.p21_pop80p,
            insee_iris_2021.p21_pop0014,
            insee_iris_2021.p21_pop1529,
            insee_iris_2021.p21_pop3044,
            insee_iris_2021.p21_pop4559,
            insee_iris_2021.p21_pop6074,
            insee_iris_2021.p21_pop75p,
            insee_iris_2021.p21_pop0019,
            insee_iris_2021.p21_pop2064,
            insee_iris_2021.p21_pop65p,
            insee_iris_2021.p21_poph,
            insee_iris_2021.p21_h0014,
            insee_iris_2021.p21_h1529,
            insee_iris_2021.p21_h3044,
            insee_iris_2021.p21_h4559,
            insee_iris_2021.p21_h6074,
            insee_iris_2021.p21_h75p,
            insee_iris_2021.p21_h0019,
            insee_iris_2021.p21_h2064,
            insee_iris_2021.p21_h65p,
            insee_iris_2021.p21_popf,
            insee_iris_2021.p21_f0014,
            insee_iris_2021.p21_f1529,
            insee_iris_2021.p21_f3044,
            insee_iris_2021.p21_f4559,
            insee_iris_2021.p21_f6074,
            insee_iris_2021.p21_f75p,
            insee_iris_2021.p21_f0019,
            insee_iris_2021.p21_f2064,
            insee_iris_2021.p21_f65p,
            insee_iris_2021.c21_pop15p,
            insee_iris_2021.c21_pop15p_cs1,
            insee_iris_2021.c21_pop15p_cs2,
            insee_iris_2021.c21_pop15p_cs3,
            insee_iris_2021.c21_pop15p_cs4,
            insee_iris_2021.c21_pop15p_cs5,
            insee_iris_2021.c21_pop15p_cs6,
            insee_iris_2021.c21_pop15p_cs7,
            insee_iris_2021.c21_pop15p_cs8,
            insee_iris_2021.c21_h15p,
            insee_iris_2021.c21_h15p_cs1,
            insee_iris_2021.c21_h15p_cs2,
            insee_iris_2021.c21_h15p_cs3,
            insee_iris_2021.c21_h15p_cs4,
            insee_iris_2021.c21_h15p_cs5,
            insee_iris_2021.c21_h15p_cs6,
            insee_iris_2021.c21_h15p_cs7,
            insee_iris_2021.c21_h15p_cs8,
            insee_iris_2021.c21_f15p,
            insee_iris_2021.c21_f15p_cs1,
            insee_iris_2021.c21_f15p_cs2,
            insee_iris_2021.c21_f15p_cs3,
            insee_iris_2021.c21_f15p_cs4,
            insee_iris_2021.c21_f15p_cs5,
            insee_iris_2021.c21_f15p_cs6,
            insee_iris_2021.c21_f15p_cs7,
            insee_iris_2021.c21_f15p_cs8,
            insee_iris_2021.p21_pop_fr,
            insee_iris_2021.p21_pop_etr,
            insee_iris_2021.p21_pop_imm,
            insee_iris_2021.p21_pmen,
            insee_iris_2021.p21_phormen
           FROM insee_iris_2021
          WHERE insee_iris_2021.iris::text = ANY (ARRAY['751145501', '751145503', '751145601' ])
        ),
 intermediates as (SELECT ${survey_id} AS survey_id,
   ARRAY['751145501', '751145503', '751145601' ] AS iris_selectors,
    sum(p21_pop) AS population_sum_with_under_fifteen,
    sum(c21_pop15p) AS population_sum,
    sum(p21_pop1529) AS p21_pop1529_sum,
    sum(p21_pop3044) AS p21_pop3044_sum,
    sum(p21_pop4559) AS p21_pop4559_sum,
    sum(p21_pop6074) AS p21_pop6074_sum,
    sum(p21_pop75p) AS p21_pop75p_sum,
    sum(c21_pop15p_cs1) AS c21_pop15p_cs1_sum,
    sum(c21_pop15p_cs2) AS c21_pop15p_cs2_sum,
    sum(c21_pop15p_cs3) AS c21_pop15p_cs3_sum,
    sum(c21_pop15p_cs4) AS c21_pop15p_cs4_sum,
    sum(c21_pop15p_cs5) AS c21_pop15p_cs5_sum,
    sum(c21_pop15p_cs6) AS c21_pop15p_cs6_sum,
    sum(c21_pop15p_cs7) AS c21_pop15p_cs7_sum,
    sum(c21_pop15p_cs8) AS c21_pop15p_cs8_sum,
    SUM(C21_F15P) AS population_femme_sum,
    SUM(C21_H15P) AS population_homme_sum,
    (1.96^2 * 0.5 * (1 - 0.5)) / (0.03^2 + (1.96^2*0.25) / sum(C21_POP15P) )  AS population_sum_threshold_3p,
    (1.96^2 * 0.5 * (1 - 0.5)) / (0.04^2 + (1.96^2*0.25) / sum(C21_POP15P) )  AS population_sum_threshold_4p,
    (1.96^2 * 0.5 * (1 - 0.5)) / (0.05^2 + (1.96^2*0.25) / sum(C21_POP15P) )  AS population_sum_threshold_5p
   FROM iris_14_arr)
   SELECT *, (population_sum_threshold_4p + population_sum_threshold_5p) / 2::double precision as population_sum_threshold_4_5p from intermediates
    `;

  const dropQuartierView = "DROP VIEW IF EXISTS quartiers;";

  await prisma.$executeRawUnsafe(dropQuartierView);
  await prisma.$executeRawUnsafe(createQuartiersView);
  console.log("View 'quartiers' upserted successfully!");
};

const createSurvey = async (): Promise<Survey> => {
  return prisma.survey.upsert({
    where: {
      name: "Porte d'Orléans", // Ensure that `name` is unique or a unique constraint is applied
    },
    update: {},
    create: {
      name: "Porte d'Orléans",
    },
  });
};

// Upsert surveys
const survey: Survey = await createSurvey();
console.log(`Upserted survey with id: ${JSON.stringify(survey)}`);

// Upsert SQL view for survey with their predefined IRIS
await createQuartiersView(survey.id);

await prisma.$disconnect();
