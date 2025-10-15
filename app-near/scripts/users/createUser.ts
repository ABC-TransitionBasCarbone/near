import { RoleName } from "@prisma/client";
import bcrypt from "bcrypt";
import { parseArgs } from "scripts/utils";
import { db } from "~/server/db";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages: 
  - npm run user:create -- email=<email> password=<password> role=<role> [surveyName=<surveyName>]
`);

  process.exit(1);
};

const verifyRoleName = async (roleName: RoleName): Promise<void> => {
  const validRolesNames = Object.values(RoleName);

  if (!validRolesNames.includes(roleName)) {
    throw new Error(
      `Error: roles should be one of : ${validRolesNames.join(", ")}`,
    );
  }
};

const verifySurveyName = async (surveyName: string): Promise<void> => {
  const validSurveys = await db.survey.findMany({
    select: { name: true, id: true },
  });
  const validSurveyNames = validSurveys.map((survey) => survey.name);

  if (!validSurveyNames.includes(surveyName)) {
    throw new Error(
      `Error: surveyName should be one of : ${validSurveyNames.join(", ")}`,
    );
  }
};

const createUser = async () => {
  const { email, password, role, surveyName } = parseArgs() as {
    email?: string;
    password?: string;
    role?: RoleName;
    surveyName?: string;
  };

  if (!email || !password || !role) {
    throw new Error("Can not seed on production environment");
  }

  await verifyRoleName(role);

  if (role === RoleName.PILOTE) {
    await verifySurveyName(surveyName!);
  }

  await db.user.create({
    data: {
      email: email,
      passwordHash: await bcrypt.hash(password, 10),
      ...(surveyName ? { survey: { connect: { name: surveyName } } } : {}),
      roles: {
        connectOrCreate: [{ where: { name: role }, create: { name: role } }],
      },
    },
  });
};

await createUser()
  .catch((e) => {
    if (e instanceof Error) {
      endProcess(e.message);
    } else {
      endProcess("unknown error");
    }
  })
  .then(() => {
    console.log("End create user successfully");
    process.exit(0);
  });
