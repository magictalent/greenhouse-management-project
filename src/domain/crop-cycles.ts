import type { CropCycle, CropStageHistory, GrowthStageCode } from '@/domain/types';

export function currentStage(
  cropCycleId: string,
  history: CropStageHistory[]
): GrowthStageCode | null {
  const open = history.find(
    (entry) => entry.cropCycleId === cropCycleId && entry.endedAt === null
  );

  return open?.stage ?? null;
}

export function activeCropCycles(cycles: CropCycle[]): CropCycle[] {
  return cycles.filter(
    (cycle) => cycle.status === 'active' || cycle.status === 'harvesting'
  );
}
