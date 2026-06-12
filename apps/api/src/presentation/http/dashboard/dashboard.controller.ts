import { Controller, Get } from '@nestjs/common';
import { GetDashboardStatsUseCase } from '../../../application/dashboard/queries/get-dashboard-stats.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DecodedFirebaseToken } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboardStats: GetDashboardStatsUseCase) {}

  @Get('stats')
  stats(@CurrentUser() user: DecodedFirebaseToken) {
    return this.getDashboardStats.execute(user.uid);
  }
}
