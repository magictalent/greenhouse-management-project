/**
 * Core farm entities for the Greenhouse Management System.
 *
 * Timestamps are ISO-8601 strings. Instant interpretation uses the farm time
 * zone, not the device time zone.
 *
 * Numeric agricultural values use this unit convention unless a field stores
 * an explicit unit:
 * - temperature: °C
 * - relative humidity: %
 * - area: m²
 * - mass: kg
 *
 * Missing values use `null`. Do not substitute 0 for unknown measurements.
 */

export type GrowingMethod = 'soil' | 'substrate' | 'hydroponics' | 'mixed';

export type CropCategory = 'vegetable' | 'herb' | 'fruit' | 'other';

export type UnitSystem = 'metric' | 'imperial';

export type MeasurementSource =
  | 'manual'
  | 'sensor'
  | 'imported'
  | 'calculated'
  | 'sample';

export type DataQuality =
  | 'valid'
  | 'stale'
  | 'invalid'
  | 'missing'
  | 'unknown';

export type CropCycleStatus =
  | 'planned'
  | 'active'
  | 'harvesting'
  | 'completed';

export type GrowthStageCode =
  | 'seed_starting'
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'harvest'
  | 'complete';

export type MetricCode =
  | 'air_temperature'
  | 'relative_humidity'
  | 'light_intensity'
  | 'carbon_dioxide'
  | 'root_zone_moisture';

export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export type AlertSeverity = 'info' | 'attention' | 'warning';

export type Farm = {
  id: string;
  name: string;
  timeZone: string;
  unitSystem: UnitSystem;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

export type Greenhouse = {
  id: string;
  farmId: string;
  name: string;
  growingMethod: GrowingMethod;
  /** Floor area in square metres. `null` means the area is unknown. */
  areaSquareMeters: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Zone = {
  id: string;
  greenhouseId: string;
  name: string;
  growingMethod: GrowingMethod;
  createdAt: string;
  updatedAt: string;
};

export type CropSpecies = {
  id: string;
  commonName: string;
  scientificName: string | null;
  category: CropCategory;
};

export type Cultivar = {
  id: string;
  speciesId: string;
  name: string;
};

export type CropStageHistory = {
  id: string;
  cropCycleId: string;
  stage: GrowthStageCode;
  startedAt: string;
  endedAt: string | null;
};

export type CropCycle = {
  id: string;
  zoneId: string;
  cultivarId: string;
  growingMethod: GrowingMethod;
  plantingDate: string;
  plantCount: number | null;
  expectedHarvestStart: string | null;
  expectedHarvestEnd: string | null;
  status: CropCycleStatus;
  createdAt: string;
  updatedAt: string;
};

export type SensorDevice = {
  id: string;
  zoneId: string | null;
  greenhouseId: string;
  name: string;
  supportedMetrics: MetricCode[];
};

export type SensorReading = {
  id: string;
  sensorDeviceId: string | null;
  greenhouseId: string;
  zoneId: string | null;
  metricCode: MetricCode;
  value: number | null;
  unit: string;
  measuredAt: string;
  ingestedAt: string;
  quality: DataQuality;
  source: MeasurementSource;
};

export type FarmTask = {
  id: string;
  farmId: string;
  greenhouseId: string | null;
  cropCycleId: string | null;
  title: string;
  dueAt: string;
  status: TaskStatus;
};

export type HarvestRecord = {
  id: string;
  cropCycleId: string;
  harvestedAt: string;
  marketableKg: number | null;
  rejectedKg: number | null;
  isEstimate: boolean;
};

export type AttentionItem = {
  id: string;
  severity: AlertSeverity;
  title: string;
  explanation: string;
  evidence: string;
  greenhouseId: string | null;
  cropCycleId: string | null;
};

export type FarmSnapshot = {
  farm: Farm;
  greenhouses: Greenhouse[];
  zones: Zone[];
  species: CropSpecies[];
  cultivars: Cultivar[];
  cropCycles: CropCycle[];
  stageHistory: CropStageHistory[];
  sensorDevices: SensorDevice[];
  readings: SensorReading[];
  tasks: FarmTask[];
  harvests: HarvestRecord[];
  attentionItems: AttentionItem[];
};
