import entityData from "./entitySettings.json";
import upgradeData from "./upgrade/upgradeSettings.json";

export interface UpgradePath {
  label: string;
  property: string;
  baseCost: number;
  growth: number;
  step: number;
}

export const placementSettings: Record<
  string,
  { baseCost: number; inflation: number; max: number }
> = entityData.placement;

export let entityValues: Record<string, Record<string, number>> = JSON.parse(
  JSON.stringify(entityData.stats),
);

export const entityDefaults: Record<
  string,
  Record<string, number>
> = JSON.parse(JSON.stringify(entityData.stats));

export const upgradeSettings: Record<string, { paths: UpgradePath[] }> =
  upgradeData.paths;

export const upgradeLimits: Record<
  string,
  Record<string, number>
> = upgradeData.limits;
