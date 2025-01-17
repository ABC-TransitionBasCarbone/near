/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient, type Survey } from "@prisma/client";

const prisma = new PrismaClient();

const createQuartiersView = async (survey_id: number) => {
  const quartiersView = `
      CREATE OR REPLACE VIEW quartiers AS
      WITH iris_14_arr AS (
        SELECT * 
        FROM public.insee_iris_2021 
        WHERE IRIS = ANY(ARRAY[
          '751145301', '751145302', '751145303', '751145304', '751145305',
          '751145306', '751145307', '751145308', '751145309', '751145310',
          '751145311', '751145401', '751145402', '751145403', '751145404',
          '751145405', '751145406', '751145407', '751145501', '751145502',
          '751145503', '751145504', '751145505', '751145506', '751145507',
          '751145508', '751145509', '751145510', '751145511', '751145512',
          '751145513', '751145514', '751145515', '751145516', '751145601',
          '751145602', '751145603', '751145604', '751145605', '751145606',
          '751145607', '751145608', '751145609', '751145610', '751145611',
          '751145612', '751145613', '751145614', '751145615', '751145616',
          '751145617', '751145618', '751145619', '751145620', '751145621',
          '751145622', '751145623', '751145624', '751145625'
        ])
      )
      SELECT 
      ${survey_id} as survey_id,
      ARRAY[
        '751145301', '751145302', '751145303', '751145304', '751145305',
        '751145306', '751145307', '751145308', '751145309', '751145310',
        '751145311', '751145401', '751145402', '751145403', '751145404',
        '751145405', '751145406', '751145407', '751145501', '751145502',
        '751145503', '751145504', '751145505', '751145506', '751145507',
        '751145508', '751145509', '751145510', '751145511', '751145512',
        '751145513', '751145514', '751145515', '751145516', '751145601',
        '751145602', '751145603', '751145604', '751145605', '751145606',
        '751145607', '751145608', '751145609', '751145610', '751145611',
        '751145612', '751145613', '751145614', '751145615', '751145616',
        '751145617', '751145618', '751145619', '751145620', '751145621',
        '751145622', '751145623', '751145624', '751145625'
      ] AS iris_selectors,
      SUM(C21_POP15P) AS population_total,
      SUM(P21_POP1529) AS P21_POP1529_sum,
      SUM(P21_POP3044) AS P21_POP3044_sum,
      SUM(P21_POP4559) AS P21_POP4559_sum,
      SUM(P21_POP6074) AS P21_POP6074_sum,
      SUM(P21_POP75P) AS P21_POP75P_sum,
      SUM(C21_POP15P_CS1) AS C21_POP15P_CS1_sum,
      SUM(C21_POP15P_CS2) AS C21_POP15P_CS2_sum,
      SUM(C21_POP15P_CS3) AS C21_POP15P_CS3_sum,
      SUM(C21_POP15P_CS4) AS C21_POP15P_CS4_sum,
      SUM(C21_POP15P_CS5) AS C21_POP15P_CS5_sum,
      SUM(C21_POP15P_CS6) AS C21_POP15P_CS6_sum,
      SUM(C21_POP15P_CS7) AS C21_POP15P_CS7_sum,
      SUM(C21_POP15P_CS8) AS C21_POP15P_CS8_sum,
      SUM(P21_POPF) AS population_femme_total,
      SUM(P21_POPH) AS population_homme_total
      FROM iris_14_arr;
    `;

  // Execute the raw query
  await prisma.$executeRawUnsafe(quartiersView);
  console.log("View 'quartiers' upserted successfully!");
};

const createSurvey = async (): Promise<Survey> => {
  return prisma.survey.upsert({
    where: {
      name: "14e_arr", // Ensure that `name` is unique or a unique constraint is applied
    },
    update: {},
    create: {
      name: "14e_arr",
    },
  });
};

// Création ou mise à jour des enquêtes
const survey: Survey = await createSurvey();
console.log("Upserted survey with id: " + JSON.stringify(survey));

// Création ou mise à jour de la vue quartier avec les IRIS et ajout d'un lien avec l'enquête
await createQuartiersView(survey.id as number);

await prisma.$disconnect();
