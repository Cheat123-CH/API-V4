// ===========================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { UserMiddleware } from '@app/core/middlewares/user.middleware';
import { OrderModule } from './order/order.module';
import { SaleModule } from './sale/sale.module';
import { DeviceTrackerMiddleware } from '@app/core/middlewares/device-tracker.middleware';

@Module({
    imports: [
        SaleModule,
        OrderModule
    ]
})

export class CashierModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserMiddleware, DeviceTrackerMiddleware)
            .forRoutes({ path: 'api/cashier/*', method: RequestMethod.ALL });
    }
}