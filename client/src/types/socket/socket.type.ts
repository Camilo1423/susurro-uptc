/** Credenciales efímeras para conectar el socket. */
export interface SocketCredentials {
  access_token: string;
  access_token_expires_at: string;
  time_to_access_token_expires: number;
}
