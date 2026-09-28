export const USE_CASES_TYPES = {
  // Salud / diagnóstico
  _HealthCheck: Symbol.for("HealthCheckUseCase"),
  // Autenticación
  _SignIn: Symbol.for("SignInUseCase"),
  _SignUp: Symbol.for("SignUpUseCase"),
  _SignOut: Symbol.for("SignOutUseCase"),
  _RefreshToken: Symbol.for("RefreshTokenUseCase"),
  _WhoAmI: Symbol.for("WhoAmIUseCase"),
  // Tipos de documento
  _GetDocumentTypes: Symbol.for("GetDocumentTypesUseCase"),
  // Socket
  _GetSocketCredentials: Symbol.for("GetSocketCredentialsUseCase"),
  // Cuenta / perfil
  _UpdateInfo: Symbol.for("UpdateInfoUseCase"),
  // Avatar (foto de perfil)
  _UploadAvatar: Symbol.for("UploadAvatarUseCase"),
  _DeleteAvatar: Symbol.for("DeleteAvatarUseCase"),
  // Conversaciones (chats)
  _GetConversations: Symbol.for("GetConversationsUseCase"),
  _CreateConversation: Symbol.for("CreateConversationUseCase"),
  _GetChatDetail: Symbol.for("GetChatDetailUseCase"),
  _SetChatAnonymity: Symbol.for("SetChatAnonymityUseCase"),
  _DeleteConversation: Symbol.for("DeleteConversationUseCase"),
  _SendChatMessage: Symbol.for("SendChatMessageUseCase"),
  _GetChatMessages: Symbol.for("GetChatMessagesUseCase"),
  _MarkChatRead: Symbol.for("MarkChatReadUseCase"),
  _StartRandomChat: Symbol.for("StartRandomChatUseCase"),
  // Mensajes (dominio de ejemplo de anomChat)
  _GetMessages: Symbol.for("GetMessagesUseCase"),
  _CreateMessage: Symbol.for("CreateMessageUseCase"),
};
