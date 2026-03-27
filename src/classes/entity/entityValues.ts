export const upgradeLimits = {
  Turret: { damage: 12, range: 125, attackSpeed: 0.7 },
  Sniper: { damage: 40, range: 200, attackSpeed: 0.8 },
  Machine: { damage: 10, range: 100, attackSpeed: 0.15 },
  Spike: { damage: 15, range: 15, attackSpeed: 0.5 },
};

export const upgradeSettings = {
  Turret: {
    damage: { step: 1, baseCost: 15, growth: 1.3 },
    range: { step: 15, baseCost: 10, growth: 1.2 },
    speed: { step: -0.05, baseCost: 15, growth: 1.35 },
  },
  Sniper: {
    damage: { step: 5, baseCost: 60, growth: 1.6 },
    range: { step: 30, baseCost: 40, growth: 1.25 },
    speed: { step: -0.2, baseCost: 50, growth: 1.7 },
  },
  Machine: {
    damage: { step: 1, baseCost: 30, growth: 1.5 },
    range: { step: 10, baseCost: 20, growth: 1.3 },
    speed: { step: -0.02, baseCost: 40, growth: 1.65 },
  },
  Spike: {
    damage: { step: 2, baseCost: 20, growth: 1.4 },
    range: { step: 2, baseCost: 100, growth: 2.0 },
    speed: { step: -0.1, baseCost: 25, growth: 1.4 },
  },
};

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
