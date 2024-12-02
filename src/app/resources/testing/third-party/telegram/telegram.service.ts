// =========================================================================>> Core Library
import { Injectable } from '@nestjs/common';


// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class TelegramService {

    constructor() { };

    async getMe(): Promise<{ result: number }> {

        // Variable Declaration
        let a = 10;
        let b = 6;

        const c = a + b;

        const d = Math.sqrt(c); 

        return { result: d };
    }

}
