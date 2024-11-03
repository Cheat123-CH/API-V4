// ===========================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

// ============================================================================>> Custom Library
import { AdminMiddleware } from '@app/core/middlewares/admin.middleware';
import { DeviceTrackerMiddleware } from '@app/core/middlewares/device-tracker.middleware';
import { DashboardModule } from './dashbord/dashboard.module';
import { ProductModule } from './product/product.module';
import { ProductsTypeModule } from './product/type/type.module';
import { SaleModule } from './sale/sale.module';
import { UserModule } from './user/user.module';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    imports: [
        DashboardModule,
        SaleModule,
        ProductModule,
        ProductsTypeModule,
        UserModule
    ]
})

export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AdminMiddleware, DeviceTrackerMiddleware)
            .forRoutes({ path: 'api/admin/*', method: RequestMethod.ALL });
    }
}