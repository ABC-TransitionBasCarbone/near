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
          WHERE insee_iris_2021.iris::text = ANY (ARRAY['751145301'::text, '751145302'::text, '751145303'::text, '751145304'::text, '751145305'::text, '751145306'::text, '751145307'::text, '751145308'::text, '751145309'::text, '751145310'::text, '751145311'::text, '751145401'::text, '751145402'::text, '751145403'::text, '751145404'::text, '751145405'::text, '751145406'::text, '751145407'::text, '751145501'::text, '751145502'::text, '751145503'::text, '751145504'::text, '751145505'::text, '751145506'::text, '751145507'::text, '751145508'::text, '751145509'::text, '751145510'::text, '751145511'::text, '751145512'::text, '751145513'::text, '751145514'::text, '751145515'::text, '751145516'::text, '751145601'::text, '751145602'::text, '751145603'::text, '751145604'::text, '751145605'::text, '751145606'::text, '751145607'::text, '751145608'::text, '751145609'::text, '751145610'::text, '751145611'::text, '751145612'::text, '751145613'::text, '751145614'::text, '751145615'::text, '751145616'::text, '751145617'::text, '751145618'::text, '751145619'::text, '751145620'::text, '751145621'::text, '751145622'::text, '751145623'::text, '751145624'::text, '751145625'::text])
        ),
 intermediates as (SELECT ${survey_id} AS survey_id,
    ARRAY['751145301'::text, '751145302'::text, '751145303'::text, '751145304'::text, '751145305'::text, '751145306'::text, '751145307'::text, '751145308'::text, '751145309'::text, '751145310'::text, '751145311'::text, '751145401'::text, '751145402'::text, '751145403'::text, '751145404'::text, '751145405'::text, '751145406'::text, '751145407'::text, '751145501'::text, '751145502'::text, '751145503'::text, '751145504'::text, '751145505'::text, '751145506'::text, '751145507'::text, '751145508'::text, '751145509'::text, '751145510'::text, '751145511'::text, '751145512'::text, '751145513'::text, '751145514'::text, '751145515'::text, '751145516'::text, '751145601'::text, '751145602'::text, '751145603'::text, '751145604'::text, '751145605'::text, '751145606'::text, '751145607'::text, '751145608'::text, '751145609'::text, '751145610'::text, '751145611'::text, '751145612'::text, '751145613'::text, '751145614'::text, '751145615'::text, '751145616'::text, '751145617'::text, '751145618'::text, '751145619'::text, '751145620'::text, '751145621'::text, '751145622'::text, '751145623'::text, '751145624'::text, '751145625'::text] AS iris_selectors,
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
