// ===========================================================================>> Core Library
import { SequelizeModuleOptions } from '@nestjs/sequelize';

// ===========================================================================>> Third Party Library
import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

/** @Render-safe Sequelize config */
const sequelizeConfig: SequelizeModuleOptions = {
    dialect: (process.env.DB_CONNECTION as Dialect) || 'postgres',

    // ✅ Safe production handling (Render)
    host: process.env.DB_HOST || undefined,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_DATABASE || undefined,

    timezone: process.env.DB_TIMEZONE || 'Asia/Phnom_Penh',

    models: [__dirname + '/../app/models/**/*.model.{ts,js}'],

    logging: false,

    // 🔥 IMPORTANT for Render PostgreSQL
    dialectOptions: isProd
        ? {
              ssl: {
                  require: true,
                  rejectUnauthorized: false,
              },
          }
        : {},

    // helps prevent silent startup issues
    retry: {
        max: 3,
    },
};

export default sequelizeConfig;