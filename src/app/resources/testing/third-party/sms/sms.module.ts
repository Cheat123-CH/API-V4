// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { SMSController } from './sms.controller';
import { SMSService } from './sms.service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [SMSController],
    providers: [SMSService]
})
export class SMSModule { }
