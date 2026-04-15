import { Controller, Get } from '@nestjs/common';
import { GetDashboardStatsUseCase } from '../../../application/dashboard/queries/get-dashboard-stats.use-case';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboardStats: GetDashboardStatsUseCase) {}

  @Get('stats')
  stats() {
    return this.getDashboardStats.execute();
  }
}
