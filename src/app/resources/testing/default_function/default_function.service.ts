// =========================================================================>> Core Library
import { Injectable } from '@nestjs/common';


// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class DefaultFunctionService {

    constructor() { };

    async sum(): Promise<{ result: number }> {
        return { result: 4 };
    }

}
