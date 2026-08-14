import {
  buildSankeyData,
  computeNodeValue,
  CARBON_FIELDS,
  type CarbonField,
} from "./carbonSankey";

const zeroValues = (): Record<CarbonField, number> =>
  Object.fromEntries(CARBON_FIELDS.map((f) => [f, 0])) as Record<
    CarbonField,
    number
  >;

describe("computeNodeValue", () => {
  it("should return the field's own value for a leaf node", () => {
    const values = { ...zeroValues(), transportationCar: 42 };

    const result = computeNodeValue(
      {
        id: "transportationCar",
        name: "Voiture",
        emoji: "🚗",
        field: "transportationCar",
      },
      values,
    );

    expect(result).toBe(42);
  });

  it("should return 0 for a leaf node whose field isn't set", () => {
    const result = computeNodeValue(
      {
        id: "transportationCar",
        name: "Voiture",
        emoji: "🚗",
        field: "transportationCar",
      },
      zeroValues(),
    );

    expect(result).toBe(0);
  });

  it("should sum children for a node that has them, ignoring its own field", () => {
    const values = {
      ...zeroValues(),
      transportationCar: 10,
      transportationPlane: 5,
    };

    const result = computeNodeValue(
      {
        id: "transportation",
        name: "Transport",
        emoji: "🚗",
        children: [
          { id: "a", name: "a", emoji: "", field: "transportationCar" },
          { id: "b", name: "b", emoji: "", field: "transportationPlane" },
        ],
      },
      values,
    );

    expect(result).toBe(15);
  });

  it("should sum recursively across nested children", () => {
    const values = {
      ...zeroValues(),
      diversDigitalInternet: 3,
      diversDigitalDevices: 7,
    };

    const result = computeNodeValue(
      {
        id: "divers",
        name: "Conso de biens",
        emoji: "📦",
        children: [
          {
            id: "diversDigital",
            name: "Numérique",
            emoji: "",
            children: [
              { id: "a", name: "a", emoji: "", field: "diversDigitalInternet" },
              { id: "b", name: "b", emoji: "", field: "diversDigitalDevices" },
            ],
          },
        ],
      },
      values,
    );

    expect(result).toBe(10);
  });
});

describe("buildSankeyData", () => {
  it("should produce no nodes when every value is 0", () => {
    const result = buildSankeyData(zeroValues());

    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it("should only include the root and its non-zero leaf for a single value", () => {
    const values = { ...zeroValues(), transportationCar: 100 };

    const result = buildSankeyData(values);

    expect(result.nodes.map((n) => n.id)).toStrictEqual([
      "transportation",
      "transportationCar",
    ]);
    expect(result.nodes[0]?.value).toBe(100);
    expect(result.nodes[1]?.value).toBe(100);
    expect(result.links).toStrictEqual([{ source: 0, target: 1, value: 100 }]);
  });

  it("should roll up a two-level nested branch into its parents", () => {
    const values = {
      ...zeroValues(),
      diversDigitalInternet: 3,
      diversDigitalDevices: 7,
    };

    const result = buildSankeyData(values);
    const byId = Object.fromEntries(result.nodes.map((n) => [n.id, n.value]));

    expect(byId.divers).toBe(10);
    expect(byId.diversDigital).toBe(10);
    expect(byId.diversDigitalInternet).toBe(3);
    expect(byId.diversDigitalDevices).toBe(7);
    // diversFurniture/diversTextile/diversHouseholdAppliances stay at 0, so
    // they must not appear as nodes.
    expect(result.nodes).toHaveLength(4);
  });
});
