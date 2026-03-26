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
