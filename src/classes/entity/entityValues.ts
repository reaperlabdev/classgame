export const upgradeLimits = {
  Turret: { damage: 20, range: 125, attackSpeed: 0.4 },
  Sniper: { damage: 50, range: 200, attackSpeed: 0.7 },
  Machine: { damage: 10, range: 100, attackSpeed: 0.2 },
  Spike: { damage: 50, range: 15, attackSpeed: 0.5 },
};

export const baseEntityCosts: Record<keyof typeof entityValues, number> = {
  Turret: 25,
  Sniper: 50,
  Machine: 50,
  Spike: 30,
};

export let entityValues = {
  Turret: {
    cost: 25,
    damage: 1,
    attackSpeed: 0.6,
    range: 100,
  },
  Sniper: {
    cost: 50,
    damage: 5,
    attackSpeed: 2,
    range: 150,
  },
  Machine: {
    cost: 50,
    damage: 1,
    attackSpeed: 0.15,
    range: 75,
  },
  Spike: {
    cost: 30,
    damage: 10,
    attackSpeed: 1,
    range: 15,
  },
};
