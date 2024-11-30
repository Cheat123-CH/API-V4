// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { DefaultFunctionController } from './default_function.controller';
import { DefaultFunctionService } from './default_function.service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [DefaultFunctionController],
    providers: [DefaultFunctionService]
})
export class DefaultFuncitonModule { }
