// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [BasicController],
    providers: [BasicService]
})
export class BasicModule { }
