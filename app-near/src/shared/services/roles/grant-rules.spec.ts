import { RoleName } from "@prisma/client";
import { userIsGranted } from "./grant-rules";

describe("grant-rules", () => {
  const tests = [
    {
      label: "should return false if user is undefined",
      expected: false,
      user: undefined,
      roles: [RoleName.ADMIN],
    },
    {
      label: "should return false if user.roles is empty array",
      expected: false,
      user: { roles: [] },
      roles: [RoleName.ADMIN],
    },
    {
      label: "should return true if user has the correct role",
      expected: true,
      user: { roles: [RoleName.ADMIN] },
      roles: [RoleName.ADMIN],
    },
    {
      label: "should return false if user does not have the correct role",
      expected: false,
      user: { roles: [RoleName.PILOTE] },
      roles: [RoleName.ADMIN],
    },
  ];
  describe("userIsGranted", () => {
    it.each(tests)("$label", ({ user, roles, expected }) => {
      // @ts-expect-error allow partial for test
      expect(userIsGranted(user, roles)).toBe(expected);
    });
  });
});
