// =========================================================================>> Core Library
import { Body, Controller, Get, Query } from '@nestjs/common';

// =========================================================================>> Custom Library
import { TelegramService } from './telegram.service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class TelegramController {

    constructor(private readonly _service: TelegramService) { };

    // ====================================================>> Sum 1
    @Get('me')
    async getMe(): Promise<{ result: number  }> {

        return await this._service.getMe();

    }


    
}
