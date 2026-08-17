import { buildCsv } from "./csv";

describe("buildCsv", () => {
  it("should return an empty string when there is no row", () => {
    const csv = buildCsv<{ a: number }, { A: number }>([], (row) => ({
      A: row.a,
    }));

    expect(csv).toBe("");
  });

  it("should map each row and build a CSV with the mapped headers", () => {
    const rows = [
      { a: 1, b: "x" },
      { a: 2, b: "y" },
    ];

    const csv = buildCsv(rows, (row) => ({ A: row.a, B: row.b }));

    expect(csv).toBe(["A,B", "1,x", "2,y"].join("\r\n"));
  });
});
