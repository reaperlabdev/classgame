export interface UpgradePath {
  label: string;
  property: string;
  baseCost: number;
  growth: number;
  step: number;
}

export const upgradeSettings: Record<string, { paths: UpgradePath[] }> = {
  Turret: {
    paths: [
      {
        label: "Damage",
        property: "damage",
        baseCost: 50,
        growth: 1.2,
        step: 2,
      },
      {
        label: "Range",
        property: "range",
        baseCost: 40,
        growth: 1.15,
        step: 10,
      },
      {
        label: "Fire Rate",
        property: "attackSpeed",
        baseCost: 60,
        growth: 1.3,
        step: -0.05,
      },
    ],
  },
  Sniper: {
    paths: [
      {
        label: "Damage",
        property: "damage",
        baseCost: 60,
        growth: 1.6,
        step: 5,
      },
      {
        label: "Range",
        property: "range",
        baseCost: 40,
        growth: 1.25,
        step: 30,
      },
      {
        label: "Fire Rate",
        property: "attackSpeed",
        baseCost: 50,
        growth: 1.7,
        step: -0.2,
      },
    ],
  },
  Machine: {
    paths: [
      {
        label: "Damage",
        property: "damage",
        baseCost: 30,
        growth: 1.5,
        step: 1,
      },
      {
        label: "Range",
        property: "range",
        baseCost: 20,
        growth: 1.3,
        step: 10,
      },
      {
        label: "Fire Rate",
        property: "attackSpeed",
        baseCost: 40,
        growth: 1.65,
        step: -0.02,
      },
    ],
  },
  Spike: {
    paths: [
      {
        label: "Damage",
        property: "damage",
        baseCost: 20,
        growth: 1.4,
        step: 2,
      },
      {
        label: "Range",
        property: "range",
        baseCost: 100,
        growth: 2.0,
        step: 2,
      },
      {
        label: "Durability",
        property: "health",
        baseCost: 25,
        growth: 1.4,
        step: 10,
      },
    ],
  },
};

export const upgradeLimits: Record<string, Record<string, number>> = {
  Turret: { damage: 12, range: 125, attackSpeed: 0.7 },
  Sniper: { damage: 40, range: 200, attackSpeed: 0.8 },
  Machine: { damage: 10, range: 100, attackSpeed: 0.15 },
  Spike: { damage: 15, range: 15, health: 500 },
};

export const entityValues: Record<string, Record<string, number>> = {
  Turret: { damage: 1, attackSpeed: 0.8, range: 100 },
  Sniper: { damage: 5, attackSpeed: 2, range: 150 },
  Machine: { damage: 1, attackSpeed: 0.3, range: 75 },
  Spike: { damage: 10, range: 15, health: 50 },
};
