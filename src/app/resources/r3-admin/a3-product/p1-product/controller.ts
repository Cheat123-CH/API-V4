// ===========================================================================>> Core Library
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes } from '@nestjs/common';

// ===========================================================================>> Costom Library
import UserDecorator from '@app/core/decorators/user.decorator';
import { ProductTypeExistsPipe } from '@app/core/pipes/product.pipe';
import User from '@app/models/user/user.model';
import Product from 'src/app/models/product/product.model';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './service';
@Controller()
export class ProductController {

    constructor(private _service: ProductService) { };

    @Get('setup')
    async setup(){
        return await this._service.setup();
    }

    @Get('/')
    async getData(
        @Query('page_size') page_size?  : number,
        @Query('page') page?            : number,
        @Query('key') key?              : string,
        @Query('type_id') type_id?      : number,
        @Query('creator_id') creator_id?: number,
        @Query('startDate') startDate?  : string,
        @Query('endDate') endDate?      : string
    ) {
        if (!page_size) {
            page_size = 10;
        }
        if (!page) {
            page = 1;
        }

        return await this._service.getData(page_size, page, key, type_id, creator_id, startDate, endDate);
    }

    @Get('/:id')
    async view(@Param('id', ParseIntPipe) id: number) {
        return await this._service.view(id);
    }

    @Post()
    @UsePipes(ProductTypeExistsPipe)
    async create(@Body() body: CreateProductDto, @UserDecorator() auth: User,): Promise<{ data: Product, message: string }> {
        return await this._service.create(body, auth.id);
    }

    @Put(':id')
    @UsePipes(ProductTypeExistsPipe)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto
    ) {
        return this._service.update(body, id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this._service.delete(id);
    }
}
