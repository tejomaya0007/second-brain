import { Sequelize } from 'sequelize';

// Prefer PostgreSQL when DATABASE_URL is provided (deployment),
// otherwise fall back to local SQLite for simple dev.
const hasPostgresUrl = !!process.env.DATABASE_URL;

const sequelize = hasPostgresUrl
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './database.sqlite',
      logging: false,
    });

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      hasPostgresUrl ? '✅ PostgreSQL connected' : '✅ SQLite connected'
    );

    // Basic sync so models are created if they don't exist.
    await sequelize.sync();

    console.log('📦 Models synced');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

export default sequelize;
