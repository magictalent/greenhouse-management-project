import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('greenhouse.db');

  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Create tables if they don't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      timeZone TEXT NOT NULL,
      unitSystem TEXT NOT NULL,
      locale TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS greenhouses (
      id TEXT PRIMARY KEY,
      farmId TEXT NOT NULL,
      name TEXT NOT NULL,
      growingMethod TEXT NOT NULL,
      areaSquareMeters REAL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (farmId) REFERENCES farms(id)
    );

    CREATE TABLE IF NOT EXISTS zones (
      id TEXT PRIMARY KEY,
      greenhouseId TEXT NOT NULL,
      name TEXT NOT NULL,
      growingMethod TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (greenhouseId) REFERENCES greenhouses(id)
    );

    CREATE TABLE IF NOT EXISTS species (
      id TEXT PRIMARY KEY,
      commonName TEXT NOT NULL,
      scientificName TEXT,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cultivars (
      id TEXT PRIMARY KEY,
      speciesId TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (speciesId) REFERENCES species(id)
    );

    CREATE TABLE IF NOT EXISTS crop_cycles (
      id TEXT PRIMARY KEY,
      zoneId TEXT NOT NULL,
      cultivarId TEXT NOT NULL,
      growingMethod TEXT NOT NULL,
      plantingDate TEXT NOT NULL,
      plantCount INTEGER,
      expectedHarvestStart TEXT,
      expectedHarvestEnd TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (zoneId) REFERENCES zones(id),
      FOREIGN KEY (cultivarId) REFERENCES cultivars(id)
    );

    CREATE TABLE IF NOT EXISTS stage_history (
      id TEXT PRIMARY KEY,
      cropCycleId TEXT NOT NULL,
      stage TEXT NOT NULL,
      startedAt TEXT NOT NULL,
      endedAt TEXT,
      FOREIGN KEY (cropCycleId) REFERENCES crop_cycles(id)
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
      id TEXT PRIMARY KEY,
      sensorDeviceId TEXT,
      greenhouseId TEXT NOT NULL,
      zoneId TEXT,
      metricCode TEXT NOT NULL,
      value REAL,
      unit TEXT NOT NULL,
      measuredAt TEXT NOT NULL,
      ingestedAt TEXT NOT NULL,
      quality TEXT NOT NULL,
      source TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      farmId TEXT NOT NULL,
      greenhouseId TEXT,
      cropCycleId TEXT,
      title TEXT NOT NULL,
      dueAt TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (farmId) REFERENCES farms(id)
    );

    CREATE TABLE IF NOT EXISTS harvests (
      id TEXT PRIMARY KEY,
      cropCycleId TEXT NOT NULL,
      harvestedAt TEXT NOT NULL,
      marketableKg REAL,
      rejectedKg REAL,
      isEstimate INTEGER NOT NULL,
      FOREIGN KEY (cropCycleId) REFERENCES crop_cycles(id)
    );
  `);

  return db;
}
