// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { DefaultFuncitonModule } from './default_function/default_function.module';

@Module({
    imports: [
        DefaultFuncitonModule
    ]
})

export class TestingModule {}