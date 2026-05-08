// ================================================================>> Third Party Library
import { Sequelize } from 'sequelize-typescript';
import "colors";
import * as dotenv from 'dotenv';

dotenv.config(); // ✅ Load env vars first

// ================================================================>> Custom Library
import sequelizeConfig from '@config/sequelize.config';

class MigrationInitializer {

    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(sequelizeConfig);
    }

    private async confirmMigration(): Promise<boolean> {
        const tableNames = await this.sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            if (process.env.FORCE_MIGRATE !== 'true') {
                console.log('Tables already exist. Set FORCE_MIGRATE=true to proceed.'.yellow);
                return false;
            }
            console.log('Force migration enabled. Dropping and recreating tables...'.yellow);
        }
        return true;
    }

    private async dropAndRecreateTables() {
        await this.sequelize.authenticate();
        console.log(`✅ Connected to: ${process.env.DATABASE_URL}`.green);
        await this.sequelize.sync({ force: true });
    }

    private async handleMigrationError(error: Error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        await this.sequelize.close();
        process.exit(1);
    }

    public async startMigration() {
        try {
            const confirmation = await this.confirmMigration();
            if (!confirmation) {
                console.log('\nMigration aborted.'.cyan);
                process.exit(0);
            }

            await this.dropAndRecreateTables();
            console.log('\nMigration completed successfully.'.green);
            await this.sequelize.close();
            process.exit(0);
        } catch (error: any) {
            await this.handleMigrationError(error);
        }
    }
}

const migrationInitializer = new MigrationInitializer();
migrationInitializer.startMigration();