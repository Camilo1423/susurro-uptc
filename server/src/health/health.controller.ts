import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../shared/dtos/index.js';

@ApiTags('health')
@Controller('v1/health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Estado del servicio' })
  check(): ApiResponseDto<{ status: string }> {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { status: 'ok' },
    };
  }
}
