/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient, type Survey } from "@prisma/client";

const prisma = new PrismaClient();

const createQuartiersView = async (survey_id: number) => {
  try {
    const viewQuery = `
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
    await prisma.$executeRawUnsafe(viewQuery);
    console.log("View 'quartier' created or updated successfully!");
  } catch (error) {
    console.error("Error creating view:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createSurvey = async (): Promise<Survey> => {
  return prisma.survey.create({
    data: {
      name: "14e_arr",
    },
  });
};

console.log("created survey : " + JSON.stringify(createSurvey));

const survey: Survey = await createSurvey();

// Création ou mise à jour de la vue quartier avec les IRIS
await createQuartiersView(survey.id as number);

// // Read and parse the CSV file
// fs.createReadStream(inseeDistrictsDataFilePath)
//   .pipe(csv({ separator: ";" }))
//   .on("data", (row: InseeIris2021ColumnDefinition) => {
//     // Transform row data as needed to match the Prisma model structure
//     //   const transformedRow: TransformedRow = {
//     //     // Assuming your Prisma model has fields: id, name, and email
//     //     id: parseInt(row.id, 10),
//     //     name: row.name,
//     //     email: row.email,
//     //   };
//     if (!IRIS_14E_ARR.includes(row.IRIS)) {
//       return;
//     }

//     // create_survey_14e_arr.district_total_population =
//     //   create_survey_14e_arr.district_total_population.add(
//     //     new Decimal(row.C21_POP15P),
//     //   )e.log(`CSV file successfully processed.`);

//     console.log(JSON.stringify(create_survey_14e_arr));

//     // try {
//     //   // Insert records into the database using Prisma
//     //   for (const record of records) {
//     //     await prisma.survey.create({
//     //       data: record,
//     //     });
//     //   }

//     //   console.log("Data successfully loaded into the database.");
//     // } catch (error) {
//     //   console.error("Error loading data:", error);
//     // } finally {
//     //   await prisma.$disconnect();
//     // }
//   })
//   .on("error", (error: Error) => {
//     console.error("Error reading the CSV file:", error);
//   });
