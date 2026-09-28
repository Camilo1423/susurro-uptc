/** Clave en localStorage con el estado del sign-in (referencia de sesión). */
export const SIGN_IN_STATUS_KEY = "statusSignIn";

/**
 * Estado del sign-in. Como las cookies de sesión son httpOnly (no legibles
 * desde JS), este flag en localStorage es la referencia de sesión del front.
 */
export enum SignInStatus {
  /** Login completo: sesión activa. */
  Done = "DONE",
}

/**
 * Usuario autenticado en sesión. Espeja el `UserBase` que devuelve el server
 * (`/api/v1/auth/sign-in` y `/who-am-i`). Las fechas llegan como string (JSON).
 */
export interface AuthUser {
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
  /** Fuerza el flujo de cambio de contraseña obligatorio. */
  requireChangePassword: boolean;
  failedAttempts: number;
  lockedUntil: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  /** Código del tipo de documento (p. ej. "CC"). */
  documentTypeCode: string;
  /** Nombre del tipo de documento (p. ej. "Cédula de ciudadanía"). */
  documentType: string;
  /** Rutas del endpoint para ver las fotos (streaming); null si no hay foto. */
  avatar: {
    thumbnail: string | null;
    original: string | null;
  };
}

/** Datos personales editables por el propio usuario. */
export interface UpdateInfoRequest {
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  phoneNumber?: string;
  documentTypeId?: string;
  documentNumber?: string;
}

/** Rutas de las dos versiones del avatar. */
export interface AvatarUrls {
  thumbnail: string | null;
  original: string | null;
}

export interface SignInRequest {
  email: string;
  password: string;
}

/** Datos para el registro público de un usuario. */
export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  documentTypeId: string;
  documentNumber: string;
  phoneNumber?: string;
}

/** Tipo de documento para poblar el select del registro. */
export interface DocumentTypeOption {
  id: string;
  code: string;
  name: string;
}

/** Resultado del sign-in: usuario autenticado directamente. */
export type SignInResult = AuthUser;
