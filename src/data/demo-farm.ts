import type { FarmSnapshot } from '@/domain/types';

/**
 * In-memory demo farm for Milestone 1.
 * This is sample data held in the app bundle. It is not persisted, not synced,
 * and is not a sensor feed.
 */
export const SAMPLE_DATA_NOTICE =
  'This dashboard uses bundled sample data. Changes are not saved on this device.';

/** Fixed "now" for stale-data checks so the demo does not depend on device clock. */
export const DEMO_CLOCK_ISO = '2026-10-26T15:00:00-07:00';

export const DEMO_CLOCK_MS = Date.parse(DEMO_CLOCK_ISO);

export const demoFarmSnapshot: FarmSnapshot = {
  farm: {
    id: 'farm-riverside-demo',
    name: 'Riverside Demo Farm',
    timeZone: 'America/Los_Angeles',
    unitSystem: 'metric',
    locale: 'en-US',
    createdAt: '2026-01-12T08:00:00-08:00',
    updatedAt: '2026-10-26T08:00:00-07:00',
  },
  greenhouses: [
    {
      id: 'gh-north-tunnel',
      farmId: 'farm-riverside-demo',
      name: 'North Tunnel',
      growingMethod: 'substrate',
      areaSquareMeters: 320,
      notes: 'Double-layer poly tunnel with drip irrigation and a shade curtain.',
      createdAt: '2026-02-01T09:00:00-08:00',
      updatedAt: '2026-09-18T11:00:00-07:00',
    },
    {
      id: 'gh-east-glass',
      farmId: 'farm-riverside-demo',
      name: 'East Glasshouse',
      growingMethod: 'mixed',
      areaSquareMeters: 540,
      notes: 'Venlo-style house with NFT lettuce and substrate cucumbers.',
      createdAt: '2025-11-03T09:00:00-08:00',
      updatedAt: '2026-10-02T16:20:00-07:00',
    },
  ],
  zones: [
    {
      id: 'zone-north-a',
      greenhouseId: 'gh-north-tunnel',
      name: 'Bed A — west',
      growingMethod: 'substrate',
      createdAt: '2026-02-01T09:00:00-08:00',
      updatedAt: '2026-02-01T09:00:00-08:00',
    },
    {
      id: 'zone-north-b',
      greenhouseId: 'gh-north-tunnel',
      name: 'Bed B — east',
      growingMethod: 'substrate',
      createdAt: '2026-02-01T09:00:00-08:00',
      updatedAt: '2026-02-01T09:00:00-08:00',
    },
    {
      id: 'zone-east-nft',
      greenhouseId: 'gh-east-glass',
      name: 'NFT tables',
      growingMethod: 'hydroponics',
      createdAt: '2025-11-03T09:00:00-08:00',
      updatedAt: '2026-03-14T10:00:00-07:00',
    },
    {
      id: 'zone-east-vines',
      greenhouseId: 'gh-east-glass',
      name: 'Vine rows 1–4',
      growingMethod: 'substrate',
      createdAt: '2025-11-03T09:00:00-08:00',
      updatedAt: '2026-06-01T08:30:00-07:00',
    },
  ],
  species: [
    {
      id: 'sp-tomato',
      commonName: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      category: 'vegetable',
    },
    {
      id: 'sp-cucumber',
      commonName: 'Cucumber',
      scientificName: 'Cucumis sativus',
      category: 'vegetable',
    },
    {
      id: 'sp-lettuce',
      commonName: 'Lettuce',
      scientificName: 'Lactuca sativa',
      category: 'vegetable',
    },
    {
      id: 'sp-pepper',
      commonName: 'Bell pepper',
      scientificName: 'Capsicum annuum',
      category: 'vegetable',
    },
  ],
  cultivars: [
    {
      id: 'cv-trust',
      speciesId: 'sp-tomato',
      name: 'Trust',
    },
    {
      id: 'cv-tyria',
      speciesId: 'sp-cucumber',
      name: 'Tyria',
    },
    {
      id: 'cv-rex',
      speciesId: 'sp-lettuce',
      name: 'Rex',
    },
  ],
  cropCycles: [
    {
      id: 'cycle-tomato-north-a',
      zoneId: 'zone-north-a',
      cultivarId: 'cv-trust',
      growingMethod: 'substrate',
      plantingDate: '2026-08-04',
      plantCount: 240,
      expectedHarvestStart: '2026-10-20',
      expectedHarvestEnd: '2026-12-15',
      status: 'harvesting',
      createdAt: '2026-07-20T10:00:00-07:00',
      updatedAt: '2026-10-21T07:40:00-07:00',
    },
    {
      id: 'cycle-cucumber-east',
      zoneId: 'zone-east-vines',
      cultivarId: 'cv-tyria',
      growingMethod: 'substrate',
      plantingDate: '2026-09-02',
      plantCount: 180,
      expectedHarvestStart: '2026-10-28',
      expectedHarvestEnd: '2026-12-20',
      status: 'active',
      createdAt: '2026-08-18T09:00:00-07:00',
      updatedAt: '2026-10-24T16:00:00-07:00',
    },
    {
      id: 'cycle-lettuce-nft',
      zoneId: 'zone-east-nft',
      cultivarId: 'cv-rex',
      growingMethod: 'hydroponics',
      plantingDate: '2026-10-06',
      plantCount: 960,
      expectedHarvestStart: '2026-11-10',
      expectedHarvestEnd: '2026-11-18',
      status: 'active',
      createdAt: '2026-10-05T14:00:00-07:00',
      updatedAt: '2026-10-20T09:15:00-07:00',
    },
  ],
  stageHistory: [
    {
      id: 'stage-tomato-veg',
      cropCycleId: 'cycle-tomato-north-a',
      stage: 'vegetative',
      startedAt: '2026-08-04T00:00:00-07:00',
      endedAt: '2026-09-10T00:00:00-07:00',
    },
    {
      id: 'stage-tomato-flower',
      cropCycleId: 'cycle-tomato-north-a',
      stage: 'flowering',
      startedAt: '2026-09-10T00:00:00-07:00',
      endedAt: '2026-09-28T00:00:00-07:00',
    },
    {
      id: 'stage-tomato-harvest',
      cropCycleId: 'cycle-tomato-north-a',
      stage: 'harvest',
      startedAt: '2026-09-28T00:00:00-07:00',
      endedAt: null,
    },
    {
      id: 'stage-cuke-veg',
      cropCycleId: 'cycle-cucumber-east',
      stage: 'vegetative',
      startedAt: '2026-09-02T00:00:00-07:00',
      endedAt: '2026-10-08T00:00:00-07:00',
    },
    {
      id: 'stage-cuke-flower',
      cropCycleId: 'cycle-cucumber-east',
      stage: 'flowering',
      startedAt: '2026-10-08T00:00:00-07:00',
      endedAt: null,
    },
    {
      id: 'stage-lettuce-seedling',
      cropCycleId: 'cycle-lettuce-nft',
      stage: 'seedling',
      startedAt: '2026-10-06T00:00:00-07:00',
      endedAt: '2026-10-16T00:00:00-07:00',
    },
    {
      id: 'stage-lettuce-veg',
      cropCycleId: 'cycle-lettuce-nft',
      stage: 'vegetative',
      startedAt: '2026-10-16T00:00:00-07:00',
      endedAt: null,
    },
  ],
  sensorDevices: [
    {
      id: 'sensor-north-center',
      greenhouseId: 'gh-north-tunnel',
      zoneId: 'zone-north-a',
      name: 'North aisle climate node',
      supportedMetrics: ['air_temperature', 'relative_humidity'],
    },
    {
      id: 'sensor-east-gutter',
      greenhouseId: 'gh-east-glass',
      zoneId: 'zone-east-vines',
      name: 'East gutter climate node',
      supportedMetrics: ['air_temperature', 'relative_humidity'],
    },
  ],
  readings: [
    {
      id: 'read-north-temp',
      sensorDeviceId: 'sensor-north-center',
      greenhouseId: 'gh-north-tunnel',
      zoneId: 'zone-north-a',
      metricCode: 'air_temperature',
      value: 22.4,
      unit: '°C',
      measuredAt: '2026-10-26T13:40:00-07:00',
      ingestedAt: '2026-10-26T13:40:08-07:00',
      quality: 'valid',
      source: 'sample',
    },
    {
      id: 'read-north-rh',
      sensorDeviceId: 'sensor-north-center',
      greenhouseId: 'gh-north-tunnel',
      zoneId: 'zone-north-a',
      metricCode: 'relative_humidity',
      value: 78,
      unit: '%',
      measuredAt: '2026-10-25T21:10:00-07:00',
      ingestedAt: '2026-10-25T21:10:04-07:00',
      quality: 'stale',
      source: 'sample',
    },
    {
      id: 'read-east-temp',
      sensorDeviceId: 'sensor-east-gutter',
      greenhouseId: 'gh-east-glass',
      zoneId: 'zone-east-vines',
      metricCode: 'air_temperature',
      value: 24.1,
      unit: '°C',
      measuredAt: '2026-10-26T13:42:00-07:00',
      ingestedAt: '2026-10-26T13:42:06-07:00',
      quality: 'valid',
      source: 'sample',
    },
    {
      id: 'read-east-rh',
      sensorDeviceId: 'sensor-east-gutter',
      greenhouseId: 'gh-east-glass',
      zoneId: 'zone-east-vines',
      metricCode: 'relative_humidity',
      value: 62,
      unit: '%',
      measuredAt: '2026-10-26T13:42:00-07:00',
      ingestedAt: '2026-10-26T13:42:06-07:00',
      quality: 'valid',
      source: 'sample',
    },
  ],
  tasks: [
    {
      id: 'task-scout-north',
      farmId: 'farm-riverside-demo',
      greenhouseId: 'gh-north-tunnel',
      cropCycleId: 'cycle-tomato-north-a',
      title: 'Scout North Tunnel tomatoes for leaf spots',
      dueAt: '2026-10-26T16:00:00-07:00',
      status: 'pending',
    },
    {
      id: 'task-irrigate-east',
      farmId: 'farm-riverside-demo',
      greenhouseId: 'gh-east-glass',
      cropCycleId: 'cycle-cucumber-east',
      title: 'Check cucumber drip lines and drainage volume',
      dueAt: '2026-10-26T15:00:00-07:00',
      status: 'pending',
    },
    {
      id: 'task-thin-lettuce',
      farmId: 'farm-riverside-demo',
      greenhouseId: 'gh-east-glass',
      cropCycleId: 'cycle-lettuce-nft',
      title: 'Remove weak lettuce transplants from NFT channels',
      dueAt: '2026-10-27T09:00:00-07:00',
      status: 'pending',
    },
  ],
  harvests: [
    {
      id: 'harvest-tomato-oct-24',
      cropCycleId: 'cycle-tomato-north-a',
      harvestedAt: '2026-10-24T10:30:00-07:00',
      marketableKg: 86.4,
      rejectedKg: 4.2,
      isEstimate: false,
    },
  ],
  attentionItems: [
    {
      id: 'attn-stale-humidity',
      severity: 'attention',
      title: 'North Tunnel humidity reading is stale',
      explanation:
        'The last relative-humidity value is more than 16 hours old. Treat it as historical, not current.',
      evidence:
        'Sample reading 78% at North aisle climate node, measured 2026-10-25 21:10 (farm time).',
      greenhouseId: 'gh-north-tunnel',
      cropCycleId: null,
    },
    {
      id: 'attn-missing-co2',
      severity: 'info',
      title: 'No carbon dioxide readings configured',
      explanation:
        'CO₂ is not collected on this demo farm. The dashboard will not invent a value.',
      evidence: 'No sensor device lists carbon_dioxide as a supported metric.',
      greenhouseId: null,
      cropCycleId: null,
    },
    {
      id: 'attn-cuke-harvest-window',
      severity: 'info',
      title: 'Cucumber harvest window starts soon',
      explanation:
        'Expected first harvest for Tyria in East Glasshouse begins 2026-10-28. This is a planned date, not a yield forecast.',
      evidence: 'Crop cycle cycle-cucumber-east expectedHarvestStart = 2026-10-28.',
      greenhouseId: 'gh-east-glass',
      cropCycleId: 'cycle-cucumber-east',
    },
  ],
};

export function getDemoFarmSnapshot(): FarmSnapshot {
  return demoFarmSnapshot;
}
