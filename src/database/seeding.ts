import type { SQLiteDatabase } from 'expo-sqlite';
import { demoFarmSnapshot } from '@/data/demo-farm';

export async function seedDatabase(db: SQLiteDatabase) {
  // Check if farm already exists
  const farmCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM farms');
  if (farmCount && farmCount.count > 0) {
    return; // Already seeded
  }

  console.log('Seeding database with demo data...');

  // Seed Farm
  const { farm } = demoFarmSnapshot;
  await db.runAsync(
    'INSERT INTO farms (id, name, timeZone, unitSystem, locale, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [farm.id, farm.name, farm.timeZone, farm.unitSystem, farm.locale, farm.createdAt, farm.updatedAt]
  );

  // Seed Greenhouses
  for (const gh of demoFarmSnapshot.greenhouses) {
    await db.runAsync(
      'INSERT INTO greenhouses (id, farmId, name, growingMethod, areaSquareMeters, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [gh.id, gh.farmId, gh.name, gh.growingMethod, gh.areaSquareMeters, gh.notes, gh.createdAt, gh.updatedAt]
    );
  }

  // Seed Zones
  for (const zone of demoFarmSnapshot.zones) {
    await db.runAsync(
      'INSERT INTO zones (id, greenhouseId, name, growingMethod, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [zone.id, zone.greenhouseId, zone.name, zone.growingMethod, zone.createdAt, zone.updatedAt]
    );
  }

  // Seed Species
  for (const sp of demoFarmSnapshot.species) {
    await db.runAsync(
      'INSERT INTO species (id, commonName, scientificName, category) VALUES (?, ?, ?, ?)',
      [sp.id, sp.commonName, sp.scientificName, sp.category]
    );
  }

  // Seed Cultivars
  for (const cv of demoFarmSnapshot.cultivars) {
    await db.runAsync(
      'INSERT INTO cultivars (id, speciesId, name) VALUES (?, ?, ?)',
      [cv.id, cv.speciesId, cv.name]
    );
  }

  // Seed Crop Cycles
  for (const cycle of demoFarmSnapshot.cropCycles) {
    await db.runAsync(
      'INSERT INTO crop_cycles (id, zoneId, cultivarId, growingMethod, plantingDate, plantCount, expectedHarvestStart, expectedHarvestEnd, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cycle.id, cycle.zoneId, cycle.cultivarId, cycle.growingMethod, cycle.plantingDate, cycle.plantCount, cycle.expectedHarvestStart, cycle.expectedHarvestEnd, cycle.status, cycle.createdAt, cycle.updatedAt]
    );
  }

  // Seed Stage History
  for (const history of demoFarmSnapshot.stageHistory) {
    await db.runAsync(
      'INSERT INTO stage_history (id, cropCycleId, stage, startedAt, endedAt) VALUES (?, ?, ?, ?, ?)',
      [history.id, history.cropCycleId, history.stage, history.startedAt, history.endedAt]
    );
  }

  // Seed Readings
  for (const reading of demoFarmSnapshot.readings) {
    await db.runAsync(
      'INSERT INTO sensor_readings (id, sensorDeviceId, greenhouseId, zoneId, metricCode, value, unit, measuredAt, ingestedAt, quality, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reading.id, reading.sensorDeviceId, reading.greenhouseId, reading.zoneId, reading.metricCode, reading.value, reading.unit, reading.measuredAt, reading.ingestedAt, reading.quality, reading.source]
    );
  }

  // Seed Tasks
  for (const task of demoFarmSnapshot.tasks) {
    await db.runAsync(
      'INSERT INTO tasks (id, farmId, greenhouseId, cropCycleId, title, dueAt, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [task.id, task.farmId, task.greenhouseId, task.cropCycleId, task.title, task.dueAt, task.status]
    );
  }

  // Seed Harvests
  for (const harvest of demoFarmSnapshot.harvests) {
    await db.runAsync(
      'INSERT INTO harvests (id, cropCycleId, harvestedAt, marketableKg, rejectedKg, isEstimate) VALUES (?, ?, ?, ?, ?, ?)',
      [harvest.id, harvest.cropCycleId, harvest.harvestedAt, harvest.marketableKg, harvest.rejectedKg, harvest.isEstimate ? 1 : 0]
    );
  }
}
