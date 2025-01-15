// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { FileService } from '@app/services/file.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, FileService]
})

export class ProfileModule { }
