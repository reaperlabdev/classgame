export const placementSettings = {
  Turret: { baseCost: 25, inflation: 1.25, max: 1000 },
  Sniper: { baseCost: 50, inflation: 1.5, max: 2500 },
  Machine: { baseCost: 50, inflation: 1.55, max: 5000 },
  Spike: { baseCost: 30, inflation: 1.1, max: 1000 },
};

export let entityValues = {
  Turret: {
    cost: 25,
    defaultCost: 25,
    damage: 1,
    attackSpeed: 0.8,
    range: 100,
  },
  Sniper: {
    cost: 50,
    defaultCost: 50,
    damage: 5,
    attackSpeed: 2,
    range: 150,
  },
  Machine: {
    cost: 75,
    defaultCost: 75,
    damage: 1,
    attackSpeed: 0.3,
    range: 75,
  },
  Spike: {
    cost: 30,
    defaultCost: 30,
    damage: 10,
    attackSpeed: 1,
    range: 15,
  },
};
