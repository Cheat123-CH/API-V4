// ===========================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ===========================================================================>> Custom Library
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';


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