import { Module } from '@nestjs/common';
import { SignInController } from './sign-in.controller.js';
import { SignInService } from './sign-in.service.js';

@Module({
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
