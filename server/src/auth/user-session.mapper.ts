import type { User } from '../generated/prisma/client.js';
import { AvatarType } from '../generated/prisma/enums.js';
import { UserBase } from './interfaces/sign-in.interface.js';

/** Fila mínima de avatar necesaria para armar la sesión. */
type AvatarRow = { type: AvatarType; url: string };

/** Usuario con las relaciones mínimas necesarias para armar la sesión. */
export type UserWithSessionRelations = User & {
  documentType: { code: string; name: string };
  avatars: AvatarRow[];
};

/**
 * Fuente ÚNICA de verdad del objeto "sesión de usuario". Lo usan sign-in y
 * who-am-i para devolver EXACTAMENTE la misma estructura. Nunca expone
 * `password` ni `blockedAt`.
 */
export function toUserSession(user: UserWithSessionRelations): UserBase {
  const {
    password: _password,
    blockedAt: _blockedAt,
    documentType,
    avatars,
    ...rest
  } = user;

  const avatar = {
    thumbnail:
      avatars.find((a) => a.type === AvatarType.THUMBNAIL)?.url ?? null,
    original: avatars.find((a) => a.type === AvatarType.ORIGINAL)?.url ?? null,
  };

  return {
    ...rest,
    documentTypeCode: documentType.code,
    documentType: documentType.name,
    avatar,
  };
}
