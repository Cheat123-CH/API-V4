import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const sequelizeConfig: SequelizeModuleOptions = {
    dialect : (process.env.DB_CONNECTION as Dialect) || 'postgres',
    host    : process.env.DB_HOST,
    port    : process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: process.env.DB_TIMEZONE || 'Asia/Phnom_Penh',
    dialectOptions: {
        ssl: {
            require           : true,
            rejectUnauthorized: false  // ✅ always enable SSL — required for Render
        }
    },
    autoLoadModels: true,
    synchronize   : false,
    logging       : false,
};

export default sequelizeConfig;