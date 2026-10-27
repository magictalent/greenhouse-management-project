import type { GrowthStageCode } from '@/domain/types';

export const GROWTH_STAGE_LABELS: Record<GrowthStageCode, string> = {
  seed_starting: 'Seed starting',
  seedling: 'Seedling',
  vegetative: 'Vegetative growth',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
  harvest: 'Harvesting',
  complete: 'Cycle complete',
};

export function growthStageLabel(stage: GrowthStageCode): string {
  return GROWTH_STAGE_LABELS[stage];
}
