// =========================================================================>> Core Library
import { Injectable } from '@nestjs/common';


// ======================================= >> Code Starts Here << ========================== //
@Injectable()
export class SMSService {

    constructor() { };



    async sendMessage( phone_num: string = '', text:string = '' ): Promise<{ result: string }> {

        return { result: 'SMS has been sent to ' + phone_num + '.' };
    }

}
