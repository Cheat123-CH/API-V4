import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EmailService } from '@app/services/email.service';
import { AuthController } from './controller';
import { AuthService } from './service';

import User from '@app/models/user/user.model';
import UserOTP from '@app/models/user/user_otps.model';
import UserRoles from '@app/models/user/user_roles.model';
import UsersLogs from '@app/models/user/user_logs.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, UserOTP, UserRoles, UsersLogs])
    ],
    controllers: [AuthController],
    providers: [AuthService, EmailService]
})
export class AuthModule { }