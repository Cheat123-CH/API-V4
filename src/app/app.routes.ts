import { Routes } from '@nestjs/core';

import { AccountModule } from './resources/r1-account/module';
import { CashierModule } from './resources/r2-cashier/module';
import { AdminModule } from './resources/r3-admin/module';

import { BasicModule } from './resources/r4-testing/basic/module';
import { FileModule } from './resources/r4-testing/file-service/module';
import { MyProfileModule } from './resources/r4-testing/my-profile/my_profile.module';

import { ReportJSModule } from './resources/r4-testing/third-party/report/module';
import { SMSModule } from './resources/r4-testing/third-party/sms/module';
import { TelegramModule } from './resources/r4-testing/third-party/telegram/module';

export const appRoutes: Routes = [

  {
    path: 'account',
    module: AccountModule,
  },
  {
    path: 'cashier',
    module: CashierModule,
  },
  {
    path: 'admin',
    module: AdminModule,
  },

  // 🧪 Testing / utilities
  {
    path: 'testing/basic',
    module: BasicModule,
  },
  {
    path: 'testing/file',
    module: FileModule,
  },
  {
    path: 'testing/profile',
    module: MyProfileModule,
  },

  // 🌐 Third-party services
  {
    path: 'testing/report',
    module: ReportJSModule,
  },
  {
    path: 'testing/sms',
    module: SMSModule,
  },
  {
    path: 'testing/telegram',
    module: TelegramModule,
  },
];