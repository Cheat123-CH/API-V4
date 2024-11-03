// ===========================================================================>> Core Library
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { SaleService } from './sale.service';
@Controller()
export class SaleController {

    constructor(private readonly _service: SaleService) { };

    @Get('/setup')
    async getUser(){
        return await this._service.getUser();
    }
    
    @Get()
    async getAllSale(
        @Query('page_size') page_size?: number,
        @Query('page') page?: number,
        @Query('key') key?: string,
        @Query('cashier') cashier_id?: number,
        @Query('platform') platform?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        if (!page_size) {
            page_size = 10;
        }
        if (!page) {
            page = 1;
        }
        if(platform === null){
            platform = '';
        }

        return await this._service.listing(page_size, page, key, cashier_id, platform, startDate, endDate);
    }


    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this._service.delete(id);
    }
}