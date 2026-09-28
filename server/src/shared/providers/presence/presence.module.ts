import { Global, Module } from '@nestjs/common';
import { PresenceService } from './presence.service.js';

/** Presencia (online/away) compartida entre el gateway y las conversaciones. */
@Global()
@Module({
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
