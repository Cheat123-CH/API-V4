// =========================================================================>> Core Library
import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

// =========================================================================>> Custom Library
import { FileDto } from "./dto";


interface UploadBase64ImageBody {
    folder: string;
    image: string;
}

// Union type for request bodies
type RequestBody = UploadBase64ImageBody | FormData;

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class FileController {

    constructor(private readonly httpService: HttpService) { }

    // ====================================================>> Sum 1
    @Post('file')
    async uploadFile(
        @Body() body: FileDto // Catch file from Post
    ){

        // return body; 

        // Prepare Payload
        const data: UploadBase64ImageBody = {
            image   : body.image,
            folder  : body.folder
        };

        // Prepare Response from File Service and Return to Postman
        const result: { file?: File, error?: string } = {};

        // Call File Serivce
        try {

            const response = await firstValueFrom(this.httpService.post('http://localhost:4000/api/file/upload-base64', data));
            result.file = response.data.data;

        } catch (error) {
            result.error = error?.response?.data?.message || 'Something went wrong';
        }

        // Return to Postman
        return {
            message: "File has been uploaded to file service", 
            result: result.file
        };


    }

    
    
}
