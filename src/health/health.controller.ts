import { Controller, Get } from '@nestjs/common';
import { Health } from './entities/health.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor() {}

  @ApiOkResponse({
    status: 200,
    description: 'API is healthy',
    example: { message: 'Healthy', data: {} },
  })
  @ApiOperation({ summary: 'Get API server health' })
  @Get()
  getHealth(): Health {
    return { message: 'Healthy' };
  }
}
