import { TRPCError } from "@trpc/server";
import { hasRoleOrThrow } from "./has-role-or-throw";
import { RoleName } from "@prisma/client";
import { type Session } from "next-auth";

describe("hasRole middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw FORBIDDEN if no user in session", async () => {
    const ctx = {
      session: null,
    };

    expect(() => hasRoleOrThrow(ctx, [])).toThrow(
      new TRPCError({ code: "FORBIDDEN" }),
    );
  });

  it("should throw FORBIDDEN if user does not have the required role", async () => {
    const ctx = {
      session: {
        user: { roles: [RoleName.PILOTE] },
      },
    } as unknown as { session: Session };

    expect(() => hasRoleOrThrow(ctx, [RoleName.ADMIN])).toThrow(
      new TRPCError({ code: "FORBIDDEN" }),
    );
  });

  it("should not throw excepton if user has required role", async () => {
    const ctx = {
      session: {
        user: { roles: [RoleName.ADMIN] },
      },
    } as unknown as { session: Session };

    hasRoleOrThrow(ctx, [RoleName.ADMIN]);
  });
});
