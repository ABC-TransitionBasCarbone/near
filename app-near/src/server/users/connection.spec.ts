import { db } from "../db";
import bcrypt from "bcrypt";
import { RoleName } from "@prisma/client";
import { clearAlldata } from "../test-utils/clear";
import { login } from "./connection";

// const password = "password123";
// const hash = await bcrypt.hash(password, 10);

describe("login()", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should success (try restore to 0)", async () => {
    const password = "password123";
    const hash = await bcrypt.hash(password, 10);

    const survey = await db.survey.create({
      data: { name: "Test Survey" },
    });

    const user = await db.user.create({
      data: {
        email: "test@example.com",
        passwordHash: hash,
        try: 3,
        surveyId: survey.id,
        roles: { create: [{ name: RoleName.PILOTE }] },
      },
      include: { roles: true },
    });

    const res = await login(user.email, password);

    expect(res.success).toBe(true);
    expect(res.message).toBe("Accès validé");
    expect(res.user?.roles).toContain(RoleName.PILOTE);

    const updated = await db.user.findUnique({ where: { id: user.id } });
    expect(updated?.try).toBe(0);
  });

  it("should fail and increment try when wrong password", async () => {
    const hash = await bcrypt.hash("goodpass", 10);

    const user = await db.user.create({
      data: {
        email: "test@example.com",
        passwordHash: hash,
        try: 1,
        roles: { create: [{ name: RoleName.ADMIN }] },
      },
    });

    const res = await login(user.email, "badpass");

    expect(res.success).toBe(false);
    expect(res.message).toBe("Accès non autorisé");

    const updated = await db.user.findUnique({ where: { id: user.id } });
    expect(updated?.try).toBe(2);
  });

  it("should fail when user does not exist", async () => {
    const res = await login("ghost@example.com", "1234");
    expect(res.success).toBe(false);
    expect(res.message).toBe("Accès non autorisé");
  });

  it("should fail when try is 5", async () => {
    await db.user.create({
      data: {
        email: "lock@example.com",
        passwordHash: "not important",
        try: 5,
        roles: { create: [{ name: RoleName.ADMIN }] },
      },
    });

    const res = await login("lock@example.com", "whatever");

    expect(res.success).toBe(false);
  });

  it("should fail when try is more than 5", async () => {
    await db.user.create({
      data: {
        email: "lock@example.com",
        passwordHash: "not important",
        try: 15,
        roles: { create: [{ name: RoleName.ADMIN }] },
      },
    });

    const res = await login("lock@example.com", "whatever");

    expect(res.success).toBe(false);
  });

  it("should fail and increment try when role is PILOTE but user has no surveyId defined", async () => {
    const hash = await bcrypt.hash("pass", 10);

    const user = await db.user.create({
      data: {
        email: "pilot@example.com",
        passwordHash: hash,
        try: 0,
        roles: { create: [{ name: RoleName.PILOTE }] },
      },
    });

    const res = await login(user.email, "pass");

    expect(res.success).toBe(false);

    const updated = await db.user.findUnique({ where: { id: user.id } });
    expect(updated?.try).toBe(1);
  });
});
