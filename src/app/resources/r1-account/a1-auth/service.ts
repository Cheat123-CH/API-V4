
// ===========================================================================>> Core Library
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';

// ===========================================================================>> Third Party Library
import * as bcrypt from 'bcryptjs';
import { DatabaseError, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

// ===========================================================================>> Custom Library
import Role from '@app/models/user/role.model';
import User from '@app/models/user/user.model';
import UserOTP from '@app/models/user/user_otps.model';
import UserRoles from '@app/models/user/user_roles.model';
import UsersLogs from '@app/models/user/user_logs.model';

import { EmailService } from '@app/services/email.service';
import { JwtTokenGenerator, TokenGenerator } from '@app/shared/jwt/token';
import { ActiveEnum } from 'src/app/enums/active.enum';
import { LoginRequestOTPDto } from './dto';

interface LoginPayload {
    username: string;
    password: string;
    platform: string;
}

@Injectable()
export class AuthService {

    private tokenGenerator: TokenGenerator;

    constructor(
        private readonly emailService: EmailService,

        @InjectModel(User)
        private readonly userModel: typeof User,

        @InjectModel(UserOTP)
        private readonly userOTPModel: typeof UserOTP,

        @InjectModel(UserRoles)
        private readonly userRolesModel: typeof UserRoles,

        @InjectModel(UsersLogs)
        private readonly usersLogsModel: typeof UsersLogs,
    ) {
        this.tokenGenerator = new JwtTokenGenerator();
    }

    async login(body: LoginPayload, req: Request) {
        let user: User;

        try {
            user = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { phone: body.username },
                        { email: body.username }
                    ],
                    is_active: ActiveEnum.ACTIVE
                },
                attributes: [
                    'id',
                    'name',
                    'avatar',
                    'phone',
                    'email',
                    'password',
                    'created_at'
                ],
                include: [Role]
            });

        } catch (error) {
            console.error(error);

            if (
                error instanceof DatabaseError &&
                error.message.includes('invalid identifier')
            ) {
                throw new BadRequestException(
                    'Invalid input data or database error',
                    'Database Error'
                );
            }

            throw new BadRequestException(
                'Server database error',
                'Database Error'
            );
        }

        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        if (!user.roles.length) {
            throw new ForbiddenException('Cannot access. invalid role');
        }

        const isPasswordValid = await bcrypt.compare(
            body.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new BadRequestException(
                'Invalid password',
                'Password Error'
            );
        }

        const token = this.tokenGenerator.getToken(user);

        user.last_login = new Date();
        await user.save();

        const deviceInfo = req['deviceInfo'] || {
            ip: 'unknown',
            browser: 'unknown',
            os: 'unknown',
            platform: 'Web',
            timestamp: new Date()
        };

        await this.usersLogsModel.create({
            user_id: user.id,
            action: 'login',
            details: 'User logged into the system',
            ip_address: deviceInfo.ip,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            platform: body.platform || 'Web',
            timestamp: deviceInfo.timestamp,
        });

        return {
            token,
            message: 'ចូលប្រព័ន្ធបានដោយជោគជ័យ'
        };
    }

    async switchDefaultRole(auth: User, role_id: number) {

        const userRole = await this.userRolesModel.findOne({
            where: {
                user_id: auth.id,
                role_id
            }
        });

        if (!userRole) {
            throw new BadRequestException(
                'The specified role is not associated with the user.'
            );
        }

        if (userRole.is_default) {

            const user = await this.userModel.findOne({
                where: {
                    id: auth.id,
                    is_active: ActiveEnum.ACTIVE
                },
                attributes: [
                    'id',
                    'name',
                    'avatar',
                    'phone',
                    'email',
                    'password',
                    'created_at'
                ],
                include: [Role]
            });

            const token = this.tokenGenerator.getToken(user);

            return {
                token,
                message: 'This role is already set as default.',
            };
        }

        const transaction =
            await this.userRolesModel.sequelize.transaction();

        try {

            await this.userRolesModel.update(
                { is_default: false },
                {
                    where: {
                        user_id: auth.id,
                        is_default: true
                    },
                    transaction
                }
            );

            await userRole.update(
                { is_default: true },
                { transaction }
            );

            await transaction.commit();

        } catch (error) {

            await transaction.rollback();

            throw new InternalServerErrorException(
                'Failed to switch default role.'
            );
        }

        const user = await this.userModel.findOne({
            where: {
                id: auth.id,
                is_active: ActiveEnum.ACTIVE
            },
            attributes: [
                'id',
                'name',
                'avatar',
                'phone',
                'email',
                'password',
                'created_at'
            ],
            include: [Role]
        });

        if (!user) {
            throw new InternalServerErrorException(
                'Failed to retrieve updated user information.'
            );
        }

        const token = this.tokenGenerator.getToken(user);

        return {
            token,
            message: 'User default role has been switched successfully.',
        };
    }

    private generateOTP(): string {
        return Math.floor(
            100000 + Math.random() * 900000
        ).toString();
    }

    async sendOTP(
        username: string
    ): Promise<{ data: boolean; message: string }> {

        if (!username) {
            throw new BadRequestException(
                'Email or phone is required'
            );
        }

        const user = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { phone: username },
                    { email: username }
                ],
                is_active: ActiveEnum.ACTIVE,
            },
        });

        if (!user) {
            throw new BadRequestException(
                'User not found or inactive'
            );
        }

        const otp = this.generateOTP();

        await this.userOTPModel.create({
            user_id: user.id,
            otp,
            expires_at: new Date(
                Date.now() + 2 * 60 * 1000
            ),
        });

        await this.emailService.sendHTMLMessage(
            user.email,
            'Your OTP Code',
            `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 1 minute.</p>`
        );

        return {
            data: true,
            message: 'OTP sent successfully'
        };
    }

    async checkExistUser(
        username: string
    ): Promise<{ data: boolean; message: string }> {

        if (!username) {
            throw new BadRequestException(
                'Email or phone is required'
            );
        }

        const user = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { phone: username },
                    { email: username }
                ],
                is_active: ActiveEnum.ACTIVE,
            },
        });

        if (!user) {
            return {
                data: false,
                message: 'អ្នកប្រើប្រាស់មិនមាននៅក្នុងប្រព័ន្ធទេ'
            };
        }

        return {
            data: true,
            message: 'អ្នកប្រើប្រាស់មាននៅក្នុងប្រព័ន្ធ'
        };
    }

    async verifyOTP(
        body: LoginRequestOTPDto,
        req: Request
    ): Promise<{ token: string; message: string }> {

        const user = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { phone: body.username },
                    { email: body.username }
                ]
            },
            attributes: [
                'id',
                'name',
                'avatar',
                'phone',
                'email',
                'password',
                'created_at'
            ],
            include: [Role]
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const userOtp = await this.userOTPModel.findOne({
            where: {
                user_id: user.id,
                otp: body.otp,
                expires_at: {
                    [Op.gt]: new Date()
                },
            },
        });

        if (!userOtp) {
            throw new UnauthorizedException(
                'Invalid or expired OTP'
            );
        }

        await userOtp.destroy();

        const token = this.tokenGenerator.getToken(user);

        user.last_login = new Date();
        await user.save();

        const deviceInfo = req['deviceInfo'] || {
            ip: 'unknown',
            browser: 'unknown',
            os: 'unknown',
            platform: 'Web',
            timestamp: new Date()
        };

        await this.usersLogsModel.create({
            user_id: user.id,
            action: 'login',
            details: 'User logged into the system',
            ip_address: deviceInfo.ip,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            platform: deviceInfo.platform || 'Web',
            timestamp: deviceInfo.timestamp,
        });

        return {
            token,
            message: 'ចូលប្រព័ន្ធបានដោយជោគជ័យ'
        };
    }
}