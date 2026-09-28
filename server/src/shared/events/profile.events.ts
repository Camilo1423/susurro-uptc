/** Evento interno: un usuario cambió su nombre o su foto de perfil. */
export const PROFILE_UPDATED = 'profile.updated';

export interface ProfileUpdatedEvent {
  /** Usuario que cambió su información. */
  userId: string;
}
