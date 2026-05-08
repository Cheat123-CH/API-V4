import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
dotenv.config();

// Import all models
import MyProfile from '../app/models/my-profile/my_profile.model';
import Notification from '../app/models/notification/notification.model';
import OrderDetail from '../app/models/order/detail.model';
import Order from '../app/models/order/order.model';
import Product from '../app/models/product/product.model';
import ProductType from '../app/models/product/type.model';
import Role from '../app/models/user/role.model';
import Telegram from '../app/models/user/telegram.model';
import User from '../app/models/user/user.model';
import UsersLogs from '../app/models/user/user_logs.model';
import UserOTP from '../app/models/user/user_otps.model';
import UserRoles from '../app/models/user/user_roles.model';

const sequelizeConfig: SequelizeModuleOptions = {
    dialect: (process.env.DB_CONNECTION as Dialect) || 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: process.env.DB_TIMEZONE || 'Asia/Phnom_Penh',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    autoLoadModels: true,
    synchronize: false,
    logging: false,
    models: [
        MyProfile,
        Notification,
        OrderDetail,
        Order,
        Product,
        ProductType,
        Role,
        Telegram,
        User,
        UsersLogs,
        UserOTP,
        UserRoles,
    ],
};

export default sequelizeConfig;