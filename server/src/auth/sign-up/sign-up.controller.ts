import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../../shared/dtos/index.js';
import {
  ApiErrorResponse,
  ApiStandardResponse,
} from '../../shared/decorators/index.js';
import { SignInDto } from '../sign-in/dto/response/sign-in-response.dto.js';
import type { UserBase } from '../interfaces/sign-in.interface.js';
import { SignUpService } from './sign-up.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';

@ApiTags('auth')
@Controller('v1/auth')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Registro de usuario (queda activo y confirmado)' })
  @ApiStandardResponse(SignInDto, HttpStatus.CREATED, 'Usuario registrado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'Correo o usuario ya en uso')
  async signUp(@Body() dto: SignUpDto): Promise<ApiResponseDto<UserBase>> {
    try {
      const data = await this.signUpService.signUp(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuario registrado exitosamente',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }
}
