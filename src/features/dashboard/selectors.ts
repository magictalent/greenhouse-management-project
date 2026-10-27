import { currentStage } from '@/domain/crop-cycles';
import { growthStageLabel } from '@/domain/crop-stages';
import {
  isReadingStale,
  latestReadingForMetric,
} from '@/domain/measurements/freshness';
import { evaluateRules } from '@/domain/recommendations/rules';
import type {
  AttentionItem,
  FarmSnapshot,
  FarmTask,
  Greenhouse,
  HarvestRecord,
  SensorReading,
} from '@/domain/types';

export type ConditionCard = {
  greenhouseId: string;
  greenhouseName: string;
  zoneLabel: string | null;
  metricLabel: string;
  displayValue: string;
  measuredAt: string | null;
  isStale: boolean;
  isMissing: boolean;
};

export type CropCycleSummary = {
  id: string;
  cropName: string;
  cultivarName: string;
  greenhouseName: string;
  zoneName: string;
  stageLabel: string;
  plantCount: number | null;
  status: string;
};

export type DashboardModel = {
  farmName: string;
  timeZone: string;
  unitSystem: string;
  greenhouseCount: number;
  activeCycleCount: number;
  attentionItems: AttentionItem[];
  conditions: ConditionCard[];
  todayTasks: FarmTask[];
  cropCycles: CropCycleSummary[];
  latestHarvest: {
    cropName: string;
    greenhouseName: string;
    harvestedAt: string;
    marketableKg: number | null;
    rejectedKg: number | null;
    isEstimate: boolean;
  } | null;
};

const METRIC_LABELS: Record<SensorReading['metricCode'], string> = {
  air_temperature: 'Air temperature',
  relative_humidity: 'Relative humidity',
  light_intensity: 'Light intensity',
  carbon_dioxide: 'Carbon dioxide',
  root_zone_moisture: 'Root-zone moisture',
};

function greenhouseById(
  snapshot: FarmSnapshot,
  id: string
): Greenhouse | undefined {
  return snapshot.greenhouses.find((item) => item.id === id);
}

function formatReadingValue(reading: SensorReading | null): string {
  if (!reading || reading.value === null) {
    return 'No reading';
  }

  return `${reading.value} ${reading.unit}`;
}

export function buildDashboardModel(
  snapshot: FarmSnapshot,
  nowMs: number
): DashboardModel {
  const conditions: ConditionCard[] = snapshot.greenhouses.flatMap(
    (greenhouse) => {
      const temperature = latestReadingForMetric(
        snapshot.readings,
        greenhouse.id,
        'air_temperature'
      );
      const humidity = latestReadingForMetric(
        snapshot.readings,
        greenhouse.id,
        'relative_humidity'
      );

      return [
        toConditionCard(snapshot, greenhouse, temperature, nowMs),
        toConditionCard(snapshot, greenhouse, humidity, nowMs),
      ];
    }
  );

  const cropCycles: CropCycleSummary[] = snapshot.cropCycles.map((cycle) => {
    const cultivar = snapshot.cultivars.find(
      (item) => item.id === cycle.cultivarId
    );
    const species = snapshot.species.find(
      (item) => item.id === cultivar?.speciesId
    );
    const zone = snapshot.zones.find((item) => item.id === cycle.zoneId);
    const greenhouse = zone
      ? greenhouseById(snapshot, zone.greenhouseId)
      : undefined;
    const stage = currentStage(cycle.id, snapshot.stageHistory);

    return {
      id: cycle.id,
      cropName: species?.commonName ?? 'Unknown crop',
      cultivarName: cultivar?.name ?? 'Unknown cultivar',
      greenhouseName: greenhouse?.name ?? 'Unassigned greenhouse',
      zoneName: zone?.name ?? 'Unassigned zone',
      stageLabel: stage ? growthStageLabel(stage) : 'Stage not recorded',
      plantCount: cycle.plantCount,
      status: cycle.status,
    };
  });

  const latestHarvestRecord = latestHarvest(snapshot.harvests);
  const harvestCycle = latestHarvestRecord
    ? snapshot.cropCycles.find(
        (cycle) => cycle.id === latestHarvestRecord.cropCycleId
      )
    : undefined;
  const harvestSummary = cropCycles.find(
    (cycle) => cycle.id === harvestCycle?.id
  );

  const dynamicAttentionItems = evaluateRules(snapshot.readings, nowMs);
  const attentionItems = [...snapshot.attentionItems, ...dynamicAttentionItems];

  return {
    farmName: snapshot.farm.name,
    timeZone: snapshot.farm.timeZone,
    unitSystem: snapshot.farm.unitSystem,
    greenhouseCount: snapshot.greenhouses.length,
    activeCycleCount: snapshot.cropCycles.filter(
      (cycle) => cycle.status === 'active' || cycle.status === 'harvesting'
    ).length,
    attentionItems,
    conditions,
    todayTasks: snapshot.tasks.filter((task) => task.status === 'pending'),
    cropCycles,
    latestHarvest:
      latestHarvestRecord && harvestSummary
        ? {
            cropName: harvestSummary.cropName,
            greenhouseName: harvestSummary.greenhouseName,
            harvestedAt: latestHarvestRecord.harvestedAt,
            marketableKg: latestHarvestRecord.marketableKg,
            rejectedKg: latestHarvestRecord.rejectedKg,
            isEstimate: latestHarvestRecord.isEstimate,
          }
        : null,
  };
}

function toConditionCard(
  snapshot: FarmSnapshot,
  greenhouse: Greenhouse,
  reading: SensorReading | null,
  nowMs: number
): ConditionCard {
  const zone = reading?.zoneId
    ? snapshot.zones.find((item) => item.id === reading.zoneId)
    : undefined;

  return {
    greenhouseId: greenhouse.id,
    greenhouseName: greenhouse.name,
    zoneLabel: zone?.name ?? null,
    metricLabel: reading
      ? METRIC_LABELS[reading.metricCode]
      : 'Environment',
    displayValue: formatReadingValue(reading),
    measuredAt: reading?.measuredAt ?? null,
    isStale: reading ? isReadingStale(reading, nowMs) : false,
    isMissing: !reading || reading.value === null,
  };
}

function latestHarvest(harvests: HarvestRecord[]): HarvestRecord | null {
  if (harvests.length === 0) {
    return null;
  }

  return harvests.reduce((latest, current) =>
    Date.parse(current.harvestedAt) > Date.parse(latest.harvestedAt)
      ? current
      : latest
  );
}

export function formatFarmDateTime(
  iso: string,
  timeZone: string,
  locale: string
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
