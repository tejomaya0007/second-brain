import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  // Disable verbose SQL logging; we'll log HTTP requests instead
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite connected');
    // Basic sync so models are created if they don't exist.
    await sequelize.sync();

    // Lightweight manual migration: ensure 'archived' column exists on pages.
    try {
      await sequelize.query(
        "ALTER TABLE pages ADD COLUMN archived TINYINT NOT NULL DEFAULT 0;"
      );
      console.log("📦 Added 'archived' column to pages table");
    } catch (migrateErr) {
      // If the column already exists, SQLite will throw 'duplicate column name'
      if (/duplicate column name/i.test(migrateErr.message)) {
        // Safe to ignore
      } else {
        throw migrateErr;
      }
    }

    console.log('📦 Models synced');
  } catch (err) {
    console.error('❌ SQLite connection error:', err);
    process.exit(1);
  }
};

export default sequelize;
