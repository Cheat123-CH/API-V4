// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { FileService } from '@app/services/file.service';
import { ProductTypeController } from './type.controller';
import { ProductTypeService } from './type.service';

@Module({
    controllers: [ProductTypeController],
    providers: [ProductTypeService, FileService]
})
export class ProductTypeModule { }
