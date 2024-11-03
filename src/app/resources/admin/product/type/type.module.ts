// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { FileService } from '@app/services/file.service';
import { ProductsTypeController } from './type.controller';
import { ProductsTypeService } from './type.service';

@Module({
    controllers: [ProductsTypeController],
    providers: [ProductsTypeService, FileService]
})
export class ProductsTypeModule { }
