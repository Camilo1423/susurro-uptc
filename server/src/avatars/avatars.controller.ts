import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { AvatarType } from '../generated/prisma/enums.js';
import { ApiResponseDto } from '../shared/dtos/index.js';
import {
  AccessTokenGuard,
  AccessTokenLenientGuard,
} from '../shared/modules/tokens/index.js';
import type { Request } from '../shared/types/request.js';
import { AvatarsService, type AvatarUrls } from './avatars.service.js';

/** Tamaño máximo del archivo recibido (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

@ApiTags('avatars')
@ApiBearerAuth('access-token')
@Controller('v1/avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Subir/reemplazar la foto de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponseDto<AvatarUrls>> {
    const data = await this.avatarsService.upload(req.user.sub, file);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Foto de perfil actualizada',
      data,
    };
  }

  @Get(':userId')
  // Guard TOLERANTE: valida que el token sea del sistema (firma/issuer/audience)
  // para extraer `sub`, pero NO rechaza por expiración — así el <img> no deja de
  // cargar solo porque el access token venció (no puede refrescarlo por sí solo).
  @UseGuards(AccessTokenLenientGuard)
  @ApiOperation({
    summary:
      'Ver (streaming) el avatar de un usuario — el propio siempre; de otro ' +
      'solo si hay conversación y no está en modo anónimo. ?type=thumbnail|original',
  })
  @ApiProduces('image/webp')
  async view(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('type') type: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const avatarType =
      type === 'thumbnail' ? AvatarType.THUMBNAIL : AvatarType.ORIGINAL;

    const { buffer, contentType } = await this.avatarsService.getAvatarFile(
      req.user.sub,
      userId,
      avatarType,
    );

    res.setHeader('Content-Type', contentType);
    // Privado: cacheable solo por el cliente que lo pidió, no por proxies.
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Eliminar la foto de perfil' })
  async remove(@Req() req: Request): Promise<ApiResponseDto<object>> {
    await this.avatarsService.remove(req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      message: 'Foto de perfil eliminada',
      data: {},
    };
  }
}
