// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { DefaultFuncitonModule } from './default_function/default_function.module';

export const testingRoutes: Routes = [
    {
        path: 'testing',
        module: DefaultFuncitonModule
    }
];