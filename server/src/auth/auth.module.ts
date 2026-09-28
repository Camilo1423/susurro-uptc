import { Module } from '@nestjs/common';
import { SignInModule } from './sign-in/sign-in.module.js';
import { SignUpModule } from './sign-up/sign-up.module.js';

@Module({
  imports: [SignInModule, SignUpModule],
})
export class AuthModule {}
