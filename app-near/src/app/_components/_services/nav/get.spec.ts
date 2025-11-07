import { RoleName } from "@prisma/client";
import { getNavBar, navBackOfficeItems } from "./get";

describe("get navBars", () => {
  describe("navBackOfficeItems", () => {
    it.each(Object.values(RoleName))(
      "should return navBackOffice item when %s",
      (role: RoleName) => {
        // @ts-expect-error partial object for testing
        const result = getNavBar(navBackOfficeItems, { roles: [role] });

        expect(result).toMatchSnapshot();
      },
    );
  });
});
