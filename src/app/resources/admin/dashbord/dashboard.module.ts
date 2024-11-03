import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JsReportService } from '@app/services/js-report.service';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, JsReportService]
})
export class DashboardModule { }
