import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class JsReportService {
    private jsBaseUrl: string = process.env.JS_BASE_URL!;
    private jsUsername: string = process.env.JS_USERNAME!;
    private jsPassword: string = process.env.JS_PASSWORD!;
    private readonly logger = new Logger(JsReportService.name);

    private getAxiosConfig<T>(templateId: string, data: T): AxiosRequestConfig {
        return {
            url: `${this.jsBaseUrl}/api/report`,
            method: 'post',
            responseType: 'arraybuffer',
            timeout: 60000, // ← ADD 60 second timeout
            auth: {
                username: this.jsUsername,
                password: this.jsPassword,
            },
            data: {
                template: {
                    shortid: templateId,
                },
                data: data,
            },
        };
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async generateReport<T>(
        template: string,
        data: T,
        retries = 3  // ← ADD retries
    ): Promise<{ data?: string; error?: string }> {
        const result: { data?: string; error?: string } = {};

        try {
            this.logger.log(`JSReport URL: ${this.jsBaseUrl}`);
            this.logger.log(`Template ID: ${template}`);

            const response: AxiosResponse<Buffer> = await axios(
                this.getAxiosConfig(template, data)
            );

            result.data = response.data.toString('base64');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || '';
            const statusCode = error?.response?.status;

            // Retry on Too Many Requests or 429
            if ((statusCode === 429 || errorMessage.includes('Too Many Requests')) && retries > 0) {
                this.logger.log(`Too Many Requests - retrying in 3 seconds... (${retries} retries left)`);
                await this.delay(3000);
                return this.generateReport(template, data, retries - 1);
            }

            this.logger.error(`Failed to generate report`, errorMessage);
            result.error = errorMessage || 'Failed to generate the report';
        }

        return result;
    }
}