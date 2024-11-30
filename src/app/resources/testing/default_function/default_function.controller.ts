// =========================================================================>> Core Library
import { Body, Controller, Get, Post } from '@nestjs/common';

// =========================================================================>> Custom Library
import { DefaultFunctionService } from './default_function.service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class DefaultFunctionController {

    constructor(private readonly _service: DefaultFunctionService) { };

    @Get('sum')
    async sum(): Promise<{ result: number  }> {
        return await this._service.sum();
    }

    
}
