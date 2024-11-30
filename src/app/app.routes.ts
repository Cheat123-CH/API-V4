// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { accountRoutes } from './resources/account/account.routes';
import { adminRoutes } from './resources/admin/admin.routes';
import { cashierRoutes } from './resources/cashier/cashier.routes';
import { utilsRoutes } from './utils/utils.routes';

import { testingRoutes } from './resources/testing/testing.routes';

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