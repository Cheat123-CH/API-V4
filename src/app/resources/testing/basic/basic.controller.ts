// =========================================================================>> Core Library
import { Body, Controller, Get, Query } from '@nestjs/common';

// =========================================================================>> Custom Library
import { BasicService } from './basic.service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class BasicController {

    constructor(private readonly _service: BasicService) { };

    // ====================================================>> Sum 1
    @Get('sum-1')
    sum1(){

        let a = 10;
        let b = 6;

        const c = a + b;

        return c; 

    }

    // ====================================================>> Sum 2
    @Get('sum-2')
    sum2(

        @Query('a') a?: number,
        @Query('b') b?: number
    
    ){
        const c = a + b;
        return c; 

    }


    
}
