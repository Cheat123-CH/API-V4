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
            auth: {
                username: this.jsUsername,
                password: this.jsPassword,
            },
            data: {
                template: {
                    // 🔥 USE SHORTID INSTEAD OF NAME
                    shortid: templateId,
                },
                data: data,
            },
        };
    }

    async generateReport<T>(
        template: string,
        data: T
    ): Promise<{ data?: string; error?: string }> {
        const result: { data?: string; error?: string } = {};

        try {
            // ✅ Debug logs (important)
            this.logger.log(`JSReport URL: ${this.jsBaseUrl}`);
            this.logger.log(`Template ID: ${template}`);

            const response: AxiosResponse<Buffer> = await axios(
                this.getAxiosConfig(template, data)
            );

            result.data = response.data.toString('base64');
        } catch (error: any) {
            this.logger.error(
                `Failed to generate report`,
                error?.response?.data || error.message
            );

            result.error =
                error?.response?.data?.message ||
                'Failed to generate the report';
        }

        return result;
    }
}