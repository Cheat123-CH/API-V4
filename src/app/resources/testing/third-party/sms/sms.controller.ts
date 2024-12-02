// =========================================================================>> Core Library
import { Body, Controller, Get, Query } from '@nestjs/common';

// =========================================================================>> Custom Library
import { SMSService } from './sms.service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class SMSController {

    constructor(private readonly _service: SMSService) { };

    // ====================================================>> Send Message
    @Get('send-message')
    async sendMessage(

        @Query('phone_num') phone_num?: string, 
        @Query('text') text?: string
    
    ): Promise<{ result: string  }> {

        return await this._service.sendMessage(phone_num, text);

    }


    
}
