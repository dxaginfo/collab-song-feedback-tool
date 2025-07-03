const fs = require('fs');
const path = require('path');
const { pool } = require('../index');

/**
 * Run database migrations
 */
const runMigrations = async () => {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await pool.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(migration => migration.name);

    // Get all migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const migrationFile of migrationFiles) {
        if (!executedMigrationNames.includes(migrationFile)) {
          console.log(`Running migration: ${migrationFile}`);

          // Read and execute migration file
          const migrationPath = path.join(migrationsDir, migrationFile);
          const migrationSql = fs.readFileSync(migrationPath, 'utf8');
          await client.query(migrationSql);

          // Record migration as executed
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationFile]
          );

          console.log(`Migration completed: ${migrationFile}`);
        } else {
          console.log(`Migration already executed: ${migrationFile}`);
        }
      }

      await client.query('COMMIT');
      console.log('All migrations completed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Migration failed:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations when script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
