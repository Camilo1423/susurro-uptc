import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller.js';
import { AvatarsService } from './avatars.service.js';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService],
})
export class AvatarsModule {}
