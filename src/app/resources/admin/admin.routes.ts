// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { DashboardModule } from './dashbord/dashboard.module';
import { ProductModule } from './product/product.module';
import { ProductsTypeModule } from './product/type/type.module';
import { SaleModule } from './sale/sale.module';
import { UserModule } from './user/user.module';


export const adminRoutes: Routes = [
    {
        path: 'dashboard',
        module: DashboardModule
    },
    {
        path: 'sales',
        module: SaleModule
    },
    {
        path: 'products',
        module: ProductModule
    },
    {
        path: 'products/types',
        module: ProductsTypeModule
    },
    {
        path: 'users',
        module: UserModule
    },
];