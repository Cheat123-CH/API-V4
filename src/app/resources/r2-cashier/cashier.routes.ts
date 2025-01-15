// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { OrderModule } from './order/order.module';
import { SaleModule } from './sale/sale.module';

export const cashierRoutes: Routes = [
    {
        path: 'ordering',
        module: OrderModule
    },
    {
        path: 'sales',
        module: SaleModule
    },
];