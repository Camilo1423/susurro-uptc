import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../shared/dtos/index.js';
import {
  ApiErrorResponse,
  ApiStandardResponse,
} from '../shared/decorators/index.js';
import { AccessTokenGuard } from '../shared/modules/tokens/index.js';
import type { Request } from '../shared/types/request.js';
import { SignInDto } from '../auth/sign-in/dto/response/sign-in-response.dto.js';
import type { UserBase } from '../auth/interfaces/sign-in.interface.js';
import { AccountService } from './account.service.js';
import { UpdateInfoDto } from './dto/update-info.dto.js';

@ApiTags('account')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('update-info')
  @ApiOperation({ summary: 'Actualizar datos personales del usuario' })
  @ApiStandardResponse(SignInDto, HttpStatus.OK, 'Datos actualizados')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  async updateInfo(
    @Req() req: Request,
    @Body() dto: UpdateInfoDto,
  ): Promise<ApiResponseDto<UserBase>> {
    const data = await this.accountService.updateInfo(req.user.sub, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Datos actualizados exitosamente',
      data,
    };
  }
}
