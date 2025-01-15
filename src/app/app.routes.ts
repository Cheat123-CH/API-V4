// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { accountRoutes } from './resources/r1-account/account.routes';
import { adminRoutes } from './resources/r3-admin/admin.routes';
import { cashierRoutes } from './resources/r2-cashier/cashier.routes';
import { utilsRoutes } from './utils/utils.routes';

import { testingRoutes } from './resources/r4-testing/testing.routes';

export const appRoutes: Routes = [{
    path: 'api',
    children: [
        {
            path: 'account',
            children: accountRoutes
        },
        {
            path: 'admin',
            children: adminRoutes
        },
        {
            path: 'cashier',
            children: cashierRoutes
        },
        {
            path: 'share',
            children: utilsRoutes
        },

        {
            path: 'testing',
            children: testingRoutes
        },
    ]
}];