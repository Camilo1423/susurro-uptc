export interface TokensOnSignIn {
  tokens: {
    access_tk: string;
    refresh_tk: string;
    time_to_access_token_expires: number;
    time_to_refresh_token_expires: number;
  };
}

/** Datos públicos del usuario en sesión (nunca incluye password ni blockedAt). */
export interface UserBase {
  id: string;
  email: string;
  username: string;
  firstName: string;
  secondName: string | null;
  firstLastName: string;
  secondLastName: string | null;
  documentTypeId: string;
  documentNumber: string;
  phoneNumber: string | null;
  /** PIN de descubrimiento (único en el sistema). */
  pin: string;
  status: string;
  emailVerified: boolean;
  requireChangePassword: boolean;
  failedAttempts: number;
  lockedUntil: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  documentTypeCode: string;
  documentType: string;
  /** Fotos de perfil (URLs públicas). `null` si no ha subido ninguna. */
  avatar: {
    thumbnail: string | null;
    original: string | null;
  };
}

export type SignIn = UserBase;
