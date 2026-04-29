import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';

import { ConfigModule } from '../config/config.module';
import { AppController } from './app.controller';
import { appRoutes } from './app.routes';

import { ExceptionErrorsFilter } from './core/exceptions/errors.filter';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { JwtMiddleware } from './core/middlewares/jwt.middleware';

import { AccountModule } from './resources/r1-account/module';
import { CashierModule } from './resources/r2-cashier/module';
import { AdminModule } from './resources/r3-admin/module';
import { UtilsModule } from './utils/utils.module';

import { BasicModule } from './resources/r4-testing/basic/module';
import { FileModule } from './resources/r4-testing/file-service/module';
import { MyProfileModule } from './resources/r4-testing/my-profile/my_profile.module';
import { ReportJSModule } from './resources/r4-testing/third-party/report/module';
import { SMSModule } from './resources/r4-testing/third-party/sms/module';
import { TelegramModule } from './resources/r4-testing/third-party/telegram/module';

@Module({
  controllers: [AppController],

  imports: [
    ConfigModule,

    AccountModule,
    AdminModule,
    CashierModule,
    UtilsModule,

    BasicModule,
    FileModule,
    TelegramModule,
    SMSModule,
    ReportJSModule,
    MyProfileModule,

    RouterModule.register(appRoutes),
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionErrorsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'account/auth/login', method: RequestMethod.POST },
        { path: 'account/auth/register', method: RequestMethod.POST },
        { path: 'testing/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}