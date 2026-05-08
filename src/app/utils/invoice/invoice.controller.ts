import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { InvoiceService } from './invoice.service';

@Controller()
export class InvoiceController {
    
    constructor(private readonly _service: InvoiceService) { };

    @Get('order-invoice/:receiptNumber')
    async generateReport(@Param('receiptNumber') receiptNumber: string) {
        return this._service.generateReport(receiptNumber);
    }
}
