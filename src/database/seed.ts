import "colors";
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config();

import sequelizeConfig from '@config/sequelize.config';

import { MyProfileSeeder } from "./seeds/my-profile/my_profile.seeder";
import { OrderSeeder } from "./seeds/pos/order.seeder";
import { ProductSeeder } from "./seeds/pos/product.seeder";
import { UserSeeder } from "./seeds/user/user.seed";

// ✅ Import all models (default imports)
import MyProfile from '@app/models/my-profile/my_profile.model';
import Notification from '@app/models/notification/notification.model';
import OrderDetail from '@app/models/order/detail.model';
import Order from '@app/models/order/order.model';
import Product from '@app/models/product/product.model';
import ProductType from '@app/models/product/type.model';
import Role from '@app/models/user/role.model';
import Telegram from '@app/models/user/telegram.model';
import User from '@app/models/user/user.model';
import UserLog from '@app/models/user/user_logs.model';
import UserOTP from '@app/models/user/user_otps.model';
import UserRole from '@app/models/user/user_roles.model';

class SeederInitializer {

    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(sequelizeConfig);

        // ✅ Register all models
        this.sequelize.addModels([
            MyProfile,
            Notification,
            OrderDetail,
            Order,
            Product,
            ProductType,
            Role,
            Telegram,
            User,
            UserLog,
            UserOTP,
            UserRole,
        ]);
    }

    private async shouldSeed(): Promise<boolean> {
        const force = process.env.FORCE_SEED === 'true';
        if (force) {
            console.log('Force seeding enabled'.yellow);
            return true;
        }
        console.log('Skipping seed. Set FORCE_SEED=true to run.'.cyan);
        return false;
    }

    private async seedData() {
        await this.sequelize.authenticate();
        console.log(`✅ Connected to: ${process.env.DATABASE_URL}`.green);
        console.log('Seeding data...'.green);

        await UserSeeder.seed();
        await ProductSeeder.seed();
        await OrderSeeder.seed();
        await MyProfileSeeder.seed();

        console.log('Seeding completed successfully.'.green);
    }

    private async handleSeedingError(error: unknown) {
        if (error instanceof Error) {
            console.log('\x1b[31m%s\x1b[0m', error.message);
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Unknown error');
        }
        await this.sequelize.close();
        process.exit(1);
    }

    public async startSeeding() {
        try {
            const run = await this.shouldSeed();
            if (!run) {
                process.exit(0);
            }
            await this.seedData();
            await this.sequelize.close();
            process.exit(0);
        } catch (error) {
            await this.handleSeedingError(error);
        }
    }
}

const seederInitializer = new SeederInitializer();
seederInitializer.startSeeding();