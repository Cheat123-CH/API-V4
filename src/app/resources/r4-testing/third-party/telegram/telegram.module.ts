// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [TelegramController],
    providers: [TelegramService]
})
export class TelegramModule { }
