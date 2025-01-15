// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { AuthModule } from './auth/module';
import { ProfileModule } from './profile/module';


export const accountRoutes: Routes = [
    {
        path: 'auth',
        module: AuthModule
    },
    {
        path: 'profile',
        module: ProfileModule
    }
];