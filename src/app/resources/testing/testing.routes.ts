// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { BasicModule } from './basic/basic.module';
import { TelegramModule } from './third-party/telegram/telegram.module';
import { SMSModule } from './third-party/sms/sms.module';

export const testingRoutes: Routes = [
    {
        path: 'basic',
        module: BasicModule
    }, 

    {
        path: 'telegram',
        module: TelegramModule
    }, 
    {
        path: 'sms',
        module: SMSModule
    }
];