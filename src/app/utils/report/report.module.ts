// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { JsReportService } from 'src/app/services/js-report.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TelegramService } from '@app/services/telegram.service';

@Module({
    controllers: [ReportController],
    providers: [ReportService, JsReportService, TelegramService],
    imports: []
})
export class ReportModule { }
